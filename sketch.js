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
      startY: random(-baseSize * 0.3, baseSize * 0.3),
      x: random(baseSize * 0.05, baseSize * 0.35), // Only left side
      baseRadius: random(baseSize * 0.08, baseSize * 0.2),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000),
      noiseOffsetZ: random(1000),
      verticalSpeed: random(0.3, 0.8), // For lava lamp vertical drift
      stretchFactor: random(0.8, 1.5) // How much it stretches vertically
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
  // Clear and reset everything
  clear();
  background(PARCHMENT_BASE);

  if (!frozen) {
    // Draw parchment background texture
    drawParchmentBackground();

    // Draw evolving inkblot
    drawInkblot();

    // Draw corner guardian orbs
    drawGuardianOrbs();

    // Update time for animation - slower for lava lamp effect
    timeOffset += 0.002;
  } else {
    // Show frozen image
    if (frozenImage) {
      image(frozenImage, 0, 0, width, height);
    }
  }
}

function drawParchmentBackground() {
  // Draw the pre-rendered texture covering the full canvas
  if (parchmentTexture) {
    push();
    imageMode(CORNER);
    image(parchmentTexture, 0, 0, width, height);
    pop();
  }
}

function drawInkblot() {
  push();
  translate(width / 2, height / 2);

  // Reset any shadows first
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;

  // Enable glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = GLOW_COLOR;

  fill(INK_COLOR);
  noStroke();

  // Draw each blob with vertical symmetry
  for (let blob of inkblotBlobs) {
    // Calculate lava lamp vertical drift
    let driftY = sin(timeOffset * blob.verticalSpeed + blob.noiseOffsetZ) * 80;
    let currentY = blob.startY + driftY;

    // Draw left side blob
    drawLavaLampBlob(blob.x, currentY, blob);

    // Draw mirrored right side blob
    drawLavaLampBlob(-blob.x, currentY, blob);
  }

  // Reset shadow
  drawingContext.shadowBlur = 0;
  drawingContext.shadowOffsetX = 0;
  drawingContext.shadowOffsetY = 0;

  pop();
}

function drawLavaLampBlob(centerX, centerY, blob) {
  beginShape();

  let numPoints = 180; // More points for smoother curves

  // Lava lamp blobs stretch and squish
  let squishFactor = sin(timeOffset * 1.2 + blob.noiseOffsetZ) * 0.3 + 1;

  for (let i = 0; i <= numPoints; i++) {
    let angle = (TWO_PI / numPoints) * i;

    // Smooth flowing noise - slower, more fluid
    let noise1 = noise(
      centerX * 0.005 + cos(angle) * 1.5 + timeOffset * 0.5 + blob.noiseOffsetX,
      centerY * 0.005 + sin(angle) * 1.5 + timeOffset * 0.5 + blob.noiseOffsetY
    );

    let noise2 = noise(
      centerX * 0.003 + cos(angle * 2) + timeOffset * 0.3 + blob.noiseOffsetX,
      centerY * 0.003 + sin(angle * 2) + timeOffset * 0.3 + blob.noiseOffsetY
    );

    let noise3 = noise(
      cos(angle * 0.5) * 2 + timeOffset * 0.6 + blob.noiseOffsetX,
      sin(angle * 0.5) * 2 + timeOffset * 0.6 + blob.noiseOffsetY
    );

    // Combine noise for smooth organic flow
    let radiusVariation = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);

    // Gentle undulation like lava lamp
    let flow = sin(angle * 3 + timeOffset * 2) * 0.15;
    radiusVariation += flow;

    // Add subtle lobes (not sharp tentacles)
    let lobeEffect = sin(angle * 4 - timeOffset * 1.5) * 0.2 * noise1;
    radiusVariation += lobeEffect;

    // Keep blobs substantial - lava lamps have volume
    radiusVariation = constrain(radiusVariation, 0.6, 1.4);

    let r = blob.baseRadius * radiusVariation;

    // Apply stretch/squish based on vertical position
    let xRadius = r / squishFactor;
    let yRadius = r * squishFactor * blob.stretchFactor;

    let x = centerX + xRadius * cos(angle);
    let y = centerY + yRadius * sin(angle);

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

    // Reset any previous shadow
    drawingContext.shadowBlur = 0;
    drawingContext.shadowOffsetX = 0;
    drawingContext.shadowOffsetY = 0;

    // Glow effect
    drawingContext.shadowBlur = pulse;
    drawingContext.shadowColor = ORB_COLOR;

    // Draw orb
    fill(255, 248, 220, 200);
    noStroke();
    ellipse(corner.x, corner.y, orbSize, orbSize);

    // Inner glow
    fill(255, 215, 0, 100);
    ellipse(corner.x, corner.y, orbSize * 0.6, orbSize * 0.6);

    // Reset shadow
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
