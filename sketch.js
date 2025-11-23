// ✧ PSYCHEFLUX ORACLE - THE LIVING MIRROR OF LIGHT ✧
// Static Rorschach Inkblot Generator

let phase = 1; // 1 = Living Mirror, 2 = Reflection
let inkblotFrozen = false;
let frozenImage = null;

// Corner sparkles
let orbPulse = 0;

// Freeze detection
let mouseHoldStart = 0;
let freezeThreshold = 2000; // 2 seconds
let isHolding = false;

// Static inkblot data
let inkblotData = [];
let inkblotGenerated = false;

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

  // Generate initial inkblot
  generateNewInkblot();

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
    // Draw static inkblot
    drawStaticInkblot();
  } else if (inkblotFrozen && frozenImage) {
    // Display frozen inkblot
    image(frozenImage, 0, 0, width, height);
  }

  // Draw corner sparkles
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

// ===== INKBLOT GENERATION SYSTEM =====

function generateNewInkblot() {
  inkblotData = [];

  // Generate multiple organic blob zones with different characteristics
  let numZones = floor(random(3, 6));

  for (let i = 0; i < numZones; i++) {
    let zone = {
      centerX: random(-width * 0.15, width * 0.15),
      centerY: random(-height * 0.25, height * 0.25),
      baseRadius: random(60, 180),
      points: [],
      tendrils: [],
      spatters: []
    };

    // Generate main blob shape with Perlin noise
    let numPoints = floor(random(20, 40));
    let noiseOffset = random(1000);

    for (let j = 0; j < numPoints; j++) {
      let angle = map(j, 0, numPoints, 0, TWO_PI);

      // Multi-octave Perlin noise for organic irregularity
      let noiseVal1 = noise(cos(angle) * 2 + noiseOffset, sin(angle) * 2 + noiseOffset);
      let noiseVal2 = noise(cos(angle) * 5 + noiseOffset + 100, sin(angle) * 5 + noiseOffset + 100);
      let noiseVal3 = noise(cos(angle) * 10 + noiseOffset + 200, sin(angle) * 10 + noiseOffset + 200);

      // Combine noise octaves for complex shape
      let radiusVariation = noiseVal1 * 0.5 + noiseVal2 * 0.3 + noiseVal3 * 0.2;
      let radius = zone.baseRadius * (0.4 + radiusVariation * 1.2);

      // Add angular distortion for lobes and folds
      let angleDistortion = noise(j * 0.1 + noiseOffset + 300) * 0.4 - 0.2;
      let finalAngle = angle + angleDistortion;

      zone.points.push({
        x: cos(finalAngle) * radius,
        y: sin(finalAngle) * radius
      });
    }

    // Generate tendrils/branches (some zones get them)
    if (random() > 0.4) {
      let numTendrils = floor(random(2, 5));
      for (let t = 0; t < numTendrils; t++) {
        let tendril = {
          startAngle: random(TWO_PI),
          length: random(40, 120),
          thickness: random(8, 25),
          segments: []
        };

        let numSegments = floor(random(5, 12));
        let currentAngle = tendril.startAngle;
        let currentLength = 0;

        for (let s = 0; s < numSegments; s++) {
          currentAngle += random(-0.5, 0.5);
          let segmentLength = tendril.length / numSegments;
          currentLength += segmentLength;

          tendril.segments.push({
            x: cos(currentAngle) * currentLength,
            y: sin(currentAngle) * currentLength,
            thickness: tendril.thickness * (1 - s / numSegments)
          });
        }

        zone.tendrils.push(tendril);
      }
    }

    // Generate ink spatters/bleeding effect
    let numSpatters = floor(random(10, 30));
    for (let s = 0; s < numSpatters; s++) {
      zone.spatters.push({
        x: random(-zone.baseRadius * 1.3, zone.baseRadius * 1.3),
        y: random(-zone.baseRadius * 1.3, zone.baseRadius * 1.3),
        size: random(3, 15),
        opacity: random(100, 255)
      });
    }

    inkblotData.push(zone);
  }

  inkblotGenerated = true;
}

function drawStaticInkblot() {
  if (!inkblotGenerated) return;

  push();
  translate(width / 2, height / 2);

  // Draw left half and mirror to right
  drawHalfInkblot();

  // Mirror to right side
  push();
  scale(-1, 1);
  drawHalfInkblot();
  pop();

  pop();
}

function drawHalfInkblot() {
  for (let zone of inkblotData) {
    push();
    translate(zone.centerX, zone.centerY);

    // Draw spatters first (background layer)
    for (let spatter of zone.spatters) {
      fill(0, spatter.opacity);
      noStroke();
      ellipse(spatter.x, spatter.y, spatter.size);
    }

    // Draw main blob shape with soft edges
    drawingContext.shadowBlur = 8;
    drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';

    fill(0);
    noStroke();

    beginShape();
    for (let i = 0; i < zone.points.length; i++) {
      let pt = zone.points[i];
      if (i === 0) {
        vertex(pt.x, pt.y);
      }
      curveVertex(pt.x, pt.y);
    }
    // Close the shape smoothly
    let firstPts = zone.points.slice(0, 3);
    for (let pt of firstPts) {
      curveVertex(pt.x, pt.y);
    }
    endShape(CLOSE);

    // Draw tendrils
    for (let tendril of zone.tendrils) {
      let startPoint = zone.points[floor(tendril.startAngle / TWO_PI * zone.points.length)];

      for (let i = 0; i < tendril.segments.length; i++) {
        let seg = tendril.segments[i];
        fill(0, 200);
        noStroke();

        let x = startPoint.x + seg.x;
        let y = startPoint.y + seg.y;
        ellipse(x, y, seg.thickness);

        // Add texture to tendrils
        if (i > 0) {
          let prevSeg = tendril.segments[i - 1];
          strokeWeight(seg.thickness * 0.8);
          stroke(0, 220);
          line(
            startPoint.x + prevSeg.x,
            startPoint.y + prevSeg.y,
            x,
            y
          );
        }
      }
    }

    drawingContext.shadowBlur = 0;
    pop();
  }
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

  // Hide Phase 2 UI
  document.getElementById('reflection-interface').classList.add('hidden');
  document.getElementById('oracle-message').classList.add('hidden');
  document.getElementById('action-buttons').classList.add('hidden');

  // Clear input
  document.getElementById('user-input').value = '';

  // Generate new inkblot
  generateNewInkblot();
}

function windowResized() {
  resizeCanvas(windowWidth, min(windowHeight * 0.6, 800));
  // Regenerate inkblot for new canvas size
  if (inkblotGenerated && !inkblotFrozen) {
    generateNewInkblot();
  }
}
