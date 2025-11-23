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

// Symbolic readings with trigger words
const symbolReadings = {
  // Original symbols
  shell: { message: "Protection, inner sanctuary, sacred silence. A spiral back to your source.", triggers: ["shell", "spiral", "coil"] },
  pearl: { message: "Wisdom through pressure. Soft power born from irritation.", triggers: ["pearl", "gem", "orb"] },
  wave: { message: "Emotion in motion. What rises must return.", triggers: ["wave", "tide", "swell"] },
  coral: { message: "Delicate interconnection. You are part of the unseen reef.", triggers: ["coral", "reef"] },
  jellyfish: { message: "Transparency, passive movement, bioluminescent defense.", triggers: ["jellyfish", "transparent"] },
  spiral: { message: "Becoming, rebirth, and divine design coded in you.", triggers: ["spiral", "swirl", "coil"] },
  swan: { message: "Grace, loyalty, and the sorrow-beauty of transformation.", triggers: ["swan", "graceful"] },
  water: { message: "Flow, adaptability, the ancient language of feeling.", triggers: ["water", "liquid", "flow"] },
  moon: { message: "Cycles, intuition, the tide-keeper within you.", triggers: ["moon", "lunar", "crescent"] },
  mirror: { message: "Self-reflection, truth beneath the surface, parallel worlds.", triggers: ["mirror", "reflection", "twin"] },
  feather: { message: "Lightness, ascension, messages from the unseen.", triggers: ["feather", "plume"] },
  flower: { message: "Unfolding, vulnerability as strength, beauty in becoming.", triggers: ["flower", "bloom", "petal"] },
  eye: { message: "Perception, witness, the gaze that changes what it sees.", triggers: ["eye", "eyes", "gaze", "look", "stare"] },
  wing: { message: "Freedom, transcendence, the courage to rise.", triggers: ["wing", "wings", "flight"] },
  root: { message: "Grounding, ancestry, nourishment from the depths.", triggers: ["root", "roots", "ground"] },
  star: { message: "Guidance, distant light, your place in the constellation.", triggers: ["star", "stars", "constellation"] },
  ocean: { message: "Vastness, mystery, the womb of all becoming.", triggers: ["ocean", "sea", "deep"] },
  crystal: { message: "Clarity, structure born from chaos, prismatic truth.", triggers: ["crystal", "prism", "gem"] },
  serpent: { message: "Transformation, wisdom, the shedding of old selves.", triggers: ["serpent", "snake", "reptile"] },
  butterfly: { message: "Metamorphosis, ephemeral beauty, trust in change.", triggers: ["butterfly", "cocoon", "metamorphosis"] },
  lotus: { message: "Purity from muddy depths, spiritual awakening.", triggers: ["lotus", "bloom"] },
  labyrinth: { message: "Journey inward, sacred confusion, the path that teaches.", triggers: ["labyrinth", "maze", "path"] },
  bridge: { message: "Connection, passage, between-worlds walking.", triggers: ["bridge", "cross", "connect"] },
  veil: { message: "Mystery, the sacred unknown, what asks to be revealed.", triggers: ["veil", "curtain", "hidden"] },
  vessel: { message: "Container, holder of essence, sacred emptiness.", triggers: ["vessel", "container", "bowl"] },
  light: { message: "Illumination, consciousness, the divine spark within.", triggers: ["light", "glow", "shine", "radiance"] },
  shadow: { message: "The unintegrated, hidden treasure, what you refuse to see.", triggers: ["shadow", "dark", "shade"] },
  bird: { message: "Freedom, perspective, soul's flight between realms.", triggers: ["bird", "fly", "soar"] },
  tree: { message: "Growth, connection of earth and sky, the world axis.", triggers: ["tree", "trunk", "branches"] },
  cave: { message: "Inner sanctuary, the unconscious, what waits in darkness.", triggers: ["cave", "cavern", "hollow"] },
  flame: { message: "Passion, transformation, the consuming and renewing force.", triggers: ["flame", "fire", "burn"] },

  // Animals
  moth: { message: "Transformation in darkness, attraction to the unseen, vulnerability to light.", triggers: ["moth", "flutter", "night"] },
  crab: { message: "Emotional armor, cycles, home within, lunar instincts.", triggers: ["crab", "sideways", "claws"] },
  lobster: { message: "Depth, regeneration, primal fears, armored emotions.", triggers: ["lobster", "claw", "red"] },
  spider: { message: "Creative weaving, feminine power, shadow instinct.", triggers: ["spider", "web", "weave", "legs", "spin"] },
  beetle: { message: "Ancient protection, rebirth, hidden strength.", triggers: ["beetle", "scarab", "insect", "bug"] },
  bear: { message: "Strength, hibernation, inner power, guardian energy.", triggers: ["bear", "claws", "hibernate", "power", "wild"] },
  scorpion: { message: "Shadow work, defense, poison and transformation.", triggers: ["scorpion", "sting", "tail"] },
  elephant: { message: "Memory, wisdom, sacred ancestry, gentleness and strength.", triggers: ["elephant", "tusk", "trunk", "memory", "large"] },
  dolphin: { message: "Joy, harmony, intuitive communication, sonic healing.", triggers: ["dolphin", "leap", "play", "swim"] },
  wolf: { message: "Loyalty, instinct, teacher of the pack or lone path.", triggers: ["wolf", "howl", "wild", "alpha", "forest"] },
  crow: { message: "Mystery, prophecy, message from the beyond.", triggers: ["crow", "raven", "black", "omen", "caw"] },
  frog: { message: "Cleansing, metamorphosis, voice and rebirth.", triggers: ["frog", "jump", "pond", "ribbit", "wet"] },
  lizard: { message: "Dreaming, regeneration, primordial instinct.", triggers: ["lizard", "tail", "desert", "crawl", "scale"] },
  crocodile: { message: "Primal wisdom, survival, ancient emotions.", triggers: ["crocodile", "teeth", "swamp", "snap", "predator"] },
  peacock: { message: "Beauty, display, divine pride, radiant aura.", triggers: ["peacock", "feather", "show", "strut", "color"] },
  octopus: { message: "Adaptability, shape-shifting, deep subconscious.", triggers: ["octopus", "tentacle", "ink"] },
  seahorse: { message: "Delicate strength, male nurturing, grace in currents.", triggers: ["seahorse", "float", "tiny"] },

  // Human figures
  "two people": { message: "Connection, reflection, relationship mirror.", triggers: ["pair", "duo", "two", "together", "partnership"] },
  "dancing figures": { message: "Joy, ritual, movement in unison.", triggers: ["dance", "dancing", "moving", "spin", "celebrate", "joy"] },
  person: { message: "Identity, projection, core self.", triggers: ["person", "individual", "someone", "human", "figure"] },

  // Anatomy
  lungs: { message: "Breath, life, grief and release.", triggers: ["lungs", "breathe", "air", "inhale", "exhale"] },
  pelvis: { message: "Rooted power, sexuality, foundation.", triggers: ["pelvis", "hips", "base", "sex"] },
  ribcage: { message: "Protection, vulnerability, sacred container.", triggers: ["rib", "ribs", "ribcage", "cage", "chest"] },
  spine: { message: "Support, alignment, inner axis.", triggers: ["spine", "backbone", "core", "align", "vertebrae"] },
  brain: { message: "Thought, perception, complexity.", triggers: ["brain", "thought", "mind", "intellect", "head"] },
  heart: { message: "Emotion, love, pain, essence.", triggers: ["heart", "beat", "pulse", "emotion", "love"] },
  uterus: { message: "Creation, divine feminine, inner cauldron.", triggers: ["uterus", "womb", "creation", "cycle", "feminine"] },
  "internal organs": { message: "Gut feeling, hidden function, internal truth.", triggers: ["organs", "inside", "guts", "feelings", "intestines"] },
  "x-ray": { message: "Seeing through, raw truth, vulnerability.", triggers: ["x-ray", "xray", "bones", "see-through", "scan"] },
  bones: { message: "Structure, death and rebirth, foundation.", triggers: ["bones", "skeleton", "skeletal", "white", "core"] },
  "blood vessels": { message: "Circulation, connection, vital pathways.", triggers: ["vein", "veins", "artery", "vessel", "blood"] },

  // Mythological & Fantasy
  dragon: { message: "Power, fire, inner beast, spiritual challenge.", triggers: ["dragon", "flame", "scale", "myth", "beast"] },
  monster: { message: "Fear, shadow self, hidden truth.", triggers: ["monster", "beast", "terror", "creature", "scary"] },
  alien: { message: "Outsider perspective, unknown intelligence.", triggers: ["alien", "space", "et", "weird", "different", "extraterrestrial"] },
  creature: { message: "Uncategorized part of self, instinct.", triggers: ["creature", "thing", "odd", "wild"] },
  ghost: { message: "Memory, past, haunting presence.", triggers: ["ghost", "spirit", "haunt", "phantom", "specter"] },
  fairy: { message: "Whimsy, nature magic, ethereal play.", triggers: ["fairy", "fae", "tiny", "magic", "sprite"] },
  troll: { message: "Undercurrent hostility, blockages.", triggers: ["troll", "bridge", "block", "mean"] },
  gargoyle: { message: "Protector of hidden places, watcher of shadows.", triggers: ["gargoyle", "stone", "statue", "watcher", "guardian"] },
  "mythical beast": { message: "Unknown power, hybrid force, archetypal chaos.", triggers: ["mythical", "mixed", "legend", "hybrid"] },
  "sea monster": { message: "Deep emotional fears, submerged chaos.", triggers: ["sea monster", "leviathan", "kraken"] },

  // Identity
  face: { message: "Persona, identity, what is shown.", triggers: ["face", "expression", "visage"] },
  profile: { message: "Perspective, side of self, incomplete view.", triggers: ["profile", "side"] },
  mask: { message: "False self, protection, hidden emotion.", triggers: ["mask", "cover", "pretend", "hide", "disguise"] },
  clown: { message: "Performance, hidden pain, emotional exaggeration.", triggers: ["clown", "jester", "smile", "fake", "performer"] },
  witch: { message: "Powerful feminine, feared knowledge, archetypal outsider.", triggers: ["witch", "magic", "crone", "hag", "sorceress"] },
  angel: { message: "Purity, divine messenger, protection.", triggers: ["angel", "halo", "divine", "pure"] },
  demon: { message: "Temptation, inner shadow, power misused.", triggers: ["demon", "devil", "horn", "evil"] },
  skull: { message: "Mortality, truth beneath appearance.", triggers: ["skull", "bone", "death", "head"] },
  skeleton: { message: "Hidden truths, vulnerability, old structure.", triggers: ["skeleton", "bones", "rattle", "truth"] },
  woman: { message: "Feminine essence, reflection, archetypal anima.", triggers: ["woman", "she", "feminine", "female", "lady"] },
  man: { message: "Masculine presence, archetypal animus.", triggers: ["man", "he", "masculine", "male", "guy"] },
  child: { message: "Innocence, vulnerability, beginning.", triggers: ["child", "young", "baby", "small", "kid"] },
  "twin figures": { message: "Duality, mirror self, choice.", triggers: ["twin", "twins", "double", "duplicate"] },
  "person in costume": { message: "Role-playing, hidden motives, performance self.", triggers: ["costume", "dress-up", "disguise", "play"] },

  // Objects
  lamp: { message: "Guidance, insight, inner light.", triggers: ["lamp", "lantern"] },
  chandelier: { message: "Elegance, radiance, spiritual vision.", triggers: ["chandelier", "crystal", "hang"] },
  fountain: { message: "Flow of emotion, cleansing, abundance.", triggers: ["fountain", "spray", "flow"] },
  ornament: { message: "Adornment, ego, beauty or distraction.", triggers: ["ornament", "decoration", "sparkle", "glitter"] },
  building: { message: "Structure of self, life foundation, stability.", triggers: ["building", "house", "structure", "architecture"] },
  tower: { message: "Ambition, isolation, downfall or elevation.", triggers: ["tower", "high", "fall", "collapse", "tall"] }
};

