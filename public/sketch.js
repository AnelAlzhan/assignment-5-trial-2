let clientSocket = io();

clientSocket.on("connect", newConnection);
clientSocket.on("mouseBroadcast", newBroadcast);

function newConnection() {
  console.log(clientSocket.id);
}

var sideX;
var sideY;

function newBroadcast(data) {
  sideX = data.x;
  sideY = data.y;
  console.log(sideX, sideY);
}

var particle;
let lines = [];

function mouseMoved() {
  let message = {
    x: mouseX,
    y: mouseY,
  };
  clientSocket.emit("mouse", message);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  particle = new Particle(100, 100);
  sideP = new sideParticle(100, 100);
}

function draw() {
  background(200);

  particle.update();
  particle.show();

  sideP.update();
  sideP.show();
  for (let i = 0; i < lines.length; i++) {
    lines[i].show();
    lines[i].update();
  }
}

function mouseClicked() {
  lines.push(new Line(mouseX, mouseY));
}
function keyPressed() {}

function mouseReleased() {
  lines.splice(0, 1);
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.history = [];
  this.lineHistory = [];
  this.sWidth = 100;

  this.update = function () {
    this.sWidth -= 1;

    this.x += random(-10, 10);
    this.y += random(-10, 10);
    if (this.sWidth < -100) {
      this.sWidth = 100;
    }

    var v = createVector(mouseX, mouseY);
    this.history.push(v);
    this.lineHistory.push(v);
    if (this.history.length > 10) {
      this.history.splice(0, 1);
    }
    if (this.lineHistory.length > 150) {
      this.lineHistory.splice(0, 1);
    }
  };
  this.show = function () {
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var scale = this.history.length;
      push();
      noStroke();
      fill(random(50));
      ellipse(pos.x, pos.y, i * 5, i * 5);
      pop();
    }
  };
}

function sideParticle(x, y) {
  this.x = x;
  this.y = y;
  this.history = [];
  this.lineHistory = [];
  this.sWidth = 100;

  this.update = function () {
    this.sWidth -= 1;

    this.x += random(-10, 10);
    this.y += random(-10, 10);
    if (this.sWidth < -100) {
      this.sWidth = 100;
    }

    var v = createVector(sideX, sideY);
    this.history.push(v);
    this.lineHistory.push(v);
    if (this.history.length > 5) {
      this.history.splice(0, 1);
    }
    if (this.lineHistory.length > 150) {
      this.lineHistory.splice(0, 1);
    }
  };
  this.show = function () {
    for (var i = 0; i < this.history.length; i++) {
      var pos = this.history[i];
      var scale = this.history.length;
      push();
      strokeWeight(2);
      noFill();
      ellipse(pos.x, pos.y, i * 5, i * 5);
      pop();
    }
  };
}

class Line {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.lineHistory = [];
  }
  update() {
    this.x += random(-10, 10);
    this.y += random(-10, 10);

    let v = createVector(mouseX, mouseY);
    this.lineHistory.push(v);

    if (this.lineHistory.length > 100) {
      this.lineHistory.splice(0, 1);
    }
  }

  show() {
    noFill();
    strokeWeight(5);
    beginShape();
    for (var i = 0; i < this.lineHistory.length; i++) {
      var linepos = this.lineHistory[i];

      vertex(linepos.x, linepos.y);
    }
    endShape();
  }

  paintLine() {
    strokeWeight(10);

    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}
