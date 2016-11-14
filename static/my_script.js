var socketio = io.connect();
var my_script = {
   //Save elements inside of the my_script object for easy reference  
   element_div_chatlog: document.getElementById("div_chatlog"),
   element_button_send_message: document.getElementById("button_send_message"),
   element_input_text_message: document.getElementById("input_text_message"),
   current_chatroom: "default",
   username: "danny"
};


//recieves the messages sent to the client, and checks to see if the current chatroom is set

function get_date_string_from_date(raw_date) {
   var in_date = new Date(raw_date);
   var date_string = (in_date.getMonth() + 1) + "/" + in_date.getDate() + "/" + in_date.getFullYear() + " - " + ("00" + in_date.getHours()).slice(-2) + ":" + ("00" + in_date.getMinutes()).slice(-2) + ":" + ("00" + in_date.getSeconds()).slice(-2);
   return date_string;
}

function set_new_message(msg, container) {
   container.appendChild(document.createTextNode("[" + get_date_string_from_date(msg['time']) + "] " + msg['username'] + ": " + msg['message']));
   container.appendChild(document.createElement("br"));
};

function send_message(msg){
   var send_object = {};
   if (my_script.username != null) {
      send_object['username'] = my_script.username;
      send_object['room'] = my_script.current_chatroom;
      send_object['message'] = msg;
      send_object['time'] = Date.now();
      socketio.emit("send_message", send_object);
   } else {
      alert("Please choose a screen-name before sending messages!");
   }
};


//Event Listeners
my_script.element_button_send_message.addEventListener("click", function(ev){
   send_message(my_script.element_input_text_message.value);
});


socketio.on("message_to_client",
   function(data) {
      //Append an HR thematic break and the escaped HTML of the new message
      if (data['room'] && data['room'] === my_script.current_chatroom && data['message'] && data['username']) {
         set_new_message(data, my_script.element_div_chatlog);
      }
   }
);