var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var midi = require('midi');

// Create a new virtual midi controller called okgo-local
var midiOutput = new midi.output();
midiOutput.openVirtualPort('okgo-local');

// simple Dict of notes -> midi mapping
const playTime = 200; // milliseconds
const notes = {
    "C2": "36",
    "C3": "48",
    "C4": "60",
    "C5": "72",
    "C6": "84",
    "C7": "96",
    "C8": "108",
    "D2": "38",
    "D3": "50",
    "D4": "62",
    "D5": "74",
    "D6": "86",
    "D7": "98",
    "Db2": "37",
    "Db3": "49",
    "Db4": "61",
    "Db5": "73",
    "Db6": "85",
    "Db7": "97",
    "E2": "40",
    "E3": "52",
    "E4": "64",
    "E5": "76",
    "E6": "88",
    "E7": "100",
    "Eb2": "39",
    "Eb3": "51",
    "Eb4": "63",
    "Eb5": "75",
    "Eb6": "87",
    "Eb7": "99",
    "F2": "41",
    "F3": "53",
    "F4": "65",
    "F5": "77",
    "F6": "89",
    "F7": "101",
    "G2": "43",
    "G3": "55",
    "G4": "67",
    "G5": "79",
    "G6": "91",
    "G7": "103",
    "Gb2": "42",
    "Gb3": "54",
    "Gb4": "66",
    "Gb5": "78",
    "Gb6": "90",
    "Gb7": "102",
    "A2": "45",
    "A3": "57",
    "A4": "69",
    "A5": "81",
    "A6": "93",
    "A7": "105",
    "Ab2": "44",
    "Ab3": "56",
    "Ab4": "68",
    "Ab5": "80",
    "Ab6": "92",
    "Ab7": "104",
    "B2": "47",
    "B3": "59",
    "B4": "71",
    "B5": "83",
    "B6": "95",
    "B7": "107",
    "Bb2": "46",
    "Bb3": "58",
    "Bb4": "70",
    "Bb5": "82",
    "Bb6": "94",
    "Bb7": "106"
};

app.use(express.static('public'));
app.get('/*', function (req, res) {
    res.send('index.html');
});

io.on('connection', function (socket) {
    socket.on('note', function (msg) {
        var midiNote = notes[msg];
        sendMidi(midiNote);

    });

    socket.on('startTime', function (msg) {
        var endTime = new Date();
        var timeDiff = endTime - new Date(msg); //in ms
        timeDiff /= 1000;
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

const sendMidi = (note) => {
    midiOutput.sendMessage([144,note,100]);
    setTimeout(() => {
      midiOutput.sendMessage([ 128, note, 0 ]);
    }, playTime)

}

http.listen(3000, function () {
    console.log('listening on *:3000');
});