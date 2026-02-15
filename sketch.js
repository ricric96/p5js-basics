let pg;
let vertexCount = 100;

function setup() {
  // Posizioniamo il canvas nel container specifico
  let canvas = createCanvas(windowWidth - 250, windowHeight);
  canvas.parent('canvas-container');

  pg = createGraphics(width, height);
}

function draw() {
  background(255);

  // Leggiamo i valori direttamente dagli elementi HTML
  let blurVal = parseFloat(document.getElementById('inputBlur').value);
  let thresholdVal = parseFloat(document.getElementById('inputThreshold').value);
  let strokeVal = parseFloat(document.getElementById('inputStroke').value);
  let gapVal = parseFloat(document.getElementById('inputGap').value);
  let countVal = parseInt(document.getElementById('inputCircles').value);
  let jitterVal = parseFloat(document.getElementById('inputJitter').value);

  // Calcoliamo le posizioni dei fulcri basate sulla percentuale (slider 0-100)
  let f1x = (parseFloat(document.getElementById('inputF1X').value) / 100) * width;
  let f1y = (parseFloat(document.getElementById('inputF1Y').value) / 100) * height;
  let f2x = (parseFloat(document.getElementById('inputF2X').value) / 100) * width;
  let f2y = (parseFloat(document.getElementById('inputF2Y').value) / 100) * height;

  // --- Disegno sul Buffer ---
  pg.background(255);
  pg.noFill();
  pg.stroke(0);
  pg.strokeWeight(strokeVal);

  for (let i = 1; i <= countVal; i++) {
    let radius = i * gapVal;
    drawCircleToBuffer(pg, f1x, f1y, radius, vertexCount, jitterVal);
    drawCircleToBuffer(pg, f2x, f2y, radius, vertexCount, jitterVal);
  }

  // --- Applicazione Filtri ---
  if (blurVal > 0) pg.filter(BLUR, blurVal);
  pg.filter(THRESHOLD, thresholdVal);

  // Visualizzazione
  image(pg, 0, 0);

  // Centri
  fill(0);
  noStroke();
  ellipse(f1x, f1y, 5, 5);
  ellipse(f2x, f2y, 5, 5);
}

function drawCircleToBuffer(buffer, x, y, r, res, jitter) {
  buffer.beginShape();
  for (let i = 0; i < res; i++) {
    let angle = map(i, 0, res, 0, TWO_PI);
    let currentR = r + random(-jitter, jitter);
    let vx = x + cos(angle) * currentR;
    let vy = y + sin(angle) * currentR;
    buffer.vertex(vx, vy);
  }
  buffer.endShape(CLOSE);
}

function windowResized() {
  // Sottraiamo la larghezza del pannello laterale (250px)
  resizeCanvas(windowWidth - 250, windowHeight);
  pg = createGraphics(width, height);
}
