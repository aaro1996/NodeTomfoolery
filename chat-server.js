//Base code from wiki


// Require the functionality we need to use:
var http = require('http'),
	url = require('url'),
	path = require('path'),
	mime = require('mime'),
	path = require('path'),
	socketio = require("socket.io"),
	fs = require('fs');
 
// Make a simple fileserver for all of our static content.
// Everything underneath <STATIC DIRECTORY NAME> will be served.
var app = http.createServer(function(req, resp){
	var filename = path.join(__dirname, "static", url.parse(req.url).pathname);
	(fs.exists || path.exists)(filename, function(exists){
		console.log(url.parse(req.url).pathname);
		if (exists && url.parse(req.url).pathname == "/my_script.js" || url.parse(req.url).pathname == "/style.css") {
			fs.readFile(filename, function(err, data){
				if (err) {
					// File exists but is not readable (permissions issue?)
					resp.writeHead(500, {
						"Content-Type": "text/plain"
					});
					resp.write("Internal server error: could not read file");
					resp.end();
					return;
				}
 
				// File exists and is readable
				var mimetype = mime.lookup(filename);
				resp.writeHead(200, {
					"Content-Type": mimetype
				});
				resp.write(data);
				resp.end();
				return;
			});
		} else {
			// File does not exist
			fs.readFile("client.html", function(err, data){
				// This callback runs when the client.html file has been read from the filesystem.
				if(err) return resp.writeHead(500);
				resp.writeHead(200);
				resp.end(data);
			});
		}
	});
});

app.listen(3456); 
// Do the Socket.IO magic:
var room_info_object = {};
room_info_object['lobby'] = {name: 'lobby', cur_users: {}, password: false};
room_info_object['lobby']['banned_list'] = {};
var username_info_object = {};
var socket_id_to_username = {};
var io = socketio.listen(app);
var cur_date = new Date();
io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.
	socket_id_to_username[socket.id] = true;
 	socket.on('join_room_request', function(data) {
 		console.log("join_room_request: " + data['room']);
 		if (!room_info_object[data['room']]) {
 			console.log("failed?");
 			return;
 		}
 		if (verify_username_socket_link(data['username'], socket.id)) {
 			var send_object = {};
 			if(room_info_object[data['room']]['banned_list'][data['username']]) {
 				send_object['success'] = false;
 				send_object['fail_message'] = "You're banned from this room!";
 				socket.emit("join_room_request_response", send_object);
 			}
 			if (room_info_object[data['room']]['password'] !== data['password']) {
 				send_object['success'] = false;
 				send_object['fail_message'] = "Wrong password";
 				socket.emit("join_room_request_response", send_object);
 			}
 			username_socket_leave_current_room(data['username'], socket);
 			send_object['admin_rights'] = (room_info_object[data['room']]['admin'] == data['username']);
 			send_object['room'] = data['room'];
 			send_object['success'] = true;
 			console.log("Added " + data['username'] + " to room: " + data['room']);
 			username_socket_join_room(data['username'], data['room'], socket);
 			socket.emit("join_room_request_response", send_object);
 		}
 	});


	socket.on("user_list_request", function(data) {
		if (!verify_username_socket_room_link(data['username'], socket.id, data['room'])) {
			return;
		}
		for (user in room_info_object[data['room']]['cur_users']) {  //Adds the current users into the new user's list of users in the room
 			var send_object = {};
 			send_object['operation'] = 1;
			send_object['added_user'] = user;
			socket.emit("userlist_edit", send_object);
 		}
	});


 	socket.on('create_room_request', function(data) {
 		var send_object = {};
 		if (room_info_object[data['room']]) {
 			send_object['success'] = false;
 			send_object['error'] = "There is already a room by this name";
 			console.log("Attempted to create existing room");
 			return;
 		}
 		if (!verify_username_socket_link(data['username'], socket.id)) {
 			send_object['success'] = false;
 			send_object['error'] = "There is an issue with your login";
 			console.log("Attempted to create room with failed login");
 			return;
 		}
 		room_info_object[data['room']] = {name: data['room'], cur_users: {}, password: data['password'], admin: data['username']};
 		send_object['success'] = true;
 		send_object['room'] = data['room'];
 		socket.emit("create_room_request_response", send_object);
 		io.sockets.emit("add_room", {room: data['room'], password: !!data['password']});
 	});

 	socket.on('disconnect', function(data) {
 		if (socket_id_to_username[socket.id]) {
 			if (socket_id_to_username[socket.id] === true) {
 				console.log("unregisted user disconnected")
 				delete socket_id_to_username[socket.id];
 			} else {
 				console.log(socket_id_to_username[socket.id] + " has disconnected");
 				username_socket_leave_current_room(socket_id_to_username[socket.id], socket);
 				delete username_info_object[socket_id_to_username[socket.id]];
 				delete socket_id_to_username[socket.id];
 			}
 		}
 	});




 	socket.on('username_request', function(data) {
 		var send_object = {};
 		console.log("username_request: " + data['req_username']);
 		if (!username_info_object[data['req_username']]) {
 			username_info_object[data['req_username']] = {s_id: socket.id, room: false};
 			socket_id_to_username[socket.id] = data['req_username'];
 			send_object['accepted'] = true;
 			send_object['username_set'] = data['req_username'];
 			if (data['cur_username']) {
 				delete username_info_object[data['cur_username']];
 			}
 		} else {
 			send_object['accepted'] = false;
 			send_object['extra_message'] = "That screen name is taken, pick another please.";
 		}
 		socket.emit("username_request_response", send_object);
 	});



	socket.on('send_room_message', function(data) {
		// This callback runs when the server receives a new message from the client.
 		var send_object = {};
 		if (verify_username_socket_room_link(data['username'], socket.id, data['room'])) {
 			console.log("message in " + data['room'] + " by " + data['username'] + " at " + data['time'] + ": "+ data['message']); 
 			send_object['room'] = data['room'];
 			send_object['time'] = data['time'];
 			send_object['username'] = data['username'];
 			send_object['message'] = data['message'];
 			io.sockets.to(data['room']).emit("message_to_client", send_object); // broadcast the message to other users in the given room
 		} else {
 			console.log("failed message in " + data['room'] + " by " + data['username'] + " at " + data['time'] + ": "+ data['message']);
 			send_error("username_socket_room_error", socket);
 		}
	});
});
function username_socket_leave_current_room(username, socket) {
	if (!verify_username_socket_link(username, socket.id)) {
		return;
	}
	if (username_info_object[username]['room']) {
		username_socket_leave_room(username, username_info_object[username]['room'], socket);
	}
};

