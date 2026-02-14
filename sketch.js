function setup() {
  createCanvas(windowWidth, windowHeight);
  background(220);
}

function draw() {
  // Disegna un cerchio che segue il mouse
  fill(0, 102, 153);
  noStroke();
  ellipse(mouseX, mouseY, 50, 50);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(220);
}
