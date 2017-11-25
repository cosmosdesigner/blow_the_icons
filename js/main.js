
var iconsBoomContainer = document.getElementById('iconsBoom');
var iconsBoomContext = iconsBoomContainer.getContext('2d');
var icons = new Array();
var maxIcons = 10; // Max icons a carregar
var initialIconsToKill = 20; // Quantos icons iniciais;
var iniWidth = 60;
var iniheight = 60;
var iniVx = 100;
var iniVy = 100;
var iniPoint = 1;
var imageObj;
var iconName, icon, allIcons, i;
var mouseX, mouseY;
var request;
var score;
var timestamp = Date.now();
var soundPlaying = true;
var background_sound = new Audio('sound/sound_background.mp3');
var shot = new Audio('sound/pew_final_.m4a');
var deadline = 60; // tempo em segundo


iconsBoomContainer.height = (iconsBoomContainer.clientHeight + iniheight);
iconsBoomContainer.width = (iconsBoomContainer.clientWidth + iniWidth);
iconsBoomContext.fillRect(0, 0, iconsBoomContainer.width, iconsBoomContainer.height);
iconsBoomContext.fillStyle = "#181823";


document.getElementById('startit').style.display = 'block';
document.getElementById('startit').innerHTML = "<a id='playIcon' href='#' onclick='startIt()'><i class='fa fa-play'></i></a><h2 id='phrase'>Blow the icons</h2>";
document.getElementById('container-score').style.display = 'none';
document.getElementById('soundCheck').style.display = 'none';


function timeCounter() {
  document.getElementById('deadline').innerHTML = deadline;
  deadline--;
  if (deadline <= 0) {
    endIt();
    deadline = 60;
  } else {
    setTimeout(timeCounter, 1000); // 1 a 1 segundo
  }
}

function scoreIt(point) {
  score += point;
  document.getElementById('score').innerHTML = score;
}

function getRandomIconImage() {
  imageObj = new Image();
  iconName = Math.floor((Math.random() * maxIcons) + 1);
  imageObj.src = 'images/' + iconName + '.svg';
  return imageObj;
}

function getRandomxPos() {
  return Math.floor((Math.random() * iconsBoomContainer.clientWidth) + 1);
}

function getRandomyPos() {
  return Math.floor((Math.random() * (iconsBoomContainer.clientHeight - 40)) + 1);
}

function getRandomAngle() {
  return Math.floor((Math.random() * 360) + 1);
}

function calculateSpeed() {
  var delta = (Date.now() - timestamp) / 1000;
  timestamp = Date.now();
  icons.map(function(icon, index) {
    vxfinal = Math.cos(icon.angle) * icon.vx * delta;
    vyfinal = Math.sin(icon.angle) * icon.vy * delta;
    icon.xPos += vxfinal;
    icon.yPos += vyfinal;
  });
}

function draw() {
  iconsBoomContext.fillRect(0, 0, iconsBoomContainer.width, iconsBoomContainer.height);
  iconsBoomContext.fillStyle = "#181823";
  calculateSpeed();
  for (var i = 0; i < icons.length; i++) {
    allIcons = icons[i];
    allIcons.refreshStuff();
  }
  request = window.requestAnimationFrame(draw);
}

function displayIcons() {
  for (var i = 0; i < initialIconsToKill; i++) {
    icon = new Icon(getRandomxPos(), getRandomyPos(), iniWidth, iniheight, iniVx, iniVy, getRandomAngle(), getRandomIconImage(), iniPoint);
    icons.push(icon);
  }
  draw();
}

function soundController() {
  if (soundPlaying) {
    background_sound.pause();
    document.getElementById('soundIcon').innerHTML = "<i class='fa fa-volume-off'></i>";
    soundPlaying = false;
    return;
  }
  document.getElementById('soundIcon').innerHTML = "<i class='fa fa-volume-up'></i>";
  background_sound.play();
  soundPlaying = true;
}

function Icon(xPos, yPos, width, height, vx, vy, angle, icon, point) {
  this.xPos = xPos;
  this.yPos = yPos;
  this.width = width;
  this.height = width * height / width;
  this.vx = vx;
  this.vy = vy;
  this.angle = angle;
  this.image = icon;
  this.point = point;
}

function divideAndConquer(icon, index) {
  var self = this;
  if ((icon.width / 2) >= 15 || (icon.height / 2) >= 15) {
    var newIcon = new Icon(icon.xPos, icon.yPos, icon.width / 2, icon.height / 2, icon.vx * 2, icon.vy * 2, getRandomAngle(), icon.image, icon.point * 2);
    var SecondNewIcon = new Icon(icon.xPos, icon.yPos, icon.width / 2, icon.height / 2, icon.vx * 2, icon.vy * 2, getRandomAngle(), icon.image, icon.point * 2);
    setTimeout(function() {
      icons.push(newIcon, SecondNewIcon); // add 2 icons  after 100ms
    }, 100);
  }
  icons.splice(index, 1); // remove icon
  scoreIt(icon.point);
}

function checkCollisions(self){
  if (self.yPos >= (iconsBoomContainer.height - self.width) || self.yPos <= 0) {
    self.vy *= -1;
  }
  if (self.xPos > (iconsBoomContainer.width - self.width) || self.xPos < 0) {
    self.vx *= -1;
  }
}

Icon.prototype.refreshStuff = function() {
  var self = this;
  if (!this.image.complete) {
    this.image.onload = function() {
      iconsBoomContext.drawImage(self.image, self.xPos, self.yPos, self.width, self.height);
    };
  } else {
    iconsBoomContext.drawImage(self.image, self.xPos, self.yPos, self.width, self.height);
  }
  checkCollisions(self);
}

iconsBoomContainer.addEventListener('click', function(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  icons.map(function(icon, index) {
    if (mouseY > icon.yPos - icon.width && mouseY < icon.yPos + icon.width &&
      mouseX > icon.xPos - icon.height && mouseX < icon.xPos + icon.height) {
      shot.play();
      divideAndConquer(icon, index);
    }
  });
}, false);

function startItAgain() {
  location.reload();
}

function startIt() {
  score = 0;
  scoreIt(score);
  document.getElementById('container-score').style.display = 'block';
  document.getElementById('soundCheck').style.display = 'block';
  document.getElementById('soundIcon').innerHTML = "<i class='fa fa-volume-up'></i>";
  document.getElementById('startit').style.display = 'none';
  document.getElementById('phrase').style.display = 'none';
  background_sound.play();
  displayIcons(); // Start Game
  timeCounter();
}

function endIt() {
  icons = [];
  document.getElementById('container-score').style.display = 'none';
  document.getElementById('startit').style.display = 'block';
  document.getElementById('startit').innerHTML = "<a id='playIcon' href='#' onclick='startItAgain()'><i class='fa fa-refresh'></i></a><h2 id='phrase'></h2>";
  document.getElementById('phrase').style.display = 'block';
  document.getElementById('phrase').innerHTML = 'Pontuação final: ' + score + ' pontos';
  document.getElementById('soundCheck').style.display = 'none';
  window.cancelAnimationFrame(request);
  iconsBoomContext.fillRect(0, 0, iconsBoomContainer.width, iconsBoomContainer.height);
  iconsBoomContext.fillStyle = "#181823";
  background_sound.pause();

}
