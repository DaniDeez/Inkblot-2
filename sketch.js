// Psycheflux Oracle Inkblot Simulator
// "The ink of the forest soul."

// State management
let phase = 1; // 1 = evolving inkblot, 2 = oracle reflection
let frozen = false;
let frozenImage = null;

// Inkblot parameters - True Rorschach with multiple blobs
let inkblotBlobs = [];
let numBlobs = 5;
let timeOffset = 0;

// Parchment texture
let parchmentTexture;

// Colors
const INK_COLOR = '#013220';
const GLOW_COLOR = 'rgba(139, 195, 74, 0.6)'; // golden-green
const ORB_COLOR = '#FFD700';
const PARCHMENT_BASE = '#5c4a3a'; // Chocolate brown parchment

// Symbol dictionary
const symbolReadings = {
  wolf: "Instinct, protection, loneliness, pack-bond. The guardian of thresholds.",
  eye: "Seeing beyond. Intuition. Revelation. The seer's portal.",
  spiral: "Cycles, DNA, the infinite inward. Becoming without end.",
  doorway: "Threshold, unknown, new path. The soul's next step.",
  snake: "Transformation, hidden power, kundalini, release.",
  tree: "Growth, lineage, rooted wisdom. Connection between worlds.",
  flame: "Purification, passion, destruction. The soul on fire."
};

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');

  // Create parchment texture ONCE for performance
  createParchmentTexture();

  // Initialize blob centers for true Rorschach patterns
  initializeBlobs();

  // Setup UI event listeners
  setupEventListeners();
}

function initializeBlobs() {
  inkblotBlobs = [];
  let baseSize = min(width, height);

  for (let i = 0; i < numBlobs; i++) {
    inkblotBlobs.push({
      y: random(-baseSize * 0.3, baseSize * 0.3),
      x: random(baseSize * 0.05, baseSize * 0.35), // Only left side
      baseRadius: random(baseSize * 0.08, baseSize * 0.2),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000),
      tentacleCount: floor(random(3, 8)),
      wildness: random(0.5, 2.5) // How irregular the blob is
    });
  }
}

function createParchmentTexture() {
  parchmentTexture = createGraphics(windowWidth, windowHeight);
  parchmentTexture.background(PARCHMENT_BASE);

  // Add subtle grain texture using noise - only done ONCE
  parchmentTexture.loadPixels();
  for (let x = 0; x < parchmentTexture.width; x += 2) {
    for (let y = 0; y < parchmentTexture.height; y += 2) {
      let n = noise(x * 0.01, y * 0.01) * 20;
      // Chocolate brown with variation
      let r = 92 - n;
      let g = 74 - n;
      let b = 58 - n;
      let index = (x + y * parchmentTexture.width) * 4;
      parchmentTexture.pixels[index] = r;
      parchmentTexture.pixels[index + 1] = g;
      parchmentTexture.pixels[index + 2] = b;
      parchmentTexture.pixels[index + 3] = 255;
    }
  }
  parchmentTexture.updatePixels();
}

function draw() {
  if (!frozen) {
    // Draw parchment background
    drawParchmentBackground();

    // Draw evolving inkblot
    drawInkblot();

    // Draw corner guardian orbs
    drawGuardianOrbs();

    // Update time for animation
    timeOffset += 0.004;
  } else {
    // Show frozen image
    if (frozenImage) {
      image(frozenImage, 0, 0);
    }
  }
}

function drawParchmentBackground() {
  // Simply draw the pre-rendered texture - MUCH faster!
  image(parchmentTexture, 0, 0);
}

function drawInkblot() {
  push();
  translate(width / 2, height / 2);

  // Enable glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = GLOW_COLOR;

  fill(INK_COLOR);
  noStroke();

  // Draw each blob with vertical symmetry
  for (let blob of inkblotBlobs) {
    // Draw left side blob
    drawSingleBlob(blob.x, blob.y, blob);

    // Draw mirrored right side blob
    drawSingleBlob(-blob.x, blob.y, blob);
  }

  // Reset shadow
  drawingContext.shadowBlur = 0;

  pop();
}

