// ✧ PSYCHEFLUX ORACLE - THE LIVING MIRROR OF LIGHT ✧
// Opaline Dreamshell Edition

let phase = 1; // 1 = Living Mirror, 2 = Reflection
let inkblotFrozen = false;
let frozenImage = null;

// Inkblot parameters
let noiseOffsetX = 0;
let noiseOffsetY = 1000;
let noiseScale = 0.008;
let timeOffset = 0;

// Corner orbs
let orbPulse = 0;

// Freeze detection
let mouseHoldStart = 0;
let freezeThreshold = 2000; // 2 seconds
let isHolding = false;

// Blob segments for organic complexity
let blobSegments = [];
const numSegments = 5;

// Symbolic readings dictionary
const symbolReadings = {
  shell: "Protection, inner sanctuary, sacred silence. A spiral back to your source.",
  pearl: "Wisdom through pressure. Soft power born from irritation.",
  wave: "Emotion in motion. What rises must return.",
  coral: "Delicate interconnection. You are part of the unseen reef.",
  jellyfish: "Transparency, passive movement, bioluminescent defense.",
  spiral: "Becoming, rebirth, and divine design coded in you.",
  swan: "Grace, loyalty, and the sorrow-beauty of transformation.",
  water: "Flow, adaptability, the ancient language of feeling.",
  moon: "Cycles, intuition, the tide-keeper within you.",
  mirror: "Self-reflection, truth beneath the surface, parallel worlds.",
  feather: "Lightness, ascension, messages from the unseen.",
  flower: "Unfolding, vulnerability as strength, beauty in becoming.",
  eye: "Perception, witness, the gaze that changes what it sees.",
  wing: "Freedom, transcendence, the courage to rise.",
  root: "Grounding, ancestry, nourishment from the depths.",
  star: "Guidance, distant light, your place in the constellation.",
  ocean: "Vastness, mystery, the womb of all becoming.",
  crystal: "Clarity, structure born from chaos, prismatic truth.",
  serpent: "Transformation, wisdom, the shedding of old selves.",
  butterfly: "Metamorphosis, ephemeral beauty, trust in change.",
  lotus: "Purity from muddy depths, spiritual awakening.",
  labyrinth: "Journey inward, sacred confusion, the path that teaches.",
  bridge: "Connection, passage, between-worlds walking.",
  veil: "Mystery, the sacred unknown, what asks to be revealed.",
  vessel: "Container, holder of essence, sacred emptiness.",
  light: "Illumination, consciousness, the divine spark within.",
  shadow: "The unintegrated, hidden treasure, what you refuse to see.",
  bird: "Freedom, perspective, soul's flight between realms.",
  tree: "Growth, connection of earth and sky, the world axis.",
  cave: "Inner sanctuary, the unconscious, what waits in darkness.",
  flame: "Passion, transformation, the consuming and renewing force."
};

function setup() {
  let canvas = createCanvas(windowWidth, min(windowHeight * 0.6, 800));
  canvas.parent('canvas-container');

  // Initialize blob segments with random properties
  for (let i = 0; i < numSegments; i++) {
    blobSegments.push({
      offsetX: random(1000),
      offsetY: random(1000),
      offsetTime: random(1000),
      radiusBase: random(80, 150),
      points: floor(random(6, 12)),
      irregularity: random(0.3, 0.7)
    });
  }

  // Wire up Phase 2 UI
  document.getElementById('submit-btn').addEventListener('click', generateOracleReading);
  document.getElementById('save-btn').addEventListener('click', saveVision);
  document.getElementById('reset-btn').addEventListener('click', resetToPhase1);

  // Wire up New Inkblot button
  document.getElementById('new-inkblot-btn').addEventListener('click', resetToPhase1);

  // Allow Enter key to submit
  document.getElementById('user-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      generateOracleReading();
    }
  });
}