// Wildcard oracle messages (when no symbol matches)
const wildcardMessages = [
  "You do not see the world as it is. You see the world as you are.",
  "The wound is the place where the light enters you.",
  "All things visible are born from the invisible.",
  "Freedom begins the moment you stop seeking permission.",
  "You are not looking for meaning—you are looking for resonance.",
  "When you stop clinging to identity, the soul begins to speak.",
  "To remember yourself is not to recall a fact, but to return to a frequency.",
  "What you fear most is often the gateway to your freedom.",
  "Even silence has a shape if you're willing to listen.",
  "To transform is to remember your original shape.",
  "Symbols are not answers. They are invitations.",
  "Your longing is holy. Trace it back to its source.",
  "The mystery is not something to be solved, but something to be entered.",
  "There is no mirror more honest than what you project onto the unknown.",
  "The soul does not speak in words—it speaks in symbols, sensations, and sudden knowing.",
  "What you avoid contains the instructions for your becoming.",
  "Awareness does not grow from knowing more, but from noticing more.",
  "Sometimes what you call confusion is simply the mind being humbled by mystery.",
  "If you knew how to interpret your own energy, you would need fewer explanations.",
  "The further you go inward, the less language follows.",
  "The unexamined life is not worth living. — Socrates",
  "He who has a why to live can bear almost any how. — Friedrich Nietzsche",
  "The only thing I know is that I know nothing. — Socrates",
  "Man is condemned to be free. — Jean-Paul Sartre",
  "Happiness depends upon ourselves. — Aristotle",
  "No tree, it is said, can grow to heaven unless its roots reach down to hell. — Carl Jung",
  "To be is to be perceived. — George Berkeley",
  "Knowing others is intelligence; knowing yourself is true wisdom. — Lao Tzu",
  "You must become the change you wish to see in the world. — Mahatma Gandhi",
  "The mind is furnished with ideas by experience alone. — John Locke",
  "The greatest wealth is to live content with little. — Plato",
  "Things are not bad in themselves, but our opinions about things are. — Epictetus",
  "Every man takes the limits of his own field of vision for the limits of the world. — Arthur Schopenhauer",
  "Time is a moving image of eternity. — Plato",
  "We suffer more in imagination than in reality. — Seneca"
];

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

  // Generate main zones with varied sizes (like real Rorschach inkblots)
  let numMainZones = floor(random(2, 4)); // Fewer large zones
  let numSecondaryZones = floor(random(2, 4)); // Medium zones
  let numSatellites = floor(random(8, 15)); // Small satellite splatters

  // MAIN LARGE ZONES (central forms)
  for (let i = 0; i < numMainZones; i++) {
    let zone = {
      centerX: random(-width * 0.08, width * 0.08), // Closer to center
      centerY: random(-height * 0.3, height * 0.3), // Spread vertically
      baseRadius: random(80, 200), // Large
      points: [],
      type: 'main'
    };

    generateBlobShape(zone);
    inkblotData.push(zone);
  }

  // SECONDARY MEDIUM ZONES
  for (let i = 0; i < numSecondaryZones; i++) {
    let zone = {
      centerX: random(-width * 0.2, width * 0.2), // More spread
      centerY: random(-height * 0.35, height * 0.35),
      baseRadius: random(40, 90), // Medium
      points: [],
      type: 'secondary'
    };

    generateBlobShape(zone);
    inkblotData.push(zone);
  }

  // SMALL SATELLITE SPLATTERS (half small, half larger and more irregular)
  for (let i = 0; i < numSatellites; i++) {
    // Half of satellites are larger and more irregular
    let isLargerSatellite = random() > 0.5;

    let zone = {
      centerX: random(-width * 0.25, width * 0.25), // Wide spread
      centerY: random(-height * 0.4, height * 0.4),
      baseRadius: isLargerSatellite ? random(30, 65) : random(8, 30), // Larger or small
      points: [],
      type: isLargerSatellite ? 'satellite_large' : 'satellite'
    };

    generateBlobShape(zone);
    inkblotData.push(zone);
  }

  inkblotGenerated = true;
}

