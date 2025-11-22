// Oracle Inkblot Simulator
// Phase 1: Living Mirror of Light
// Phase 2: Reflective Tides Within

let inkblotParticles = [];
let cornerOrbs = [];
let noiseScale = 0.01;
let timeOffset = 0;
let phase = 1; // Current phase (1 or 2)
let isFrozen = false;
let freezeStartTime = 0;
let freezeThreshold = 2000; // 2 seconds in milliseconds
let frozenImage;

// Symbolic readings database
const symbolReadings = {
  shell: "Protection, inner sanctuary, sacred silence. A spiral back to your source.",
  pearl: "Wisdom through pressure. Soft power born from irritation.",
  wave: "Emotion in motion. What rises must return.",
  coral: "Delicate interconnection. You are part of the unseen reef.",
  jellyfish: "Transparency, passive movement, bioluminescent defense.",
  spiral: "Becoming, rebirth, and divine design coded in you.",
  swan: "Grace, loyalty, and the sorrow-beauty of transformation.",
  ocean: "The depth of all feeling. You are vast and contain multitudes.",
  moon: "Cycles, reflection, the pull of invisible forces upon you.",
  butterfly: "Metamorphosis complete. You are no longer who you were.",
  lotus: "Rising from mud into light. Beauty through struggle.",
  feather: "Lightness, messages from beyond, the weightlessness of release.",
  eye: "Witness. The one who sees is also seen.",
  mirror: "What you seek is seeking you. The reflection reveals the viewer.",
  serpent: "Shedding, transformation, ancient wisdom coiled within.",
  roots: "Foundation, ancestry, the unseen that feeds what grows.",
  wings: "Freedom earned, flight after the long crawl.",
  water: "Emotion, flow, the shape of the container you choose.",
  fire: "Passion, destruction, purification through burning.",
  tree: "Growth, patience, the slow reach toward light.",
  star: "Navigation, hope, the light that travels through darkness.",
  heart: "The center of all. Love as the organizing principle.",
  hand: "Creation, touch, the power to shape your world.",
  door: "Threshold, choice, the invitation to cross over.",
  key: "Solution, access, the answer you've been carrying."
};

function setup() {
  // Create canvas that fills the window
  let canvas = createCanvas(windowWidth, windowHeight - 200);
  canvas.parent('canvas-container');

  // Set background to antique parchment texture color
  background(252, 248, 240);

  // Initialize inkblot particles for organic motion
  initializeInkblot();

  // Initialize corner orbs (Spirit Pearls)
  initializeCornerOrbs();

  // Set up Phase 2 event listeners
  setupPhase2Listeners();
}

function draw() {
  if (!isFrozen) {
    // Draw the living background
    drawParchmentBackground();

    // Draw corner orbs (Spirit Pearls)
    drawCornerOrbs();

    // Update and draw the evolving inkblot
    updateInkblot();
    drawInkblot();

    // Increment time for animation
    timeOffset += 0.003;
  } else {
    // Display frozen image
    if (frozenImage) {
      image(frozenImage, 0, 0);
    }
  }

  // Draw freeze progress indicator if holding
  if (mouseIsPressed && !isFrozen) {
    let elapsed = millis() - freezeStartTime;
    let progress = constrain(elapsed / freezeThreshold, 0, 1);

    // Draw progress circle
    push();
    stroke(173, 223, 214, 150);
    strokeWeight(4);
    noFill();
    let angle = progress * TWO_PI - HALF_PI;
    arc(mouseX, mouseY, 60, 60, -HALF_PI, angle);
    pop();
  }
}

function initializeInkblot() {
  inkblotParticles = [];
  // Create multiple blob segments with different characteristics
  let blobCount = 5;

  for (let i = 0; i < blobCount; i++) {
    let blob = {
      centerY: height * (0.3 + i * 0.1),
      radiusBase: random(40, 100),
      noiseOffsetX: random(1000),
      noiseOffsetY: random(1000),
      points: [],
      color: color(random([173, 234, 245]), random([223, 218, 200]), random([214, 234, 255]), 180)
    };

    // Generate points around the blob
    for (let angle = 0; angle < TWO_PI; angle += 0.1) {
      blob.points.push(angle);
    }

    inkblotParticles.push(blob);
  }
}

