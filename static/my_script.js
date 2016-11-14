//Ascii art from  http://lunicode.com/bigtext


var socketio = io.connect();

/*
                                                                                                                                                                                                                        
                                                                                                                               bbbbbbbb                                                                                 
                                                          iiii                              tttt                               b::::::b             jjjj                                                  tttt          
                                                         i::::i                          ttt:::t                               b::::::b            j::::j                                              ttt:::t          
                                                          iiii                           t:::::t                               b::::::b             jjjj                                               t:::::t          
                                                                                         t:::::t                                b:::::b                                                                t:::::t          
    ssssssssss       ccccccccccccccccrrrrr   rrrrrrrrr  iiiiiiippppp   ppppppppp   ttttttt:::::ttttttt            ooooooooooo   b:::::bbbbbbbbb   jjjjjjj    eeeeeeeeeeee        ccccccccccccccccttttttt:::::ttttttt    
  ss::::::::::s    cc:::::::::::::::cr::::rrr:::::::::r i:::::ip::::ppp:::::::::p  t:::::::::::::::::t          oo:::::::::::oo b::::::::::::::bb j:::::j  ee::::::::::::ee    cc:::::::::::::::ct:::::::::::::::::t    
ss:::::::::::::s  c:::::::::::::::::cr:::::::::::::::::r i::::ip:::::::::::::::::p t:::::::::::::::::t         o:::::::::::::::ob::::::::::::::::b j::::j e::::::eeeee:::::ee c:::::::::::::::::ct:::::::::::::::::t    
s::::::ssss:::::sc:::::::cccccc:::::crr::::::rrrrr::::::ri::::ipp::::::ppppp::::::ptttttt:::::::tttttt         o:::::ooooo:::::ob:::::bbbbb:::::::bj::::je::::::e     e:::::ec:::::::cccccc:::::ctttttt:::::::tttttt    
 s:::::s  ssssss c::::::c     ccccccc r:::::r     r:::::ri::::i p:::::p     p:::::p      t:::::t               o::::o     o::::ob:::::b    b::::::bj::::je:::::::eeeee::::::ec::::::c     ccccccc      t:::::t          
   s::::::s      c:::::c              r:::::r     rrrrrrri::::i p:::::p     p:::::p      t:::::t               o::::o     o::::ob:::::b     b:::::bj::::je:::::::::::::::::e c:::::c                   t:::::t          
      s::::::s   c:::::c              r:::::r            i::::i p:::::p     p:::::p      t:::::t               o::::o     o::::ob:::::b     b:::::bj::::je::::::eeeeeeeeeee  c:::::c                   t:::::t          
ssssss   s:::::s c::::::c     ccccccc r:::::r            i::::i p:::::p    p::::::p      t:::::t    tttttt     o::::o     o::::ob:::::b     b:::::bj::::je:::::::e           c::::::c     ccccccc      t:::::t    tttttt
s:::::ssss::::::sc:::::::cccccc:::::c r:::::r           i::::::ip:::::ppppp:::::::p      t::::::tttt:::::t     o:::::ooooo:::::ob:::::bbbbbb::::::bj::::je::::::::e          c:::::::cccccc:::::c      t::::::tttt:::::t
s::::::::::::::s  c:::::::::::::::::c r:::::r           i::::::ip::::::::::::::::p       tt::::::::::::::t     o:::::::::::::::ob::::::::::::::::b j::::j e::::::::eeeeeeee   c:::::::::::::::::c      tt::::::::::::::t
 s:::::::::::ss    cc:::::::::::::::c r:::::r           i::::::ip::::::::::::::pp          tt:::::::::::tt      oo:::::::::::oo b:::::::::::::::b  j::::j  ee:::::::::::::e    cc:::::::::::::::c        tt:::::::::::tt
  sssssssssss        cccccccccccccccc rrrrrrr           iiiiiiiip::::::pppppppp              ttttttttttt          ooooooooooo   bbbbbbbbbbbbbbbb   j::::j    eeeeeeeeeeeeee      cccccccccccccccc          ttttttttttt  
                                                                p:::::p                                                                            j::::j                                                               
                                                                p:::::p                                                                  jjjj      j::::j                                                               
                                                               p:::::::p                                                                j::::jj   j:::::j                                                               
                                                               p:::::::p                                                                j::::::jjj::::::j                                                               
                                                               p:::::::p                                                                 jj::::::::::::j                                                                
                                                               ppppppppp                                                                   jjj::::::jjj                                                                 
                                                                                                                                              jjjjjj                                                                    
*/