function drawSingleBlob(centerX, centerY, blob) {
  beginShape();

  let numPoints = 120;

  for (let i = 0; i <= numPoints; i++) {
    let angle = (TWO_PI / numPoints) * i;

    // Multiple layers of noise for complex organic shapes
    let noise1 = noise(
      centerX * 0.01 + cos(angle) * 2 + timeOffset + blob.noiseOffsetX,
      centerY * 0.01 + sin(angle) * 2 + timeOffset + blob.noiseOffsetY
    );

    let noise2 = noise(
      centerX * 0.01 + cos(angle * 3) * 1.5 + timeOffset * 1.3 + blob.noiseOffsetX,
      centerY * 0.01 + sin(angle * 3) * 1.5 + timeOffset * 1.3 + blob.noiseOffsetY
    );

    let noise3 = noise(
      centerX * 0.005 + cos(angle * 0.5) + timeOffset * 0.7 + blob.noiseOffsetX,
      centerY * 0.005 + sin(angle * 0.5) + timeOffset * 0.7 + blob.noiseOffsetY
    );

    // Create tentacles and lobes with sine variations
    let tentacleEffect = 0;
    for (let t = 0; t < blob.tentacleCount; t++) {
      let tentacleAngle = (TWO_PI / blob.tentacleCount) * t;
      let tentacleDist = abs(angle - tentacleAngle);
      if (tentacleDist > PI) tentacleDist = TWO_PI - tentacleDist;

      // Sharp protrusions for tentacles
      tentacleEffect += (1 - tentacleDist / PI) * sin(timeOffset * 3 + t) * 0.4;
    }

    // Combine all effects for wildly irregular organic shapes
    let radiusVariation = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.3);
    radiusVariation += tentacleEffect * blob.wildness;

    // Add edge rippling and bulging
    let edgeRipple = sin(angle * 7 + timeOffset * 4) * 0.15;
    let edgeBulge = cos(angle * 4 - timeOffset * 2.5) * 0.2;

    radiusVariation += (edgeRipple + edgeBulge) * noise1;

    // Clamp to create negative space (some blobs shrink/disappear at times)
    radiusVariation = constrain(radiusVariation, 0.2, 1.8);

    let r = blob.baseRadius * radiusVariation;
    let x = centerX + r * cos(angle);
    let y = centerY + r * sin(angle);

    curveVertex(x, y);
  }

  endShape(CLOSE);
}

function drawGuardianOrbs() {
  let orbSize = 40;
  let pulse = sin(frameCount * 0.05) * 10 + 30;

  let corners = [
    { x: 50, y: 50 },
    { x: width - 50, y: 50 },
    { x: 50, y: height - 50 },
    { x: width - 50, y: height - 50 }
  ];

  for (let corner of corners) {
    push();

    // Glow effect
    drawingContext.shadowBlur = pulse;
    drawingContext.shadowColor = ORB_COLOR;

    // Draw orb
    fill(255, 248, 220, 200);
    noStroke();
    circle(corner.x, corner.y, orbSize);

    // Inner glow
    fill(255, 215, 0, 100);
    circle(corner.x, corner.y, orbSize * 0.6);

    drawingContext.shadowBlur = 0;
    pop();
  }
}

function mousePressed() {
  if (!frozen) {
    freezeInkblot();
  }
  return false;
}

function touchStarted() {
  if (!frozen) {
    freezeInkblot();
  }
  return false;
}

function freezeInkblot() {
  frozen = true;
  frozenImage = get();
  phase = 2;

  // Show oracle interface
  document.getElementById('oracle-interface').classList.remove('hidden');
}

function setupEventListeners() {
  // Submit button
  document.getElementById('submit-vision').addEventListener('click', () => {
    let input = document.getElementById('vision-input').value.toLowerCase().trim();
    if (input) {
      processVision(input);
    }
  });

  // Enter key to submit
  document.getElementById('vision-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      let input = document.getElementById('vision-input').value.toLowerCase().trim();
      if (input) {
        processVision(input);
      }
    }
  });

  // Save button
  document.getElementById('save-vision').addEventListener('click', () => {
    saveVision();
  });
}

function processVision(input) {
  let message = '';
  let foundSymbol = false;

  // Check for symbol matches
  for (let symbol in symbolReadings) {
    if (input.includes(symbol)) {
      message = symbolReadings[symbol];
      foundSymbol = true;
      break;
    }
  }

  if (!foundSymbol) {
    message = "Your symbol speaks in a rare tongue. Keep listening.";
  }

  // Display oracle message
  let messageEl = document.getElementById('oracle-message');
  messageEl.textContent = message;
  messageEl.classList.remove('hidden');

  // Show save button
  document.getElementById('save-vision').classList.remove('hidden');
}

function saveVision() {
  if (frozenImage) {
    // Save the inkblot image
    save('psycheflux-vision-' + Date.now() + '.png');

    // Optional: save reflection text
    let input = document.getElementById('vision-input').value;
    let message = document.getElementById('oracle-message').textContent;

    console.log('Vision saved!');
    console.log('Your reflection:', input);
    console.log('Oracle message:', message);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Recreate parchment texture at new size
  createParchmentTexture();

  // Reinitialize blobs for new canvas size
  initializeBlobs();

  if (frozen && frozenImage) {
    // Redraw frozen image at new size
    frozenImage = null;
  }
}