function updateInkblot() {
  // Update each blob's shape using Perlin noise
  for (let blob of inkblotParticles) {
    // Drift the center slightly
    let driftX = noise(blob.noiseOffsetX + timeOffset) * 30 - 15;
    let driftY = noise(blob.noiseOffsetY + timeOffset) * 30 - 15;
    blob.centerY += driftY * 0.01;

    // Keep blobs within bounds
    blob.centerY = constrain(blob.centerY, height * 0.2, height * 0.8);
  }
}

function drawInkblot() {
  let centerX = width / 2;

  // Draw each blob with vertical symmetry
  for (let blob of inkblotParticles) {
    drawSymmetricBlob(centerX, blob.centerY, blob);
  }
}

function drawSymmetricBlob(centerX, centerY, blob) {
  // Enable glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(173, 223, 214, 0.6)';

  // Draw left side
  fill(blob.color);
  noStroke();
  beginShape();

  for (let angle of blob.points) {
    let noiseVal = noise(
      cos(angle) * noiseScale + blob.noiseOffsetX,
      sin(angle) * noiseScale + blob.noiseOffsetY,
      timeOffset
    );

    let radius = blob.radiusBase + map(noiseVal, 0, 1, -30, 30);

    // Create organic complexity with extra noise layers
    let detailNoise = noise(angle * 3 + timeOffset * 2);
    radius += map(detailNoise, 0, 1, -15, 15);

    let x = centerX - radius * cos(angle);
    let y = centerY + radius * sin(angle);

    curveVertex(x, y);
  }

  // Close the shape
  let firstAngle = blob.points[0];
  let noiseVal = noise(
    cos(firstAngle) * noiseScale + blob.noiseOffsetX,
    sin(firstAngle) * noiseScale + blob.noiseOffsetY,
    timeOffset
  );
  let radius = blob.radiusBase + map(noiseVal, 0, 1, -30, 30);
  let detailNoise = noise(firstAngle * 3 + timeOffset * 2);
  radius += map(detailNoise, 0, 1, -15, 15);

  curveVertex(centerX - radius * cos(firstAngle), centerY + radius * sin(firstAngle));

  endShape(CLOSE);

  // Draw right side (mirrored)
  beginShape();

  for (let angle of blob.points) {
    let noiseVal = noise(
      cos(angle) * noiseScale + blob.noiseOffsetX,
      sin(angle) * noiseScale + blob.noiseOffsetY,
      timeOffset
    );

    let radius = blob.radiusBase + map(noiseVal, 0, 1, -30, 30);

    // Create organic complexity
    let detailNoise = noise(angle * 3 + timeOffset * 2);
    radius += map(detailNoise, 0, 1, -15, 15);

    let x = centerX + radius * cos(angle); // Mirrored
    let y = centerY + radius * sin(angle);

    curveVertex(x, y);
  }

  // Close the shape
  noiseVal = noise(
    cos(firstAngle) * noiseScale + blob.noiseOffsetX,
    sin(firstAngle) * noiseScale + blob.noiseOffsetY,
    timeOffset
  );
  radius = blob.radiusBase + map(noiseVal, 0, 1, -30, 30);
  detailNoise = noise(firstAngle * 3 + timeOffset * 2);
  radius += map(detailNoise, 0, 1, -15, 15);

  curveVertex(centerX + radius * cos(firstAngle), centerY + radius * sin(firstAngle));

  endShape(CLOSE);

  // Reset shadow
  drawingContext.shadowBlur = 0;
}

function initializeCornerOrbs() {
  cornerOrbs = [
    { x: 40, y: 40, color: color(255, 248, 240), phase: 0 },
    { x: width - 40, y: 40, color: color(248, 241, 255), phase: HALF_PI },
    { x: 40, y: height - 40, color: color(255, 240, 245), phase: PI },
    { x: width - 40, y: height - 40, color: color(240, 248, 255), phase: PI + HALF_PI }
  ];
}

function drawCornerOrbs() {
  for (let orb of cornerOrbs) {
    // Pulsing radius using sine wave
    let pulseRadius = 15 + sin(timeOffset * 3 + orb.phase) * 5;

    // Glow effect
    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor = 'rgba(255, 255, 255, 0.8)';

    fill(orb.color);
    noStroke();
    ellipse(orb.x, orb.y, pulseRadius * 2);

    // Reset shadow
    drawingContext.shadowBlur = 0;
  }
}

