let font;
let tSize = 50; // size of the text
let tposX1 = 50; // X position of the first text
let tposY1 = 100; // Y position of the first text
let tposY2 = 170; // Y position of the duplicate text
let tposY3 = 240; // Y position of the new duplicate text
let tposY4 = 310; // Y position of the third duplicate text
let pointCount = 0.9; // between 0 - 1 particle count

let speed = 35; // speed of particles
let speed2 = 80;
let speed3 = 65;
let speed4 = 50;
let comebackSpeed = 1000; // lower numbers less strength
let dia = 15; // diameter of interaction
let randomPos = false; // starting positions - true or false
let pointsDirection = "left"; // left right up down general
let interactionDirection = -1; // between -1 and 1
let soundEffect 

let textPoints = [];
let textPointsDuplicate = []; // Array for the duplicate particles
let textPointsDuplicate2 = []; // Array for the third duplicate particles
let textPointsDuplicate3 = []; // Array for the fourth duplicate particles

function preload() {
    font = loadFont("AvenirNextLTPro-Demi.otf");
  soundEffect = loadSound("click.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  // Generate points for the first text "catalog"
  let points1 = font.textToPoints("catalog", tposX1, tposY1, tSize, {
    sampleFactor: pointCount,
  });

  // Generate points for the first duplicate text "about us"
  let points2 = font.textToPoints("about us", tposX1, tposY2, tSize, {
    sampleFactor: pointCount,
  });

  // Generate points for the second duplicate text "contact"
  let points3 = font.textToPoints("work", tposX1, tposY3, tSize, {
    sampleFactor: pointCount,
  });

  // Generate points for the third duplicate text "contact"
  let points4 = font.textToPoints("contact", tposX1, tposY4, tSize, {
    sampleFactor: pointCount,
  });

  // Create particles for the first text "catalog"
  for (let i = 0; i < points1.length; i++) {
    let pt = points1[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed2,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPoints.push(textPoint);
  }

  // Create particles for the first duplicate text "about us"
  for (let i = 0; i < points2.length; i++) {
    let pt = points2[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed3,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPointsDuplicate.push(textPoint);
  }

  // Create particles for the second duplicate text "contact"
  for (let i = 0; i < points3.length; i++) {
    let pt = points3[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed4,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPointsDuplicate2.push(textPoint);
  }

  // Create particles for the third duplicate text "contact"
  for (let i = 0; i < points4.length; i++) {
    let pt = points4[i];
    let textPoint = new Interact(
      pt.x,
      pt.y,
      speed,
      dia,
      randomPos,
      comebackSpeed,
      pointsDirection,
      interactionDirection
    );
    textPointsDuplicate3.push(textPoint);
  }
}

function draw() {
  background(40, 50, 100);

  // Update and display particles for the first text "catalog"
  for (let i = 0; i < textPoints.length; i++) {
    let v = textPoints[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Update and display particles for the first duplicate text "about us"
  for (let i = 0; i < textPointsDuplicate.length; i++) {
    let v = textPointsDuplicate[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Update and display particles for the second duplicate text "contact"
  for (let i = 0; i < textPointsDuplicate2.length; i++) {
    let v = textPointsDuplicate2[i];
    v.update();
    v.show();
    v.behaviors();
  }

  // Update and display particles for the third duplicate text "contact"
  for (let i = 0; i < textPointsDuplicate3.length; i++) {
    let v = textPointsDuplicate3[i];
    v.update();
    v.show();
    v.behaviors();
  }
}

// Interact class for particle behavior (same as before)
function Interact(x, y, m, d, t, s, di, p) {
  this.home = t ? createVector(random(width), random(height)) : createVector(x, y);
  this.pos = this.home.copy();
  this.target = createVector(x, y);

  if (di == "general") {
    this.vel = createVector();
  } else if (di == "up") {
    this.vel = createVector(0, -y);
  } else if (di == "down") {
    this.vel = createVector(0, y);
  } else if (di == "left") {
    this.vel = createVector(-x, 0);
  } else if (di == "right") {
    this.vel = createVector(x, 0);
  }

  this.acc = createVector();
  this.r = 8;
  this.maxSpeed = m;
  this.maxforce = 1;
  this.dia = d;
  this.come = s;
  this.dir = p;
  this.isMouseOver = false; // Add a flag to track if mouse is over the particle
}

Interact.prototype.behaviors = function () {
  let arrive = this.arrive(this.target);
  let mouse = createVector(mouseX, mouseY);
  let flee = this.flee(mouse);

  // Check if the mouse is over the particle
  if (this.pos.dist(mouse) < this.dia) {
    this.isMouseOver = true;
  } else {
    this.isMouseOver = false;
  }

  this.applyForce(arrive);
  this.applyForce(flee);
};

Interact.prototype.applyForce = function (f) {
  this.acc.add(f);
};

Interact.prototype.arrive = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();
  let speed = this.maxSpeed;
  if (d < this.come) {
    speed = map(d, 0, this.come, 0, this.maxSpeed);
  }
  desired.setMag(speed);
  let steer = p5.Vector.sub(desired, this.vel);
  return steer;
};

Interact.prototype.flee = function (target) {
  let desired = p5.Vector.sub(target, this.pos);
  let d = desired.mag();

  if (d < this.dia) {
    desired.setMag(this.maxSpeed);
    desired.mult(this.dir);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  } else {
    return createVector(0, 0);
  }
};

Interact.prototype.update = function () {
  this.pos.add(this.vel);
  this.vel.add(this.acc);
  this.acc.mult(0);
};

Interact.prototype.show = function () {
  if (this.isMouseOver) {
    stroke(0, 255, 0); // Green color when the mouse is over the particle
  } else {
    stroke(262, 100, 40); // Default color
  }
  strokeWeight(2);
  point(this.pos.x, this.pos.y);
};

function windowResize(){
  resizeCanvas(windowWidth, windowHeight)
};

function mouseDragged() {
  // Check if the mouse is within the bounds of the text
  if (mouseX > tposX1 && mouseX < tposX1 + tSize &&
      mouseY > tposY1 && mouseY < tposY4) {
    soundEffect.play(); // Play the sound when the mouse is dragged over the text
  } 
}