function username_socket_leave_room(username, room, socket) {
	if (!verify_username_socket_room_link(username, socket.id, room)) {
		return;
	}
	var socket_id = socket.id;
	username_info_object[username]['room'] = false;
	socket.leave(room);
	remove_user_from_room(room, username);
	
};

function username_socket_join_room(username, room, socket) {
	if (!verify_username_socket_link(username, socket.id)) {
		return;
	}
	var socket_id = socket.id;
	username_info_object[username]['room'] = room;
	socket.join(room);
	add_user_to_room(room, username);
	
};

function remove_user_from_room(room, username) {
	delete room_info_object[room]['cur_users'][username];
	var send_object = {};
	send_object['operation'] = 0; //remove user
	send_object['removed_user'] = username;
	io.sockets.to(room).emit("userlist_edit", send_object);
};

function add_user_to_room(room, username) {
	room_info_object[room]['cur_users'][username] = true;
	var send_object = {};
	send_object['operation'] = 1; //add user
	send_object['added_user'] = username;
	io.sockets.to(room).emit("userlist_edit", send_object);
};

function change_username_in_room(room, username_old, username_new) {
	delete room_info_object[room]['cur_users'][username_old];
	room_info_object[room]['cur_users'][username_new] = true;
	var send_object = {};
	send_object['operation'] = 2; //edit username
	send_object['old_username'] = username_old;
	send_object['new_username'] = username_new;
	io.sockets.to(room).emit("userlist_edit", send_object);
};

function verify_username_socket_link(username, socket_id) {
	if (!username) {
		//console.log("failed username check")
		return false;
	}
	return (socket_id_to_username[socket_id] == username  && username_info_object[username]['s_id'] == socket_id);
};

function verify_username_socket_room_link(username, socket_id, room_name) {
	if (!verify_username_socket_link(username, socket_id)) {
		//console.log("failed_username_socket_check");
		return false;
	}
	return ((username_info_object[socket_id_to_username[socket_id]]['room'] === room_name) && room_info_object[room_name]['cur_users'][username]);
};

function send_error(error, socket) {};