var my_script = {
   //Save elements inside of the my_script object for easy reference  
   element_div_chatlog: document.getElementById("div_chatlog"),
   element_button_send_message: document.getElementById("button_send_message"),
   element_button_new_username: document.getElementById("button_change_username"),
   element_button_new_room: document.getElementById("button_new_chatroom"),
   element_button_new_admin: document.getElementById("button_new_admin"),
   element_button_kick_user: document.getElementById("button_kick_user"),
   element_button_ban_user: document.getElementById("button_ban_user"),
   element_input_text_message: document.getElementById("input_text_message"),
   element_user_list: document.getElementById("user_list"),
   element_username_span: document.getElementById("username_span"),
   element_chatroom_span: document.getElementById("chatroom_span"),
   element_room_list: document.getElementById("room_list"),
   current_chatroom: false,
   username: false
};

/*
                                                                                                                                                               
                                                                                                                                                               
    ffffffffffffffff                                                                 tttt            iiii                                                      
   f::::::::::::::::f                                                             ttt:::t           i::::i                                                     
  f::::::::::::::::::f                                                            t:::::t            iiii                                                      
  f::::::fffffff:::::f                                                            t:::::t                                                                      
  f:::::f       ffffffuuuuuu    uuuuuunnnn  nnnnnnnn        ccccccccccccccccttttttt:::::ttttttt    iiiiiii    ooooooooooo   nnnn  nnnnnnnn        ssssssssss   
  f:::::f             u::::u    u::::un:::nn::::::::nn    cc:::::::::::::::ct:::::::::::::::::t    i:::::i  oo:::::::::::oo n:::nn::::::::nn    ss::::::::::s  
 f:::::::ffffff       u::::u    u::::un::::::::::::::nn  c:::::::::::::::::ct:::::::::::::::::t     i::::i o:::::::::::::::on::::::::::::::nn ss:::::::::::::s 
 f::::::::::::f       u::::u    u::::unn:::::::::::::::nc:::::::cccccc:::::ctttttt:::::::tttttt     i::::i o:::::ooooo:::::onn:::::::::::::::ns::::::ssss:::::s
 f::::::::::::f       u::::u    u::::u  n:::::nnnn:::::nc::::::c     ccccccc      t:::::t           i::::i o::::o     o::::o  n:::::nnnn:::::n s:::::s  ssssss 
 f:::::::ffffff       u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n   s::::::s      
  f:::::f             u::::u    u::::u  n::::n    n::::nc:::::c                   t:::::t           i::::i o::::o     o::::o  n::::n    n::::n      s::::::s   
  f:::::f             u:::::uuuu:::::u  n::::n    n::::nc::::::c     ccccccc      t:::::t    tttttt i::::i o::::o     o::::o  n::::n    n::::nssssss   s:::::s 
 f:::::::f            u:::::::::::::::uun::::n    n::::nc:::::::cccccc:::::c      t::::::tttt:::::ti::::::io:::::ooooo:::::o  n::::n    n::::ns:::::ssss::::::s
 f:::::::f             u:::::::::::::::un::::n    n::::n c:::::::::::::::::c      tt::::::::::::::ti::::::io:::::::::::::::o  n::::n    n::::ns::::::::::::::s 
 f:::::::f              uu::::::::uu:::un::::n    n::::n  cc:::::::::::::::c        tt:::::::::::tti::::::i oo:::::::::::oo   n::::n    n::::n s:::::::::::ss  
 fffffffff                uuuuuuuu  uuuunnnnnn    nnnnnn    cccccccccccccccc          ttttttttttt  iiiiiiii   ooooooooooo     nnnnnn    nnnnnn  sssssssssss    
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
                                                                                                                                                               
*/



