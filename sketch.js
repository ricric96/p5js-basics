let pg;
let vertexCount = 100;

function setup() {
  let w = parseInt(document.getElementById('inputWidth').value);
  let h = parseInt(document.getElementById('inputHeight').value);

  // Renderer standard (estremamente stabile)
  let canvas = createCanvas(w, h);
  canvas.parent('canvas-container');

  pg = createGraphics(w, h);

  // Listener ridimensionamento manuale
  select('#btnResize').mousePressed(() => {
    let newW = parseInt(document.getElementById('inputWidth').value);
    let newH = parseInt(document.getElementById('inputHeight').value);
    resizeCanvas(newW, newH);
    pg = createGraphics(newW, newH);
    console.log("Canvas ridimensionato:", newW, "x", newH);
  });

  // Listener PNG - Fix estensione: salvataggio diretto dal buffer grafico
  select('#btnSavePNG').mousePressed(() => {
    console.log("Salvataggio in corso: pattern.png");
    pg.save('pattern.png');
  });
}

function draw() {
  background(255);

  const params = getParams();

  // --- Disegno sul Buffer ---
  pg.background(255);
  pg.noFill();
  pg.stroke(0);
  pg.strokeWeight(params.stroke);

  drawPattern(pg, params);

  // --- Applicazione Filtri ---
  if (params.blur > 0) pg.filter(BLUR, params.blur);
  pg.filter(THRESHOLD, params.threshold);

  // --- Ricolorazione Pixel ---
  pg.loadPixels();
  let c = color(params.color);
  let r = red(c), g = green(c), b = blue(c);

  if (r !== 0 || g !== 0 || b !== 0) {
    for (let i = 0; i < pg.pixels.length; i += 4) {
      if (pg.pixels[i] < 128) {
        pg.pixels[i] = r;
        pg.pixels[i + 1] = g;
        pg.pixels[i + 2] = b;
      }
    }
    pg.updatePixels();
  }

  // Visualizzazione
  image(pg, 0, 0);

  // Centri
  fill(params.color);
  noStroke();
  ellipse(params.f1x, params.f1y, 5, 5);
  ellipse(params.f2x, params.f2y, 5, 5);
}

function getParams() {
  const getById = (id) => document.getElementById(id);
  return {
    blur: parseFloat(getById('inputBlur').value),
    threshold: parseFloat(getById('inputThreshold').value),
    stroke: parseFloat(getById('inputStroke').value),
    gap: parseFloat(getById('inputGap').value),
    count: parseInt(getById('inputCircles').value),
    jitter: parseFloat(getById('inputJitter').value),
    oval: parseFloat(getById('inputOval').value),
    color: getById('inputColor').value,
    f1x: parseFloat(getById('inputF1X').value),
    f1y: parseFloat(getById('inputF1Y').value),
    f2x: parseFloat(getById('inputF2X').value),
    f2y: parseFloat(getById('inputF2Y').value)
  };
}

function drawPattern(target, p) {
  for (let i = 1; i <= p.count; i++) {
    let radius = i * p.gap;
    drawCircleShape(target, p.f1x, p.f1y, radius, vertexCount, p.jitter, p.oval);
    drawCircleShape(target, p.f2x, p.f2y, radius, vertexCount, p.jitter, p.oval);
  }
}

function drawCircleShape(buffer, x, y, r, res, jitter, oval) {
  buffer.beginShape();
  for (let i = 0; i < res; i++) {
    let angle = map(i, 0, res, 0, TWO_PI);
    let currentR = r + random(-jitter, jitter);
    let vx = x + cos(angle) * currentR;
    let vy = y + sin(angle) * currentR * oval;
    buffer.vertex(vx, vy);
  }
  buffer.endShape(CLOSE);
}