function draw() {
  // Clear canvas with transparency (rainbow background is now in CSS)
  clear();

  if (phase === 1 && !inkblotFrozen) {
    // Animate inkblot
    drawMorphingInkblot();

    // Advance time for organic motion
    timeOffset += 0.003;
  } else if (inkblotFrozen && frozenImage) {
    // Display frozen inkblot
    image(frozenImage, 0, 0, width, height);
  }

  // Draw corner spirit pearls
  drawCornerOrbs();

  // Handle freeze gesture
  if (isHolding && !inkblotFrozen) {
    let holdDuration = millis() - mouseHoldStart;
    if (holdDuration >= freezeThreshold) {
      freezeInkblot();
    } else {
      // Show progress indicator
      drawFreezeProgress(holdDuration / freezeThreshold);
    }
  }
}

// Background is now handled by CSS - no need for canvas background

function drawMorphingInkblot() {
  push();
  translate(width / 2, height / 2);

  // Glow effect setup
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(173, 223, 214, 0.6)';

  // Draw multiple blob segments for complexity
  for (let segment of blobSegments) {
    drawSymmetricalBlob(segment);
  }

  drawingContext.shadowBlur = 0;
  pop();
}

function drawSymmetricalBlob(segment) {
  // Left side
  drawOrganicBlob(segment, 1);

  // Right side (mirrored)
  push();
  scale(-1, 1);
  drawOrganicBlob(segment, 1);
  pop();
}

function drawOrganicBlob(segment, side) {
  let points = segment.points;
  let radiusBase = segment.radiusBase;

  // Alternate colors for variation
  let inkColor1 = color(173, 223, 214, 180); // Seafoam green
  let inkColor2 = color(234, 218, 234, 180); // Lilac

  let c = lerpColor(inkColor1, inkColor2, noise(segment.offsetTime + timeOffset * 10));
  fill(c);
  noStroke();

  beginShape();
  for (let i = 0; i <= points; i++) {
    let angle = map(i, 0, points, 0, TWO_PI);

    // Use Perlin noise to create organic, flowing edges
    let noiseVal = noise(
      cos(angle) * 0.5 + segment.offsetX + timeOffset,
      sin(angle) * 0.5 + segment.offsetY + timeOffset,
      segment.offsetTime + timeOffset
    );

    // Add irregularity and movement
    let radius = radiusBase * (0.6 + noiseVal * segment.irregularity);

    // Create lobes and tentacles
    let angleNoise = noise(segment.offsetX + i * 0.1, timeOffset * 2);
    let finalAngle = angle + angleNoise * 0.3;

    let x = cos(finalAngle) * radius;
    let y = sin(finalAngle) * radius;

    curveVertex(x, y);
  }
  endShape(CLOSE);
}

function drawCornerOrbs() {
  // Gentle pulse using sine wave for sparkle animation
  orbPulse = sin(frameCount * 0.02) * 0.3 + 1;

  let sparkleSize = 20 * orbPulse;
  let sparkleColors = [
    color(255, 255, 255, 200),    // Pure white
    color(0, 217, 192, 180),      // Turquoise
    color(255, 255, 255, 200),    // Pure white
    color(0, 217, 192, 180)       // Turquoise
  ];

  let positions = [
    [30, 30],                      // Top-left
    [width - 30, 30],              // Top-right
    [30, height - 30],             // Bottom-left
    [width - 30, height - 30]      // Bottom-right
  ];

  drawingContext.shadowBlur = 20;

  for (let i = 0; i < 4; i++) {
    push();
    translate(positions[i][0], positions[i][1]);

    // Draw sparkle shape (4-pointed star with extra center glow)
    drawingContext.shadowColor = 'rgba(0, 217, 192, 0.8)';
    fill(sparkleColors[i]);
    noStroke();

    // Main 4-pointed star
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = (TWO_PI / 8) * j;
      let r = (j % 2 === 0) ? sparkleSize : sparkleSize * 0.3;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Add diagonal cross for 8-pointed sparkle effect
    rotate(PI / 8);
    beginShape();
    for (let j = 0; j < 8; j++) {
      let angle = (TWO_PI / 8) * j;
      let r = (j % 2 === 0) ? sparkleSize * 0.7 : sparkleSize * 0.2;
      let x = cos(angle) * r;
      let y = sin(angle) * r;
      vertex(x, y);
    }
    endShape(CLOSE);

    // Center bright point
    ellipse(0, 0, sparkleSize * 0.4);

    pop();
  }

  drawingContext.shadowBlur = 0;
}