/*
   _____                _               
  / ____|              | |              
 | (___   ___ _ __   __| | ___ _ __ ___ 
  \___ \ / _ \ '_ \ / _` |/ _ \ '__/ __|
  ____) |  __/ | | | (_| |  __/ |  \__ \
 |_____/ \___|_| |_|\__,_|\___|_|  |___/
                                        
                                        
*/
function send_admin_user(target, operation) {
   var send_object = {};
   send_object['target'] = target;
   send_object['operation'] = operation;
   send_object['username'] = my_script.username;
   send_object['room'] = my_script.current_chatroom;
   socketio.emit("admin_action", send_object);
}

function send_private_message(username, msg) {
   var send_object = {};
   if (my_script.username != false) {
      send_object['username'] = my_script.username;
      send_object['target'] = username;
      send_object['message'] = msg;
      send_object['time'] = Date.now();
      socketio.emit("private_message_send", send_object);
   } else {
      alert("You don't have a username, try setting one");
   }
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

function send_room_create_request(room_name, password) {
   var send_object = {};
   send_object['room'] = room_name;
   send_object['username'] = my_script.username;
   if (!password || password == "") {
      send_object['password'] = false;
   } else {
      send_object['password'] = password;
   }
   socketio.emit("create_room_request", send_object);
}

function send_username_request(username) {
   var send_object = {};
   send_object['cur_username'] = my_script.username;
   send_object['req_username'] = username;
   socketio.emit("username_request", send_object);
}

/*
  _    _ _____   _       _                      _   _                 
 | |  | |_   _| (_)     | |                    | | (_)                
 | |  | | | |    _ _ __ | |_ ___ _ __ __ _  ___| |_ _  ___  _ __  ___ 
 | |  | | | |   | | '_ \| __/ _ \ '__/ _` |/ __| __| |/ _ \| '_ \/ __|
 | |__| |_| |_  | | | | | ||  __/ | | (_| | (__| |_| | (_) | | | \__ \
  \____/|_____| |_|_| |_|\__\___|_|  \__,_|\___|\__|_|\___/|_| |_|___/
                                                                      
                                                                      
*/

function set_server_message(container) {
   var chatroom_intro_message = document.createElement("span");
   chatroom_intro_message.textContent = "Pssst, it's me, the chatbox.  If you want to talk privately to other users, click their names.  If you want to join another chatroom, click the name of the chatroom.  I hope you have fun chatting through me, I always enjoy listening to people talk.  If you want to make some noises for your friends, type /wow, /skelly, /lol, /friends, or /airhorn";
   chatroom_intro_message.className = "private_message";
   container.appendChild(chatroom_intro_message);
   container.appendChild(document.createElement("br"));
}

function set_new_message(msg, container, private_m) {
   if (private_m) {
      var private_message = document.createElement("span");
      private_message.textContent = "pvt [" + get_date_string_from_date(msg['time']) + "] " + msg['username'] + ": " + msg['message'];
      private_message.className = "private_message";
      container.appendChild(private_message);
      container.appendChild(document.createElement("br"));
   } else {
      var message = document.createTextNode("span");
      container.appendChild(message);
      message.textContent = "[" + get_date_string_from_date(msg['time']) + "] " + msg['username'] + ": " + msg['message'];
      container.appendChild(document.createElement("br"));
   }
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

function reset_room_list() {
   var send_object = {};
   send_object['username'] = my_script.username;
   while(my_script.element_room_list.firstChild) {
        my_script.element_room_list.removeChild(my_script.element_room_list.firstChild);
   }
   socketio.emit("room_list_request", send_object);
}

function reset_chat_list() {
   while(my_script.element_div_chatlog.firstChild) {
        my_script.element_div_chatlog.removeChild(my_script.element_div_chatlog.firstChild);
   }
}

function hide_admin_powers() {
   document.getElementById("admin_tools").hidden = true;
}

function show_admin_powers() {
   document.getElementById("admin_tools").hidden = false;
}

/*
  _    _      _                     
 | |  | |    | |                    
 | |__| | ___| |_ __   ___ _ __ ___ 
 |  __  |/ _ \ | '_ \ / _ \ '__/ __|
 | |  | |  __/ | |_) |  __/ |  \__ \
 |_|  |_|\___|_| .__/ \___|_|  |___/
               | |                  
               |_|                  
*/

function get_date_string_from_date(raw_date) {
   var in_date = new Date(raw_date);
   var date_string = (in_date.getMonth() + 1) + "/" + in_date.getDate() + "/" + in_date.getFullYear() + " - " + ("00" + in_date.getHours()).slice(-2) + ":" + ("00" + in_date.getMinutes()).slice(-2) + ":" + ("00" + in_date.getSeconds()).slice(-2);
   return date_string;
};


/*
  _____                           _       
 |  __ \                         | |      
 | |__) | __ ___  _ __ ___  _ __ | |_ ___ 
 |  ___/ '__/ _ \| '_ ` _ \| '_ \| __/ __|
 | |   | | | (_) | | | | | | |_) | |_\__ \
 |_|   |_|  \___/|_| |_| |_| .__/ \__|___/
                           | |            
                           |_|            
*/


function prompt_for_username(extra_message) {
   var username_prompt;
   if (typeof(extra_message) === "string") {
      username_prompt = prompt(extra_message, "");
   } else {
      username_prompt = prompt("Please enter a screen name", "");
   }
   if (username_prompt && username_prompt != "") {
      send_username_request(username_prompt);
   } else if (username_prompt == "") {
      setTimeout(prompt_for_username("Please enter a username, don't just leave it blank"), 1);
   }
};

function prompt_for_new_room() {
   var new_room_prompt;
   if (typeof(extra_message) === "string") {
      new_room_prompt = prompt(extra_message, "");
   } else {
      new_room_prompt = prompt("Please enter a room name", "");
   }
   if (new_room_prompt && new_room_prompt != "") {
      var password_prompt = prompt("Please enter a password, or leave the field blank for a passwordless room", "");
      send_room_create_request(new_room_prompt, password_prompt)
   } else {
      setTimeout(prompt_for_new_room("Please enter a roomname, don't just leave it blank"), 1);
   }
}

function prompt_for_new_admin() {
   var new_admin_prompt = prompt("Please enter a username to promote to admin: ", "");
   if (new_admin_prompt && new_admin_prompt != "") {
      send_admin_user(new_admin_prompt, 0);
   }
}

function prompt_for_kick_user() {
   var new_kick_prompt = prompt("Please enter a username to kick: ", "");
   if (new_kick_prompt && new_kick_prompt != "") {
      send_admin_user(new_kick_prompt, 1);
   }
}

function prompt_for_ban_user() {
   var new_ban_prompt = prompt("Please enter a username to ban: ", "");
   if (new_ban_prompt && new_ban_prompt != "") {
      send_admin_user(new_ban_prompt, 2);
   }
}



/*
                                                                                                                                                                                                                                                             
                                                                                                                                                                                    dddddddd                                                                 
EEEEEEEEEEEEEEEEEEEEEE                                                                     tttt               HHHHHHHHH     HHHHHHHHH                                               d::::::dlllllll                                                          
E::::::::::::::::::::E                                                                  ttt:::t               H:::::::H     H:::::::H                                               d::::::dl:::::l                                                          
E::::::::::::::::::::E                                                                  t:::::t               H:::::::H     H:::::::H                                               d::::::dl:::::l                                                          
EE::::::EEEEEEEEE::::E                                                                  t:::::t               HH::::::H     H::::::HH                                               d:::::d l:::::l                                                          
  E:::::E       EEEEEEvvvvvvv           vvvvvvv eeeeeeeeeeee    nnnn  nnnnnnnn    ttttttt:::::ttttttt           H:::::H     H:::::H    aaaaaaaaaaaaa  nnnn  nnnnnnnn        ddddddddd:::::d  l::::l     eeeeeeeeeeee    rrrrr   rrrrrrrrr       ssssssssss   
  E:::::E              v:::::v         v:::::vee::::::::::::ee  n:::nn::::::::nn  t:::::::::::::::::t           H:::::H     H:::::H    a::::::::::::a n:::nn::::::::nn    dd::::::::::::::d  l::::l   ee::::::::::::ee  r::::rrr:::::::::r    ss::::::::::s  
  E::::::EEEEEEEEEE     v:::::v       v:::::ve::::::eeeee:::::een::::::::::::::nn t:::::::::::::::::t           H::::::HHHHH::::::H    aaaaaaaaa:::::an::::::::::::::nn  d::::::::::::::::d  l::::l  e::::::eeeee:::::eer:::::::::::::::::r ss:::::::::::::s 
  E:::::::::::::::E      v:::::v     v:::::ve::::::e     e:::::enn:::::::::::::::ntttttt:::::::tttttt           H:::::::::::::::::H             a::::ann:::::::::::::::nd:::::::ddddd:::::d  l::::l e::::::e     e:::::err::::::rrrrr::::::rs::::::ssss:::::s
  E:::::::::::::::E       v:::::v   v:::::v e:::::::eeeee::::::e  n:::::nnnn:::::n      t:::::t                 H:::::::::::::::::H      aaaaaaa:::::a  n:::::nnnn:::::nd::::::d    d:::::d  l::::l e:::::::eeeee::::::e r:::::r     r:::::r s:::::s  ssssss 
  E::::::EEEEEEEEEE        v:::::v v:::::v  e:::::::::::::::::e   n::::n    n::::n      t:::::t                 H::::::HHHHH::::::H    aa::::::::::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::::::::::::e  r:::::r     rrrrrrr   s::::::s      
  E:::::E                   v:::::v:::::v   e::::::eeeeeeeeeee    n::::n    n::::n      t:::::t                 H:::::H     H:::::H   a::::aaaa::::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e::::::eeeeeeeeeee   r:::::r                  s::::::s   
  E:::::E       EEEEEE       v:::::::::v    e:::::::e             n::::n    n::::n      t:::::t    tttttt       H:::::H     H:::::H  a::::a    a:::::a  n::::n    n::::nd:::::d     d:::::d  l::::l e:::::::e            r:::::r            ssssss   s:::::s 
EE::::::EEEEEEEE:::::E        v:::::::v     e::::::::e            n::::n    n::::n      t::::::tttt:::::t     HH::::::H     H::::::HHa::::a    a:::::a  n::::n    n::::nd::::::ddddd::::::ddl::::::le::::::::e           r:::::r            s:::::ssss::::::s
E::::::::::::::::::::E         v:::::v       e::::::::eeeeeeee    n::::n    n::::n      tt::::::::::::::t     H:::::::H     H:::::::Ha:::::aaaa::::::a  n::::n    n::::n d:::::::::::::::::dl::::::l e::::::::eeeeeeee   r:::::r            s::::::::::::::s 
E::::::::::::::::::::E          v:::v         ee:::::::::::::e    n::::n    n::::n        tt:::::::::::tt     H:::::::H     H:::::::H a::::::::::aa:::a n::::n    n::::n  d:::::::::ddd::::dl::::::l  ee:::::::::::::e   r:::::r             s:::::::::::ss  
EEEEEEEEEEEEEEEEEEEEEE           vvv            eeeeeeeeeeeeee    nnnnnn    nnnnnn          ttttttttttt       HHHHHHHHH     HHHHHHHHH  aaaaaaaaaa  aaaa nnnnnn    nnnnnn   ddddddddd   dddddllllllll    eeeeeeeeeeeeee   rrrrrrr              sssssssssss    
                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                     
                                                                                                                                                                                                                                                             
*/

//Event Listeners
my_script.element_button_send_message.addEventListener("click", function(ev){
   send_room_message(my_script.element_input_text_message.value);
   my_script.element_input_text_message.value = "";
   console.log("sent message");
});

my_script.element_button_new_room.addEventListener("click", function(ev){
   prompt_for_new_room();
   console.log("New Chatroom");
});

my_script.element_button_new_username.addEventListener("click", function(ev){
   if (window.confirm("Are you sure you want to abandon your current name of: " + my_script.username)) {
      prompt_for_username();
   }
   console.log("New Username");
});

my_script.element_button_new_admin.addEventListener("click", function(ev){
   if (window.confirm("Are you sure you want to give someone else your admin status?  You will cease to be the admin!!!")) {
      prompt_for_new_admin();
   }
});

my_script.element_button_kick_user.addEventListener("click", function(ev){
   if (window.confirm("Are you sure you want to kick someone from the room?")) {
      prompt_for_kick_user();
   }
});

my_script.element_button_ban_user.addEventListener("click", function(ev){
   if (window.confirm("Are you sure you want to ban someone?  They'll never be able to rejoin this room!")) {
      prompt_for_ban_user();
   }
});

//I found this event listener here: http://stackoverflow.com/a/8894293
my_script.element_input_text_message.addEventListener("keyup", function(e) {
    e.preventDefault(); // sometimes useful
    // Enter is pressed
    if (e.keyCode == 13) {
      send_room_message(my_script.element_input_text_message.value);
      my_script.element_input_text_message.value = "";
      console.log("sent message");
   }
}, false);



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

socketio.on("message_to_client", function(data) {
   if (data['room'] && data['room'] === my_script.current_chatroom && data['message'] && data['username']) {
      switch(data['message']) {
         case "/airhorn":
            var airhorn = new Audio('airhorn.mp3');
            airhorn.play();
            break;
         case "/skelly":
            var skelly = new Audio('skelly.mp3');
            skelly.play();
            break;
         case "/wow":
            var wow = new Audio('wow.mp3');
            wow.play();
            break;
         case "/lol":
            var lol = new Audio('lol.mp3');
            lol.play();
            break;
         case "/friends":
            var friends = new Audio('friends.mp3');
            friends.play();
            break;
         default:
            set_new_message(data, my_script.element_div_chatlog);
      }
   }
});


socketio.on("username_request_response", function(data) {
   console.log("urr");
   if (data['accepted'] === true) {
      my_script.username = data['username_set'];
      my_script.element_username_span.textContent = data['username_set'];
      //console.log("sending room request");
      if (!my_script.current_chatroom) {
         send_join_room_request();
      }
      //console.log("send room request");
   } else {
      prompt_for_username(data['extra_message']);
   }
   reset_user_list();
});

socketio.on("userlist_edit", function(data) {
   switch(data['operation']) {
      case 0:
         var kill_user_element = document.getElementById("li_user_" + data['removed_user']);
         my_script.element_user_list.removeChild(kill_user_element);
      break;
      case 1: //adds a user to the user list
         var new_user_element = document.createElement("p");
         new_user_element.id = "li_user_" + data['added_user'];
         new_user_element.setAttribute("data-username", data['added_user']);
         new_user_element.textContent = data['added_user'];
         my_script.element_user_list.appendChild(new_user_element);
         new_user_element.addEventListener("click", function(ev) {
            var message_prompt = prompt("Send a message to " + ev.currentTarget.getAttribute("data-username"), "");
            send_private_message(ev.currentTarget.getAttribute("data-username"), message_prompt);
         });
      break;
   }
});

socketio.on("join_room_request_response", function(data) {
   if(data['success']) {
      my_script.current_chatroom = data['room'];
      my_script.element_chatroom_span.textContent = data['room'];
      reset_user_list();
      reset_chat_list();
      reset_room_list();
      set_server_message(my_script.element_div_chatlog);
      if (data['kicked']) {
         send_join_room_request();
         alert("You've been kicked to the main lobby");
      } else if (data['ban']) {
         send_join_room_request();
         alert("You've been banned, redirecting to the main lobby");
      }
      if (data['admin_rights']) {
         show_admin_powers();
      } else {
         hide_admin_powers();
      }
   } else {
      alert(data['fail_message']);
   }
});

socketio.on("create_room_request_response", function(data) {
   if(data['success']) {
      alert('You have created the room: ' + data['room'] + " \n Joining room now!");
      send_join_room_request(data['room'], data['password']);
   } else {
      alert(data['error']);
   }
});

socketio.on("add_room", function(data) {
   var new_room_element = document.createElement("p");
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

socketio.on("private_message_recieve", function(data) {
   if (data['message'] && data['username'] && data['target'] == my_script.username) {
      switch(data['message']) {
         case "/airhorn":
            var airhorn = new Audio('airhorn.mp3');
            airhorn.play();
            break;
         case "/skelly":
            var skelly = new Audio('skelly.mp3');
            skelly.play();
            break;
         case "/wow":
            var wow = new Audio('wow.mp3');
            wow.play();
            break;
         case "/lol":
            var lol = new Audio('lol.mp3');
            lol.play();
            break;
         case "/friends":
            var friends = new Audio('friends.mp3');
            friends.play();
            break;
         default:
            set_new_message(data, my_script.element_div_chatlog, true);
      }
   }
});

socketio.on("admin_action_response", function(data) {
   if (data['success']) {
      if (data['operation'] == 0) {
         hide_admin_powers();
      }
      alert("success!");
   } else {
      alert("Failed to use admin powers.  Is the user you're targetting in the same room as you?");
   }
});







prompt_for_username();