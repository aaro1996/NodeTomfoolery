var socketio = io.connect();
var my_script = {
   //Save elements inside of the my_script object for easy reference  
   element_div_chatlog: document.getElementById("div_chatlog"),
   element_button_send_message: document.getElementById("button_send_message"),
   element_input_text_message: document.getElementById("input_text_message"),
   element_user_list: document.getElementById("user_list"),
   element_room_list: document.getElementById("room_list"),
   current_chatroom: false,
   username: false
};

function send_private_message(username, msg) {

};

function send_join_room_request(room_name, password) {
   var send_object = {};
   if (room_name) {
      send_object['room'] = room_name;
   } else {
      send_object['room'] = "lobby";
   }
   if (password) {
      send_object['password'] = password;
   } else {
      send_object['password'] = false;
   }
   send_object['username'] = my_script.username;
   if (my_script.current_chatroom === send_object['room']) {  //if they try to rejoin their current room it just clears everything because that makes the user think that I did what they wanted even though that's a stupid request and causes issues serverside.
      reset_user_list();
      reset_chat_list();
   } else {
      socketio.emit("join_room_request", send_object);
   }
};

function get_date_string_from_date(raw_date) {
   var in_date = new Date(raw_date);
   var date_string = (in_date.getMonth() + 1) + "/" + in_date.getDate() + "/" + in_date.getFullYear() + " - " + ("00" + in_date.getHours()).slice(-2) + ":" + ("00" + in_date.getMinutes()).slice(-2) + ":" + ("00" + in_date.getSeconds()).slice(-2);
   return date_string;
};

function set_new_message(msg, container) {
   container.appendChild(document.createTextNode("[" + get_date_string_from_date(msg['time']) + "] " + msg['username'] + ": " + msg['message']));
   container.appendChild(document.createElement("br"));
};

function reset_user_list() {
   var send_object = {};
   send_object['username'] = my_script.username;
   send_object['room'] = my_script.current_chatroom;
   while(my_script.element_user_list.firstChild) {
        my_script.element_user_list.removeChild(my_script.element_user_list.firstChild);
   }
   socketio.emit("user_list_request", send_object);
}

function reset_chat_list() {
   while(my_script.element_div_chatlog.firstChild) {
        my_script.element_div_chatlog.removeChild(my_script.element_div_chatlog.firstChild);
   }
}

function prompt_for_username(extra_message) {
   var username_prompt;
   if (typeof(extra_message) === "string") {
      username_prompt = prompt(extra_message, "Username Here");
   } else {
      username_prompt = prompt("Please enter a screen name", "Username Here");
   }
   if (username_prompt != "" && username_prompt != "Username Here") {
      var send_object = {};
      send_object['cur_username'] = my_script.username;
      send_object['req_username'] = username_prompt;
      socketio.emit("username_request", send_object);
   } else if (username_prompt == "") {
      setTimeout(prompt_for_username("Please enter a username, don't just leave it blank"), 1);
   } else if (username_prompt == "Username Here") {
      setTimeout(prompt_for_username("Please enter a screen name, don't just leave it at the default"), 1);
   }
};

function send_room_message(msg){
   var send_object = {};
   if (my_script.username != false) {
      send_object['username'] = my_script.username;
      send_object['room'] = my_script.current_chatroom;
      send_object['message'] = msg;
      send_object['time'] = Date.now();
      socketio.emit("send_room_message", send_object);
   } else {
      alert("You don't have a username, try setting one");
   }
};


//Event Listeners
my_script.element_button_send_message.addEventListener("click", function(ev){
   send_room_message(my_script.element_input_text_message.value);
   console.log("sent message");
});


socketio.on("message_to_client", function(data) {
   if (data['room'] && data['room'] === my_script.current_chatroom && data['message'] && data['username']) {
      set_new_message(data, my_script.element_div_chatlog);
   }
});


socketio.on("username_request_response", function(data) {
   console.log("urr");
   if (data['accepted'] === true) {
      my_script.username = data['username_set'];
      console.log("sending room request");
      if (!my_script.current_chatroom) {
         send_join_room_request();
      }
      console.log("send room request");
   } else {
      prompt_for_username(data['extra_message']);
   }
});

socketio.on("userlist_edit", function(data) {
   switch(data['operation']) {
      case 0:

      break;
      case 1: //adds a user to the user list
         var new_user_element = document.createElement("li");
         new_user_element.id = "li_user_" + data['added_user'];
         new_user_element.setAttribute("data-username", data['added_user']);
         new_user_element.textContent = data['added_user'];
         my_script.element_user_list.appendChild(new_user_element);
         new_user_element.addEventListener("click", function(ev) {
            var message_prompt = prompt("Send a message to " + ev.currentTarget.getAttribute("data-username"), "");
            send_private_message(ev.currentTarget.getAttribute("data-username"), message_prompt);
         });
      break;
      case 2:
      break;
   }
});

socketio.on("join_room_request_response", function(data) {
   if(data['success']) {
      my_script.current_chatroom = data['room'];
      reset_user_list();
      reset_chat_list();
   }
});

socketio.on("create_room_request_response", function(data) {
   
});

socketio.on("add_room", function(data) {
   var new_room_element = document.createElement("li");
   new_room_element.id = "li_room_" + data['room'];
   new_room_element.textContent = data['room'];
   new_room_element.setAttribute("data-room_name", data['room']);
   new_room_element.setAttribute("data-has_password", data['password']);
   my_script.element_room_list.appendChild(new_room_element);
   if (data['password']) {
      new_room_element.addEventListener("click", function(ev) {
         var prompt_password = prompt("Please enter the password for " + ev.currentTarget.getAttribute("data-room_name", ""));
         send_join_room_request(ev.currentTarget.getAttribute("data-room_name"), prompt_password);
      }, false);
   } else {
      new_room_element.addEventListener("click", function(ev) {
         send_join_room_request(ev.currentTarget.getAttribute("data-room_name"));
      }, false);
   }
});


prompt_for_username();