function drawFreezeProgress(progress) {
  // Visual indicator of hold progress
  push();
  fill(255, 255, 255, 100);
  noStroke();
  arc(mouseX, mouseY, 50, 50, 0, TWO_PI * progress, PIE);

  // Glow ring
  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(173, 223, 214, 0.8)';
  noFill();
  stroke(173, 223, 214, 200);
  strokeWeight(3);
  ellipse(mouseX, mouseY, 50);

  drawingContext.shadowBlur = 0;
  pop();
}

function mousePressed() {
  if (phase === 1 && !inkblotFrozen) {
    isHolding = true;
    mouseHoldStart = millis();
  }
}

function mouseReleased() {
  isHolding = false;
}

function touchStarted() {
  if (phase === 1 && !inkblotFrozen) {
    isHolding = true;
    mouseHoldStart = millis();
  }
  return false;
}

function touchEnded() {
  isHolding = false;
  return false;
}

function freezeInkblot() {
  inkblotFrozen = true;
  isHolding = false;

  // Capture current canvas state
  frozenImage = get();

  // Transition to Phase 2
  setTimeout(() => {
    phase = 2;
    document.getElementById('reflection-interface').classList.remove('hidden');
  }, 500);
}

function generateOracleReading() {
  let userInput = document.getElementById('user-input').value.trim().toLowerCase();

  if (!userInput) {
    return;
  }

  let oracleMessage = "This symbol lives in a secret shell. Let it speak again in another tide.";

  // Check for keyword matches
  for (let keyword in symbolReadings) {
    if (userInput.includes(keyword)) {
      oracleMessage = symbolReadings[keyword];
      break;
    }
  }

  // Display oracle message
  let messageEl = document.getElementById('oracle-message');
  messageEl.textContent = oracleMessage;
  messageEl.classList.remove('hidden');

  // Show action buttons
  document.getElementById('action-buttons').classList.remove('hidden');
}

function saveVision() {
  if (frozenImage) {
    // Save the frozen inkblot
    saveCanvas('psycheflux-oracle-vision', 'png');

    // Save user reflection and oracle message
    let userInput = document.getElementById('user-input').value.trim();
    let oracleMsg = document.getElementById('oracle-message').textContent;

    let reflectionData = {
      timestamp: new Date().toISOString(),
      reflection: userInput,
      oracle: oracleMsg
    };

    // Create downloadable text file
    let blob = new Blob([JSON.stringify(reflectionData, null, 2)], { type: 'application/json' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'psycheflux-oracle-reading.json';
    a.click();
    URL.revokeObjectURL(url);
  }
}

function resetToPhase1() {
  // Reset to Phase 1
  phase = 1;
  inkblotFrozen = false;
  frozenImage = null;
  timeOffset = random(1000); // New variation

  // Hide Phase 2 UI
  document.getElementById('reflection-interface').classList.add('hidden');
  document.getElementById('oracle-message').classList.add('hidden');
  document.getElementById('action-buttons').classList.add('hidden');

  // Clear input
  document.getElementById('user-input').value = '';

  // Reinitialize blob segments for fresh patterns
  blobSegments = [];
  for (let i = 0; i < numSegments; i++) {
    blobSegments.push({
      offsetX: random(1000),
      offsetY: random(1000),
      offsetTime: random(1000),
      radiusBase: random(80, 150),
      points: floor(random(6, 12)),
      irregularity: random(0.3, 0.7)
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, min(windowHeight * 0.6, 800));
}
