var socket = io.connect();

$(function(){

	 $('#getNickName').keypress(function(key){
     	 if (key.which === 13)  {
     	 	key.preventDefault();
			var userName = $('#getNickName').val();
			socket.emit('new user', userName, function(data){
			if (data) {
				$('#getNickName').hide();
				$('#inputMessage').show();

			}
			else {
				confirm("Oops... the name you entered has been taken. Please try another one");
				$('#getNickName').text("");
			}
		   });	
     	 }
     });

     /* it seems that there's no need for a send button... correct? 
     $('#send').click(function(){
     	handleInput();
     });
	*/ 

     $('#inputMessage').keypress(function(key){
     	 if (key.which === 13)  {
     	 /*	$('#inputMessage').empty(); */
     	
     	 	handleInput();
     	 	 document.getElementById('inputMessage').value = "";
     	 	key.preventDefault();
     	 }
     });

     socket.on('usernums', function(data){
     	  var count = data.length;
     	  $('#userCount').text(count);
     });

     socket.on('new message', function(data){
     	
     	var content = '<b style="color:' + data.Color  + "\""  + ">"  + data.Name +  ': </b>' + data.msg + "<br />";
     	$('#display').append(content);
     	scrollBottom();
     });

     socket.on('notify guys', function(data){
     	var cond = data.condition, systemMessage;
     	if (cond === 'join')
     		systemMessage = "<div class='systemMsg'><i><b>" +  data.Name + "</b></i> joined" + "</div>";
     	else
     		systemMessage = "<div class='systemMsg'><i><b>" +  data.Name + "</b></i> left" + "</div>";
     	$('#display').append(systemMessage);
     	scrollBottom();
     });

});

function handleInput() {
	    var message = $("#inputMessage").val();
     	if (message.length === 0) 
     		return;
     	socket.emit("send message", message);
     	scrollBottom();
}

function scrollBottom() {
	    var display = $("#display");
     	display.scrollTop = display.scrollHeight ;
}