function drawParchmentBackground() {
  // Soft gradient background simulating antique parchment
  background(252, 248, 240);

  // Add subtle texture using noise
  noStroke();
  for (let i = 0; i < 50; i++) {
    let x = random(width);
    let y = random(height);
    let alpha = random(5, 15);
    fill(245, 240, 235, alpha);
    ellipse(x, y, random(100, 300));
  }
}

function mousePressed() {
  if (!isFrozen) {
    freezeStartTime = millis();
  }
}

function mouseReleased() {
  if (!isFrozen) {
    let elapsed = millis() - freezeStartTime;

    if (elapsed >= freezeThreshold) {
      // Freeze the inkblot
      freezeInkblot();
    }
  }
}

function freezeInkblot() {
  isFrozen = true;

  // Capture current canvas state
  frozenImage = get();

  // Transition to Phase 2
  setTimeout(() => {
    showPhase2();
  }, 300);
}

function showPhase2() {
  phase = 2;

  // Show the Phase 2 UI
  let phase2Container = document.getElementById('phase2-container');
  phase2Container.classList.remove('hidden');

  // Hide instructions
  document.querySelector('.instructions').style.opacity = '0';
}

// Phase 2: Event Listeners
function setupPhase2Listeners() {
  let submitBtn = document.getElementById('submit-btn');
  let userInput = document.getElementById('user-input');
  let saveBtn = document.getElementById('save-btn');

  // Submit button
  submitBtn.addEventListener('click', () => {
    let inputText = userInput.value.trim().toLowerCase();

    if (inputText.length === 0) {
      return;
    }

    let oracleMessage = getOracleReading(inputText);
    displayOracleMessage(oracleMessage);

    // Show save button
    saveBtn.classList.remove('hidden');
  });

  // Enter key support
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitBtn.click();
    }
  });

  // Save button
  saveBtn.addEventListener('click', () => {
    saveVision();
  });
}

function getOracleReading(inputText) {
  // Check for keyword matches
  for (let [keyword, reading] of Object.entries(symbolReadings)) {
    if (inputText.includes(keyword)) {
      return reading;
    }
  }

  // Default message for unknown symbols
  return "This symbol lives in a secret shell. Let it speak again in another tide.";
}

function displayOracleMessage(message) {
  let oracleDiv = document.getElementById('oracle-message');
  oracleDiv.textContent = message;
  oracleDiv.classList.remove('hidden');
}

function saveVision() {
  if (frozenImage) {
    // Save the canvas image
    saveCanvas('oracle-inkblot', 'png');

    // Save the user's reflection
    let userInput = document.getElementById('user-input').value;
    let oracleMessage = document.getElementById('oracle-message').textContent;

    let reflectionData = {
      timestamp: new Date().toISOString(),
      vision: userInput,
      reading: oracleMessage
    };

    // Download as JSON
    let dataStr = JSON.stringify(reflectionData, null, 2);
    let dataBlob = new Blob([dataStr], { type: 'application/json' });
    let url = URL.createObjectURL(dataBlob);

    let link = document.createElement('a');
    link.href = url;
    link.download = 'oracle-reflection.json';
    link.click();

    // Clean up
    URL.revokeObjectURL(url);

    // Visual feedback
    let saveBtn = document.getElementById('save-btn');
    let originalText = saveBtn.textContent;
    saveBtn.textContent = '✨ Saved!';

    setTimeout(() => {
      saveBtn.textContent = originalText;
    }, 2000);
  }
}

// Handle window resize
function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 200);

  // Reinitialize corner orbs with new positions
  if (cornerOrbs.length > 0) {
    cornerOrbs[1].x = width - 40;
    cornerOrbs[2].y = height - 40;
    cornerOrbs[3].x = width - 40;
    cornerOrbs[3].y = height - 40;
  }
}

// Reset function (optional, for testing)
function keyPressed() {
  if (key === 'r' || key === 'R') {
    // Reset to Phase 1
    isFrozen = false;
    phase = 1;
    timeOffset = 0;
    frozenImage = null;

    document.getElementById('phase2-container').classList.add('hidden');
    document.getElementById('oracle-message').classList.add('hidden');
    document.getElementById('save-btn').classList.add('hidden');
    document.getElementById('user-input').value = '';
    document.querySelector('.instructions').style.opacity = '0.7';

    initializeInkblot();
  }
}
