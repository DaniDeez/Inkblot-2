// Psycheflux Oracle Inkblot Simulator
// "The ink of the forest soul."

// State management
let phase = 1; // 1 = evolving inkblot, 2 = oracle reflection
let frozen = false;
let frozenImage = null;

// Inkblot parameters
let inkblotPoints = [];
let numPoints = 180;
let timeOffset = 0;
let noiseScale = 0.005;
let radiusBase = 200;

// Click and hold
let holdStartTime = 0;
let isHolding = false;
const HOLD_DURATION = 2000; // 2 seconds

// Colors
const INK_COLOR = '#013220';
const GLOW_COLOR = 'rgba(139, 195, 74, 0.6)'; // golden-green
const ORB_COLOR = '#FFD700';
const PARCHMENT_BASE = '#f4e8d0';

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

  // Initialize inkblot points
  for (let i = 0; i < numPoints; i++) {
    inkblotPoints.push({
      angle: (TWO_PI / numPoints) * i,
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000)
    });
  }

  // Setup UI event listeners
  setupEventListeners();
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
    timeOffset += 0.003;

    // Visual feedback for hold progress
    if (isHolding) {
      drawHoldProgress();
    }
  } else {
    // Show frozen image
    if (frozenImage) {
      image(frozenImage, 0, 0);
    }
  }
}

function drawParchmentBackground() {
  background(PARCHMENT_BASE);

  // Add subtle grain texture using noise
  loadPixels();
  for (let x = 0; x < width; x += 2) {
    for (let y = 0; y < height; y += 2) {
      let n = noise(x * 0.01, y * 0.01) * 15;
      let c = color(244 - n, 232 - n, 208 - n);
      set(x, y, c);
    }
  }
  updatePixels();
}

function drawInkblot() {
  push();
  translate(width / 2, height / 2);

  // Enable glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = GLOW_COLOR;

  // Draw left half
  fill(INK_COLOR);
  noStroke();
  beginShape();
  for (let point of inkblotPoints) {
    let r = getRadiusAtAngle(point.angle, point.noiseOffsetX, point.noiseOffsetY);
    let x = r * cos(point.angle);
    let y = r * sin(point.angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  // Draw mirrored right half (vertical symmetry)
  beginShape();
  for (let point of inkblotPoints) {
    let r = getRadiusAtAngle(point.angle, point.noiseOffsetX, point.noiseOffsetY);
    let x = -r * cos(point.angle); // Mirror X
    let y = r * sin(point.angle);
    vertex(x, y);
  }
  endShape(CLOSE);

  // Reset shadow
  drawingContext.shadowBlur = 0;

  pop();
}

function getRadiusAtAngle(angle, offsetX, offsetY) {
  // Use multiple layers of Perlin noise for organic complexity
  let noise1 = noise(
    cos(angle) * 2 + timeOffset + offsetX,
    sin(angle) * 2 + timeOffset + offsetY
  );

  let noise2 = noise(
    cos(angle * 2) * 1.5 + timeOffset * 1.5 + offsetX,
    sin(angle * 2) * 1.5 + timeOffset * 1.5 + offsetY
  );

  let noise3 = noise(
    cos(angle * 0.5) + timeOffset * 0.5 + offsetX,
    sin(angle * 0.5) + timeOffset * 0.5 + offsetY
  );

  // Combine noise layers for complex organic shapes
  let combinedNoise = (noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2);

  // Create lobes and tentacles
  let angleVariation = sin(angle * 3 + timeOffset * 2) * 0.3 + 1;

  // Scale based on canvas size
  let baseRadius = min(width, height) * 0.25;

  return baseRadius * combinedNoise * angleVariation;
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

function drawHoldProgress() {
  let elapsed = millis() - holdStartTime;
  let progress = elapsed / HOLD_DURATION;

  if (progress > 1) progress = 1;

  // Draw progress ring
  push();
  translate(width / 2, height / 2);
  noFill();
  stroke(255, 215, 0, 200);
  strokeWeight(8);
  arc(0, 0, 100, 100, -HALF_PI, -HALF_PI + TWO_PI * progress);
  pop();
}

function mousePressed() {
  if (!frozen) {
    isHolding = true;
    holdStartTime = millis();
  }
}

function mouseReleased() {
  isHolding = false;
}

function touchStarted() {
  if (!frozen) {
    isHolding = true;
    holdStartTime = millis();
  }
  return false;
}

function touchEnded() {
  isHolding = false;
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
  // Check for hold completion
  setInterval(() => {
    if (isHolding && !frozen) {
      let elapsed = millis() - holdStartTime;
      if (elapsed >= HOLD_DURATION) {
        isHolding = false;
        freezeInkblot();
      }
    }
  }, 100);

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
  if (frozen && frozenImage) {
    // Redraw frozen image at new size
    frozenImage = null; // Could implement better resizing logic
  }
}
