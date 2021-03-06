
class HandBell {
    constructor({name, el, url}) {
        
        // defaults
        this.name = name;
        this.playableElement = document.getElementById(el);
        console.log(`There is a new HandBell in the world. ${name}`);
        this.playableElement.addEventListener('timeupdate', onTimeUpdate, false);

    }

    playNote() {
        this.playableElement.play();
        $('.accent').addClass('live');
        setTimeout(function() {
            $('.accent').removeClass('live');
        }, 800);
        
    }

    unMute() {
        return this.playableElement.muted = false;
    }
}

let lastX, lastY, lastZ;
let moveCounter = 0;

const onTimeUpdate = function() {
        if (this.currentTime >= 0.6) {
            this.pause();
            this.currentTime=0;
        }
    };

function handleMotion(e) {
    let acc = e.acceleration;
    if(!acc.hasOwnProperty('x')) {
        acc = e.accelerationIncludingGravity;
    }

    if(!acc.x) return;

    //only log if x,y,z > 1
    if(Math.abs(acc.x) >= 1 &&
    Math.abs(acc.y) >= 1 &&
    Math.abs(acc.z) >=1) {
        // console.log('motion', acc);
        if(!lastX) {
            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
            return;
        }

        // Make sure we see a big enough swing in the handbell
        let deltaX = Math.abs(acc.x - lastX);
        let deltaY = Math.abs(acc.y - lastY);
        let deltaZ = Math.abs(acc.z - lastZ);
        
        if(deltaX + deltaY + deltaZ > 3) {
            // console.log(lastX, acc.x, lastY, acc.y, lastZ, acc.z);
            moveCounter++;
            // console.log(moveCounter, Math.round(acc.y));
        } else {
            moveCounter = Math.max(0, --moveCounter);
        }

        // This should trigger somewhere near the top of the handbell action
        // in order to account for delay in audio.play(). Needs to be swung pretty hard.
        if(moveCounter > 1 && acc.y < -7) {
            // Make sure we're not calling playNote() twice in a row.
            debounce(handbell.playNote(), 600, true);
            // console.log(Math.round(lastY), Math.round(acc.y));
            console.log('PLAY!!!!!!!!!!');
            moveCounter = 0;
            lastZ = 0;
            lastY = 0;
            lastX = 0;
        } else {
            lastX = acc.x;
            lastY = acc.y;
            lastZ = acc.z;
        }
    }
}

// This ensures
function debounce(func, wait, immediate) {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;
        
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    
    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
}

function cleanMotion(event) {

    var x = event.acceleration ? event.acceleration.x : event.y * 90;
    var y = event.acceleration ? event.acceleration.x : event.x * 90;
    var z = event.acceleration ? event.acceleration.z : event.z * 90;
    return [Math.round(x),Math.round(y),Math.round(z)];
}

function cleanOrientation(event) {

    var x = event.beta ? event.beta : event.y * 90;
    var y = event.gamma ? event.gamma : event.x * 90;
    return [x,y];
}

function handleOrientationEvent(event) {
    let coordinates = cleanOrientation(event);
    let x = Math.round(coordinates[0]);
    let y = Math.round(coordinates[1]);
    // window.console && console.info('Raw position: x, y: ', x, y);

    if (x < tilt.down) {
        debounce(playNote('67'), 600, true)
    } else if (x > tilt.up) {
        debounce(playNote('68'), 600, true)
    } else if (y > tilt.right) {
        debounce(playNote('69'), 600, true)
    } else if (y < tilt.left) {
        debounce(playNote('66'), 600, true)
    }

}

function playNote(note) {
    // audioStream = playbackElement.captureStream();
    // console.log(audioStream);
    playbackElement.play();
}

function selectElement(domEl) {
    let noteSlug = domEl.data('note');
    let note = notes[noteSlug];
    note.active = true;
    note.playNote();
    console.log(note)
    domEl.addClass('big')
    setTimeout(function() {
        // body
        domEl.removeClass('big')
    }, 500)
}
