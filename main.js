var socket = io.connect('', {port: 3000});

socket.on('pull', function (message){
    document.getElementById('msg').innerHTML = message;
});