function generateBlobShape(zone) {
  // Generate blob shape with extreme Perlin noise variation for irregular edges
  let numPoints;
  if (zone.type === 'satellite') {
    numPoints = floor(random(6, 12)); // Small satellites
  } else if (zone.type === 'satellite_large') {
    numPoints = floor(random(12, 25)); // More points for larger, more irregular satellites
  } else {
    numPoints = floor(random(20, 40)); // Main and secondary zones
  }

  let noiseOffset = random(1000);

  for (let j = 0; j < numPoints; j++) {
    let angle = map(j, 0, numPoints, 0, TWO_PI);

    // Multi-octave Perlin noise for organic irregularity
    let noiseVal1 = noise(cos(angle) * 2 + noiseOffset, sin(angle) * 2 + noiseOffset);
    let noiseVal2 = noise(cos(angle) * 5 + noiseOffset + 100, sin(angle) * 5 + noiseOffset + 100);
    let noiseVal3 = noise(cos(angle) * 10 + noiseOffset + 200, sin(angle) * 10 + noiseOffset + 200);

    // Combine noise octaves for complex shape with EXTREME variation
    let radiusVariation = noiseVal1 * 0.3 + noiseVal2 * 0.4 + noiseVal3 * 0.3;

    // Create sharp protrusions and deep indentations
    let extremeNoise = noise(j * 0.08 + noiseOffset + 500);
    let radiusMultiplier;

    // Larger satellites get even MORE extreme variation
    if (zone.type === 'satellite_large') {
      if (extremeNoise < 0.25) {
        // Very deep indentation
        radiusMultiplier = 0.15 + radiusVariation * 0.4;
      } else if (extremeNoise > 0.75) {
        // Very sharp protrusion
        radiusMultiplier = 1.1 + radiusVariation * 1.0;
      } else {
        // Normal variation but wider range
        radiusMultiplier = 0.3 + radiusVariation * 1.1;
      }
    } else {
      if (extremeNoise < 0.2) {
        // Deep indentation
        radiusMultiplier = 0.2 + radiusVariation * 0.3;
      } else if (extremeNoise > 0.8) {
        // Sharp protrusion
        radiusMultiplier = 1.0 + radiusVariation * 0.8;
      } else {
        // Normal variation
        radiusMultiplier = 0.4 + radiusVariation * 0.9;
      }
    }

    let radius = zone.baseRadius * radiusMultiplier;

    // Add angular distortion for lobes and organic curves
    // More distortion for larger satellites
    let distortionAmount = zone.type === 'satellite_large' ? 0.8 : 0.6;
    let angleDistortion = noise(j * 0.15 + noiseOffset + 300) * distortionAmount - (distortionAmount / 2);
    let finalAngle = angle + angleDistortion;

    zone.points.push({
      x: cos(finalAngle) * radius,
      y: sin(finalAngle) * radius
    });
  }
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

  let oracleMessage = null;

  // Check for trigger word matches across all symbols
  for (let symbolKey in symbolReadings) {
    let symbol = symbolReadings[symbolKey];

    // Check if any trigger word appears in user input
    for (let trigger of symbol.triggers) {
      if (userInput.includes(trigger.toLowerCase())) {
        oracleMessage = symbol.message;
        break;
      }
    }

    if (oracleMessage) break;
  }

  // If no symbol matched, use a random wildcard message
  if (!oracleMessage) {
    oracleMessage = random(wildcardMessages);
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
