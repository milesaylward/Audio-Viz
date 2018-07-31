const domready = require('domready');
import Canvas from './Canvas';
import { token } from './config';
import { introAnim } from './intro';
import '../css/app.scss';

let canvas,
    gui,
    pathSound,
    songTitle,
    frequencys,
    average,
    treble,
    bass,
    medium,
    isLaunch = 0,
    soundStarted = 0,
    headerText = 'Audio Visualization'.split(''),
    launcher,
    inputFile;

domready(() => {
  canvas = new Canvas(window.innerWidth, window.innerHeight);
  const node = document.body.appendChild(canvas.renderer.domElement);
  window.onresize = resizeHandler;
  // Intro scene
  const play = document.getElementById('play-controls');
  const introBlock = document.getElementById('introBlock');
  const types = document.getElementById('types');
  const title = document.getElementById('glitchText');
  const back = document.getElementById('back');
  const button = document.getElementById('button');

  var val = { val: 0.000001 };
  var turb = document.querySelectorAll('#filter feTurbulence')[0];
  var btTl = new TimelineLite({ paused: true, onUpdate: function() {
    turb.setAttribute('baseFrequency', '0 ' + val.val);
  } });

  btTl.to(val, 1, { val: 0.3 });
  btTl.to(button, 0.8, { opacity: 0 }, '-=0.8');

  button.addEventListener('click', function() {
    btTl.restart();
    setTimeout(() => {
      introAnim();
    }, 1000)
  });

  types.onclick = (e) => {
      switch (e.target.innerHTML) {
        case 'Rap':
          pathSound = '../sound/psycho.mp3'
          songTitle = 'Psycho by Post Malone';
          break;
        case 'Reggae':
          pathSound = '../sound/fall.mp3'
          songTitle = 'Falling by Iration';
          break;
        case 'EDM':
          pathSound = '../sound/wake.mp3'
          songTitle = 'Wake Me Up by Avicii';
          break;
        case 'Folk':
          pathSound = '../sound/monster.mp3'
          songTitle = 'Monster by The Revivalists';
          break;
        case 'Metal':
          pathSound = '../sound/second.mp3'
          songTitle = 'Second & Sebring by Of Mice & Men';
          break;
        default:
          return;
      };
      glitchText.dataset.text = songTitle;
      glitchText.innerHTML = songTitle;
      types.classList.add('fade-out');
      play.classList.remove('fade-out');
      back.classList.remove('fade-out');

    };
    back.onclick = () => {
      back.classList.add('fade-out');
      play.classList.add('fade-out');
      setTimeout(() => {
        types.classList.remove('fade-out');
      }, 700);
    }
  play.onclick = () => {
    play.classList.add('fade-out');
    back.classList.add('fade-out');
    introBlock.classList.add('fade-out');
    node.classList.add('active');
    startXp();
  };
});

function startXp() {
  setupAudio();
  loadSound(pathSound);

  // let's play !
  animate();
}

function resizeHandler() {
  canvas.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  canvas.render(average, treble, bass, medium);
}

// Get sound
if (! window.AudioContext) {
  if (! window.webkitAudioContext) {
      alert('no audiocontext found');
  }
  window.AudioContext = window.webkitAudioContext;
}

let context = new AudioContext(),
    audioBuffer,
    sourceNode = context.createBufferSource(),
    analyser = context.createAnalyser(),
    arrayData =  new Uint8Array(analyser.frequencyBinCount),
    javascriptNode;

function loadSound (url) {
  console.log('load');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            playSound(buffer);
        });
    }
    request.send();
}

function playSound (buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}


function setupAudio () {
    javascriptNode = context.createScriptProcessor(1024, 1, 1);
    javascriptNode.connect(context.destination);

    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 1024;

    sourceNode.connect(analyser);
    analyser.connect(javascriptNode);
    sourceNode.connect(context.destination);


    javascriptNode.onaudioprocess = function() {
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      average = getAverageVolume(array);
      frequencys = getByteFrequencyData(array);

      splitFrenquencyArray(array);

      if (average != 0) {
        soundStarted = 1;
      }

      if (soundStarted == 1 && average == 0) {
        soundStarted = 0;
        isLaunch = 0;
      }
    }
}

function splitFrenquencyArray(array) {
    var n = 3;
    var tab = Object.keys(array).map(function(key) {
        return array[key]
    });
    var len = tab.length,
        frequencyArray = [],
        i = 0;

    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        frequencyArray.push(tab.slice(i, i + size));
        i += size;
    }

    getBass(frequencyArray[0]);
    getMedium(frequencyArray[1]);
    getTreble(frequencyArray[2]);
}

function getBass(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  bass = values / length;
  return bass;
}

function getMedium(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  medium = values / length;
  return medium;
}

function getTreble(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  treble = values / length;
  return treble;
}

function getByteFrequencyData (array) {
    var values = 0;
    var frequencys;

    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    frequencys = values / length;
    return frequencys;
}


function getAverageVolume (array) {
    var values = 0;
    var average;

    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    average = values / length;
    return average;
}

function handleFileSelect (evt) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.srcElement.files;
    } else {
      var files = document.getElementById('fileinput').files;
    }
    var reader = new FileReader();

    if (files[0].type.match('audio.*')) {
      console.log(evt.target.result);
    }
}
