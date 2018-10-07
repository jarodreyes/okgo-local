var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var midi = require('midi');

// Create a new virtual midi controller called okgo-local
var output = new midi.output();
output.openVirtualPort('okgo-local');

// lookup for whatever OSC thing needs to be triggered based upon note sent to call.
var notes = {
    "C2": "36",
    "C3": "",
    "C4": "",
    "C5": "",
    "D2": "38",
    "D3": "",
    "D4": "",
    "D5": "",
    "Db2": "",
    "Db3": "",
    "Db4": "",
    "Db5": "",
    "E2": "",
    "E3": "",
    "E4": "",
    "E5": "",
    "E54": "",
    "Eb2": "",
    "Eb3": "",
    "Eb4": "",
    "Eb5": "",
    "F2": "",
    "F3": "",
    "F4": "",
    "F5": "",
    "G2": "",
    "G3": "",
    "G4": "",
    "Gb2": "",
    "Gb3": "",
    "Gb4": "",
    "Gb5": "",
    "A#2": "",
    "A#3": "",
    "A2": "",
    "A3": "",
    "A4": "",
    "Ab2": "",
    "Ab3": "",
    "Ab4": "",
    "B2": "",
    "B3": "",
    "B4": "",
    "Bb4": ""
};


app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// we should be able to support 1400-1800 concurrent connections (a lot more than 40)
// https://stackoverflow.com/questions/15872788/maximum-concurrent-socket-io-connections
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('note', function (msg) {

        // I'm guessing this is the variable sent to OSC.
        // You can add it the value in the lookup above.
        var playMe = notes[msg];
        if(playMe === ""){
            // do the OSC stuff here
            console.log("playing note, ", msg);
            // console.log('send this value ot OSC', playMe);
        } else {
            console.log("Invalid note: ", msg);
        }

    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});