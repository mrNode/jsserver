var socket = io.connect('', {port: 3000});

socket.on('stream', function (message){
    if (message.type === 'offer') {
        peer.setRemoteDescription(new SessionDescription(message));
        createAnswer();
    } else if (message.type === 'answer') {
        peer.setRemoteDescription(new SessionDescription(message));
    } else if (message.type === 'candidate') {
        var candidate = new IceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
        peer.addIceCandidate(candidate);
    }
});



var PeerConnection = window.webkitRTCPeerConnection;
var IceCandidate = window.RTCIceCandidate;
var SessionDescription = window.RTCSessionDescription;

var peer;

navigator.webkitGetUserMedia({video: true}, function(stream){
    var video = document.querySelector('video');    
    video.src = window.webkitURL.createObjectURL(stream);

    peer = new PeerConnection(null);
    peer.addStream(stream);
    peer.onicecandidate = gotIceCandidate;
    peer.onaddstream    = gotRemoteStream;
}, function(error){
    console.log("fail");
});

function gotRemoteStream(stream){
    var v = document.getElementById("remoteVideo"); 
    v.src = URL.createObjectURL(stream.stream);
}

function gotLocalDescription(description){
    peer.setLocalDescription(description);

    sendSocketMessage(description);
}

function callOffer() {
  peer.createOffer(
    gotLocalDescription, 
    function(error) { console.log(error) }, 
    { 'mandatory': {'OfferToReceiveVideo': true}}
  );
}

function createAnswer() {
  peer.createAnswer(
    gotLocalDescription,
    function(error) { 
        console.log(error) 
    }, 
    {'mandatory': {'OfferToReceiveVideo': true}}
  );
}

function gotIceCandidate(event){
    if (event.candidate) {
        sendSocketMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
        });
    }
}

function sendSocketMessage(msg){
    socket.emit('stream', msg);
}






