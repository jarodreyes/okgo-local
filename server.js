var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var midi = require('midi');

// Create a new virtual midi controller called okgo-local
var midiOutput = new midi.output();
midiOutput.openVirtualPort('okgo-local');

// lookup for whatever Midi thing needs to be triggered based upon note sent to call.
const playTime = 500; // milliseconds
const notes = {
    "C2": "36",
    "C3": "48",
    "C4": "60",
    "C5": "72",
    "D2": "38",
    "D3": "50",
    "D4": "62",
    "D5": "74",
    "Db2": "37",
    "Db3": "49",
    "Db4": "61",
    "Db5": "73",
    "E2": "40",
    "E3": "52",
    "E4": "64",
    "E5": "76",
    "Eb2": "39",
    "Eb3": "51",
    "Eb4": "63",
    "Eb5": "75",
    "F2": "41",
    "F3": "53",
    "F4": "65",
    "F5": "77",
    "G2": "43",
    "G3": "55",
    "G4": "67",
    "Gb2": "42",
    "Gb3": "54",
    "Gb4": "66",
    "Gb5": "78",
    "A2": "45",
    "A3": "57",
    "A4": "69",
    "Ab2": "44",
    "Ab3": "56",
    "Ab4": "68",
    "B2": "47",
    "B3": "59",
    "B4": "71",
    "Bb2": "46",
    "Bb3": "58",
    "Bb4": "70"
};

app.use(express.static('public'));
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// we should be able to support 1400-1800 concurrent connections (a lot more than 40)
// https://stackoverflow.com/questions/15872788/maximum-concurrent-socket-io-connections
io.on('connection', function (socket) {
    console.log('a phone connected');
    socket.on('note', function (msg) {

        // I'm guessing this is the variable sent to OSC.
        // You can add it the value in the lookup above.
        var midiNote = notes[msg];
        sendMidi(midiNote);

    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

const sendMidi = (note) => {
    console.log(`Playing Note ${note}`);
    midiOutput.sendMessage([144,note,100]);
    midiOutput.sendMessage([176,66,0]); // sustain

    // NOTE OFF
    setTimeout(() => {
      midiOutput.sendMessage([ 128, note, 0 ]);
    }, playTime)

}

http.listen(3000, function () {
    console.log('listening on *:3000');
});