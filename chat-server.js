//Base code from wiki
//Ascii art from  http://lunicode.com/bigtext

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
		//console.log(url.parse(req.url).pathname);
		if (exists && url.parse(req.url).pathname == "/my_script.js" || url.parse(req.url).pathname == "/style.css" || url.parse(req.url).pathname == "/airhorn.mp3" || url.parse(req.url).pathname == "/wow.mp3" || url.parse(req.url).pathname == "/skelly.mp3" || url.parse(req.url).pathname == "/lol.mp3" || url.parse(req.url).pathname == "/friends.mp3") {
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

/*
                                                                                                                                                                                                                                                                                                         
                                                                                                                                                                                                                                dddddddd                                                                 
   SSSSSSSSSSSSSSS                                      kkkkkkkk                                     tttt               IIIIIIIIII     OOOOOOOOO          HHHHHHHHH     HHHHHHHHH                                               d::::::dlllllll                                                          
 SS:::::::::::::::S                                     k::::::k                                  ttt:::t               I::::::::I   OO:::::::::OO        H:::::::H     H:::::::H                                               d::::::dl:::::l                                                          
S:::::SSSSSS::::::S                                     k::::::k                                  t:::::t               I::::::::I OO:::::::::::::OO      H:::::::H     H:::::::H                                               d::::::dl:::::l                                                          
S:::::S     SSSSSSS                                     k::::::k                                  t:::::t               II::::::IIO:::::::OOO:::::::O     HH::::::H     H::::::HH                                               d:::::d l:::::l                                                          
S:::::S               ooooooooooo       cccccccccccccccc k:::::k    kkkkkkk eeeeeeeeeeee    ttttttt:::::ttttttt           I::::I  O::::::O   O::::::O       H:::::H     H:::::H    aaaaaaaaaaaaa  nnnn  nnnnnnnn        ddddddddd:::::d  l::::l     eeeeeeeeeeee    rrrrr   rrrrrrrrr       ssssssssss   
S:::::S             oo:::::::::::oo   cc:::::::::::::::c k:::::k   k:::::kee::::::::::::ee  t:::::::::::::::::t           I::::I  O:::::O     O:::::O       H:::::H     H:::::H    a::::::::::::a n:::nn::::::::nn    dd::::::::::::::d  l::::l   ee::::::::::::ee  r::::rrr:::::::::r    ss::::::::::s  
 S::::SSSS         o:::::::::::::::o c:::::::::::::::::c k:::::k  k:::::ke::::::eeeee:::::eet:::::::::::::::::t           I::::I  O:::::O     O:::::O       H::::::HHHHH::::::H    aaaaaaaaa:::::an::::::::::::::nn  d::::::::::::::::d  l::::l  e::::::eeeee:::::eer:::::::::::::::::r ss:::::::::::::s 
  SS::::::SSSSS    o:::::ooooo:::::oc:::::::cccccc:::::c k:::::k k:::::ke::::::e     e:::::etttttt:::::::tttttt           I::::I  O:::::O     O:::::O       H:::::::::::::::::H             a::::ann:::::::::::::::nd:::::::ddddd:::::d  l::::l e::::::e     e:::::err::::::rrrrr::::::rs::::::ssss:::::s
    SSS::::::::SS  o::::o     o::::oc::::::c     ccccccc k::::::k:::::k e:::::::eeeee::::::e      t:::::t                 I::::I  O:::::O     O:::::O       H:::::::::::::::::H      aaaaaaa:::::a  n:::::nnnn:::::nd::::::d    d:::::d  l::::l e:::::::eeeee::::::e r:::::r     r:::::r s:::::s  ssssss 
       SSSSSS::::S o::::o     o::::oc:::::c              k:::::::::::k  e:::::::::::::::::e       t:::::t                 I::::I  O:::::O     O:::::O       H::::::HHHHH::::::H    aa::::::::::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::::::::::::e  r:::::r     rrrrrrr   s::::::s      
            S:::::So::::o     o::::oc:::::c              k:::::::::::k  e::::::eeeeeeeeeee        t:::::t                 I::::I  O:::::O     O:::::O       H:::::H     H:::::H   a::::aaaa::::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e::::::eeeeeeeeeee   r:::::r                  s::::::s   
            S:::::So::::o     o::::oc::::::c     ccccccc k::::::k:::::k e:::::::e                 t:::::t    tttttt       I::::I  O::::::O   O::::::O       H:::::H     H:::::H  a::::a    a:::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::e            r:::::r            ssssss   s:::::s 
SSSSSSS     S:::::So:::::ooooo:::::oc:::::::cccccc:::::ck::::::k k:::::ke::::::::e                t::::::tttt:::::t     II::::::IIO:::::::OOO:::::::O     HH::::::H     H::::::HHa::::a    a:::::a  n::::n    n::::nd::::::ddddd::::::ddl::::::le::::::::e           r:::::r            s:::::ssss::::::s
S::::::SSSSSS:::::So:::::::::::::::o c:::::::::::::::::ck::::::k  k:::::ke::::::::eeeeeeee        tt::::::::::::::t     I::::::::I OO:::::::::::::OO      H:::::::H     H:::::::Ha:::::aaaa::::::a  n::::n    n::::n d:::::::::::::::::dl::::::l e::::::::eeeeeeee   r:::::r            s::::::::::::::s 
S:::::::::::::::SS  oo:::::::::::oo   cc:::::::::::::::ck::::::k   k:::::kee:::::::::::::e          tt:::::::::::tt     I::::::::I   OO:::::::::OO        H:::::::H     H:::::::H a::::::::::aa:::a n::::n    n::::n  d:::::::::ddd::::dl::::::l  ee:::::::::::::e   r:::::r             s:::::::::::ss  
 SSSSSSSSSSSSSSS      ooooooooooo       cccccccccccccccckkkkkkkk    kkkkkkk eeeeeeeeeeeeee            ttttttttttt       IIIIIIIIII     OOOOOOOOO          HHHHHHHHH     HHHHHHHHH  aaaaaaaaaa  aaaa nnnnnn    nnnnnn   ddddddddd   dddddllllllll    eeeeeeeeeeeeee   rrrrrrr              sssssssssss                                                                                                                                                                                                                                                                                   
                                                                                                                                                                                                                                                                                                         
*/

io.sockets.on("connection", function(socket){
	// This callback runs when a new Socket.IO connection is established.
	socket_id_to_username[socket.id] = true;

	/*
       _       _         _____                         _____                            _   
      | |     (_)       |  __ \                       |  __ \                          | |  
      | | ___  _ _ __   | |__) |___   ___  _ __ ___   | |__) |___  __ _ _   _  ___  ___| |_ 
  _   | |/ _ \| | '_ \  |  _  // _ \ / _ \| '_ ` _ \  |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |__| | (_) | | | | | | | \ \ (_) | (_) | | | | | | | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \____/ \___/|_|_| |_| |_|  \_\___/ \___/|_| |_| |_| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                                                     | |                    
                                                                     |_|                    
*/
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
 				return;
 			}
 			if (room_info_object[data['room']]['password'] !== data['password']) {
 				send_object['success'] = false;
 				send_object['fail_message'] = "Wrong password";
 				socket.emit("join_room_request_response", send_object);
 				return;
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


/*
  _    _                 _      _     _     _____                            _   
 | |  | |               | |    (_)   | |   |  __ \                          | |  
 | |  | |___  ___ _ __  | |     _ ___| |_  | |__) |___  __ _ _   _  ___  ___| |_ 
 | |  | / __|/ _ \ '__| | |    | / __| __| |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |__| \__ \  __/ |    | |____| \__ \ |_  | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \____/|___/\___|_|    |______|_|___/\__| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                                          | |                    
                                                          |_|                    
*/

	socket.on("user_list_request", function(data) {
		if (!verify_username_socket_room_link(data['username'], socket.id, data['room'])) {
			return;
		}
		for (user in room_info_object[data['room']]['cur_users']) {  //Adds the current users into the new user's list of users in the room
 			var send_object = {};
 			send_object['operation'] = 1;
			send_object['added_user'] = user;
			if (room_info_object[data['room']]['cur_users'][user]) {
				socket.emit("userlist_edit", send_object);
			}
 		}
	});

/*
   _____                _         _____                         _____                            _   
  / ____|              | |       |  __ \                       |  __ \                          | |  
 | |     _ __ ___  __ _| |_ ___  | |__) |___   ___  _ __ ___   | |__) |___  __ _ _   _  ___  ___| |_ 
 | |    | '__/ _ \/ _` | __/ _ \ |  _  // _ \ / _ \| '_ ` _ \  |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |____| | |  __/ (_| | ||  __/ | | \ \ (_) | (_) | | | | | | | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \_____|_|  \___|\__,_|\__\___| |_|  \_\___/ \___/|_| |_| |_| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                                                              | |                    
                                                                              |_|                    
*/

 	socket.on('create_room_request', function(data) {
 		var send_object = {};
 		if (room_info_object[data['room']]) {
 			send_object['success'] = false;
 			send_object['error'] = "There is already a room by this name";
 			console.log("Attempted to create existing room");
 			socket.emit("create_room_request_response", send_object);
 			return;
 		}
 		if (!verify_username_socket_link(data['username'], socket.id)) {
 			send_object['success'] = false;
 			send_object['error'] = "There is an issue with your login";
 			console.log("Attempted to create room with failed login");
 			socket.emit("create_room_request_response", send_object);
 			return;
 		}
 		room_info_object[data['room']] = {name: data['room'], cur_users: {}, banned_list: {}, password: data['password'], admin: data['username']};
 		send_object['success'] = true;
 		send_object['room'] = data['room'];
 		send_object['password'] = data['password'];
 		socket.emit("create_room_request_response", send_object);
 		io.sockets.emit("add_room", {room: data['room'], password: !!data['password']});
 	});

/*
  _____  _                                     _   
 |  __ \(_)                                   | |  
 | |  | |_ ___  ___ ___  _ __  _ __   ___  ___| |_ 
 | |  | | / __|/ __/ _ \| '_ \| '_ \ / _ \/ __| __|
 | |__| | \__ \ (_| (_) | | | | | | |  __/ (__| |_ 
 |_____/|_|___/\___\___/|_| |_|_| |_|\___|\___|\__|
                                                   
                                                   
*/

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


/*
  _____                         _      _     _     _____                            _   
 |  __ \                       | |    (_)   | |   |  __ \                          | |  
 | |__) |___   ___  _ __ ___   | |     _ ___| |_  | |__) |___  __ _ _   _  ___  ___| |_ 
 |  _  // _ \ / _ \| '_ ` _ \  | |    | / __| __| |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | | \ \ (_) | (_) | | | | | | | |____| \__ \ |_  | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
 |_|  \_\___/ \___/|_| |_| |_| |______|_|___/\__| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                                                 | |                    
                                                                 |_|                    
*/

	socket.on("room_list_request", function(data) {
		if (!verify_username_socket_link(data['username'], socket.id)) {
			return;
		}
		for (room in room_info_object) {  //Adds the current users into the new user's list of users in the room
 			var send_object = {};
			send_object['room'] = room;
			send_object['password'] = !!room_info_object[room]['password'];
			socket.emit("add_room", send_object);
 		}
	});

/*
              _           _                      _   _             
     /\      | |         (_)           /\       | | (_)            
    /  \   __| |_ __ ___  _ _ __      /  \   ___| |_ _  ___  _ __  
   / /\ \ / _` | '_ ` _ \| | '_ \    / /\ \ / __| __| |/ _ \| '_ \ 
  / ____ \ (_| | | | | | | | | | |  / ____ \ (__| |_| | (_) | | | |
 /_/    \_\__,_|_| |_| |_|_|_| |_| /_/    \_\___|\__|_|\___/|_| |_|
                                                                   
                                                                   
*/


	socket.on("admin_action", function(data) {
		if (!verify_username_socket_room_admin_link(data['username'], socket.id, data['room'])) {
			return;
		}
		var send_object = {};
		send_object['operation'] = data['operation'];
		if (verify_username_socket_room_link(data['target'], username_info_object[data['target']]['s_id'], data['room'])) {
			send_object['success'] = true;
			switch(data['operation']) {
				case 0:
					room_info_object['admin'] = data['target'];
				break;
				case 1:
					username_socket_leave_room(data['target'], username_info_object[data['target']]['socket'], data['room']);
					var kick_object = {};
					kick_object['room'] = "kicked";
					kick_object['success'] = true;
					kick_object['kicked'] = true;
					kick_object['admin_rights'] = false;
					io.sockets.to(username_info_object[data['target']]['s_id']).emit("join_room_request_response", kick_object);
				break;
				case 2:
					username_socket_leave_room(data['target'], username_info_object[data['target']]['socket'], data['room']);
					room_info_object[data['room']]['banned_list'][data['target']] = true;
					var kick_object = {};
					kick_object['room'] = "kicked";
					kick_object['success'] = true;
					kick_object['ban'] = true;
					kick_object['admin_rights'] = false;
					io.sockets.to(username_info_object[data['target']]['s_id']).emit("join_room_request_response", kick_object);
				break;
			}
			socket.emit("admin_action_response", send_object);
		}
	});


/*
  _    _                                            _____                            _   
 | |  | |                                          |  __ \                          | |  
 | |  | |___  ___ _ __ _ __   __ _ _ __ ___   ___  | |__) |___  __ _ _   _  ___  ___| |_ 
 | |  | / __|/ _ \ '__| '_ \ / _` | '_ ` _ \ / _ \ |  _  // _ \/ _` | | | |/ _ \/ __| __|
 | |__| \__ \  __/ |  | | | | (_| | | | | | |  __/ | | \ \  __/ (_| | |_| |  __/\__ \ |_ 
  \____/|___/\___|_|  |_| |_|\__,_|_| |_| |_|\___| |_|  \_\___|\__, |\__,_|\___||___/\__|
                                                                  | |                    
                                                                  |_|                    
*/

 	socket.on('username_request', function(data) {
 		var send_object = {};
 		console.log("username_request: " + data['req_username']);
 		if (!username_info_object[data['req_username']]) {
 			username_info_object[data['req_username']] = {s_id: socket.id, room: false, socket: socket};
 			if (data['cur_username']) {
 				var temp_room = username_info_object[data['cur_username']]['room'];
 				username_socket_leave_current_room(data['cur_username'], socket);
 				delete username_info_object[data['cur_username']];
 				socket_id_to_username[socket.id] = data['req_username'];
 				send_object['accepted'] = true;
 				send_object['username_set'] = data['req_username'];
 				username_socket_join_room(data['req_username'], temp_room, socket);
 			} else {
 				socket_id_to_username[socket.id] = data['req_username'];
 				send_object['accepted'] = true;
 				send_object['username_set'] = data['req_username'];
 			}
 		} else {
 			send_object['accepted'] = false;
 			send_object['extra_message'] = "That screen name is taken, pick another please.";
 		}
 		socket.emit("username_request_response", send_object);
 	});

/*
   _____                _   _____                         __  __                                
  / ____|              | | |  __ \                       |  \/  |                               
 | (___   ___ _ __   __| | | |__) |___   ___  _ __ ___   | \  / | ___  ___ ___  __ _  __ _  ___ 
  \___ \ / _ \ '_ \ / _` | |  _  // _ \ / _ \| '_ ` _ \  | |\/| |/ _ \/ __/ __|/ _` |/ _` |/ _ \
  ____) |  __/ | | | (_| | | | \ \ (_) | (_) | | | | | | | |  | |  __/\__ \__ \ (_| | (_| |  __/
 |_____/ \___|_| |_|\__,_| |_|  \_\___/ \___/|_| |_| |_| |_|  |_|\___||___/___/\__,_|\__, |\___|
                                                                                      __/ |     
                                                                                     |___/      
*/

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

/*
  _____      _            _         __  __                                   _____                _ 
 |  __ \    (_)          | |       |  \/  |                                 / ____|              | |
 | |__) | __ ___   ____ _| |_ ___  | \  / | ___  ___ ___  __ _  __ _  ___  | (___   ___ _ __   __| |
 |  ___/ '__| \ \ / / _` | __/ _ \ | |\/| |/ _ \/ __/ __|/ _` |/ _` |/ _ \  \___ \ / _ \ '_ \ / _` |
 | |   | |  | |\ V / (_| | ||  __/ | |  | |  __/\__ \__ \ (_| | (_| |  __/  ____) |  __/ | | | (_| |
 |_|   |_|  |_| \_/ \__,_|\__\___| |_|  |_|\___||___/___/\__,_|\__, |\___| |_____/ \___|_| |_|\__,_|
                                                                __/ |                               
                                                               |___/                                
*/

	socket.on('private_message_send', function(data) {
		// This callback runs when the server receives a new message from the client.
 		var send_object = {};
 		if (verify_username_socket_link(data['username'], socket.id)  && username_info_object[data['target']] && username_info_object[data['target']]['s_id']) {
 			console.log("message to " + data['target'] + " by " + data['username'] + " at " + data['time'] + ": "+ data['message']); 
 			send_object['target'] = data['target'];
 			send_object['time'] = data['time'];
 			send_object['username'] = data['username'];
 			send_object['message'] = data['message'];
 			io.sockets.to(username_info_object[data['target']]['s_id']).emit("private_message_recieve", send_object); // broadcast the message to other users in the given room
 		} else {
 			console.log("failed message in " + data['room'] + " by " + data['username'] + " at " + data['time'] + ": "+ data['message']);
 			send_error("username_socket_room_error", socket);
 		}
	});
});

/*
                                                                                                                                                               
                                                                                                                                                               
FFFFFFFFFFFFFFFFFFFFFF                                                               tttt            iiii                                                      
F::::::::::::::::::::F                                                            ttt:::t           i::::i                                                     
F::::::::::::::::::::F                                                            t:::::t            iiii                                                      
FF::::::FFFFFFFFF::::F                                                            t:::::t                                                                      
  F:::::F       FFFFFFuuuuuu    uuuuuunnnn  nnnnnnnn        ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn        ssssssssss   
  F:::::F             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn    ss::::::::::s  
  F::::::FFFFFFFFFF   u::::u    u::::un::::::::::::::nn  c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn ss:::::::::::::s 
  F:::::::::::::::F   u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::ns::::::ssss:::::s
  F:::::::::::::::F   u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n s:::::s  ssssss 
  F::::::FFFFFFFFFF   u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n   s::::::s      
  F:::::F             u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n      s::::::s   
  F:::::F             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::nssssss   s:::::s 
FF:::::::FF           u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::ns:::::ssss::::::s
F::::::::FF            u:::::::::::::::un::::n    n::::n c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::ns::::::::::::::s 
F::::::::FF             uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n s:::::::::::ss  
FFFFFFFFFFF               uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn  sssssssssss    
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
*/

function username_socket_leave_current_room(username, socket) {
	if (!verify_username_socket_link(username, socket.id)) {
		console.log("error leaving room dur to username socket link");
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
	room_info_object[room]['cur_users'][username] = false;
	console.log("removed " + username + " from room: " + room)
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

function verify_username_socket_room_admin_link(username, socket_id, room_name) {
	if (!verify_username_socket_room_link(username, socket_id, room_name)) {
		return false;
	}
	return (username == room_info_object[room_name]['admin']);
};

function send_error(error, socket) {};