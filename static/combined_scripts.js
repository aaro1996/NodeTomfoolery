var socketio = io.connect();
var my_script = {
   div_chatlog: document.getElementById("div_chatlog"),
   button_send_message: document.getElementById("button_send_message"),
   input_text_message: document.getElementById("input_text_message")

};
socketio.on("message_to_client",
   function(data) {
      //Append an HR thematic break and the escaped HTML of the new message
      set_new_message(data['message'], my_script.div_chatlog);
   }
);
function set_new_message(msg, container) {
   container.appendChild(document.createElement("hr"));
   container.appendChild(document.createTextNode(msg));
}

function send_message(msg){
   socketio.emit("send_chat", {message:msg});
}



//Event Listeners
my_script.button_send_message.addEventListener("click", function(ev){
   send_message(my_script.input_text_message.value);
})
