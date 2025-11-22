// The Void Mirror - Inkblot Oracle Simulator
// "Ink as shadow, silence, and unseen truth."

class InkblotOracle {
    constructor() {
        this.canvas = document.getElementById('inkblotCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.starsCanvas = document.getElementById('starsCanvas');
        this.starsCtx = this.starsCanvas.getContext('2d');

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // State
        this.frozen = false;
        this.frozenImageData = null;
        this.time = 0;
        this.animationId = null;

        // Inkblot properties
        this.blobs = [];
        this.blobCount = 8; // Multiple distinct shapes
        this.stars = [];
        this.starCount = 15;

        // Initialize
        this.initializeBlobs();
        this.initializeStars();
        this.setupEventListeners();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.starsCanvas.width = window.innerWidth;
        this.starsCanvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    initializeBlobs() {
        this.blobs = [];
        for (let i = 0; i < this.blobCount; i++) {
            this.blobs.push({
                x: Math.random() * 200 - 100,
                y: Math.random() * 400 - 200,
                baseX: Math.random() * 200 - 100,
                baseY: Math.random() * 400 - 200,
                radius: 40 + Math.random() * 80,
                speed: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                noiseOffsetX: Math.random() * 1000,
                noiseOffsetY: Math.random() * 1000,
                tendrilCount: Math.floor(Math.random() * 3) + 2,
                tendrils: []
            });

            // Add tendrils to each blob
            const blob = this.blobs[this.blobs.length - 1];
            for (let t = 0; t < blob.tendrilCount; t++) {
                blob.tendrils.push({
                    angle: (Math.PI * 2 / blob.tendrilCount) * t,
                    length: 40 + Math.random() * 60,
                    width: 10 + Math.random() * 20,
                    phase: Math.random() * Math.PI * 2
                });
            }
        }
    }

    initializeStars() {
        this.stars = [];
        for (let i = 0; i < this.starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: 1 + Math.random() * 2,
                opacity: 0,
                phase: Math.random() * Math.PI * 2,
                speed: 0.3 + Math.random() * 0.5
            });
        }
    }

    // Perlin-like noise function for organic movement
    noise(x, y) {
        const n = Math.sin(x * 0.1) * Math.cos(y * 0.1) +
                  Math.sin(x * 0.05 + y * 0.05) * 0.5;
        return n;
    }

    updateBlobs() {
        this.time += 0.01;

        this.blobs.forEach(blob => {
            // Organic lava-lamp movement using noise
            const noiseX = this.noise(blob.noiseOffsetX + this.time * blob.speed, this.time);
            const noiseY = this.noise(blob.noiseOffsetY + this.time * blob.speed, this.time);

            blob.x = blob.baseX + noiseX * 150;
            blob.y = blob.baseY + noiseY * 150;

            // Pulsing radius
            blob.currentRadius = blob.radius + Math.sin(this.time * 2 + blob.phase) * 15;

            // Update tendrils
            blob.tendrils.forEach(tendril => {
                tendril.currentLength = tendril.length +
                    Math.sin(this.time * 1.5 + tendril.phase) * 20;
                tendril.currentWidth = tendril.width +
                    Math.cos(this.time * 2 + tendril.phase) * 5;
            });
        });
    }

    drawSymmetricalBlob(blob, offsetX, offsetY) {
        const ctx = this.ctx;

        // Main blob circle
        ctx.beginPath();
        ctx.arc(
            this.centerX + offsetX + blob.x,
            this.centerY + offsetY + blob.y,
            blob.currentRadius,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Draw tendrils
        blob.tendrils.forEach(tendril => {
            const angle = tendril.angle + Math.sin(this.time + tendril.phase) * 0.3;
            const endX = this.centerX + offsetX + blob.x +
                Math.cos(angle) * tendril.currentLength;
            const endY = this.centerY + offsetY + blob.y +
                Math.sin(angle) * tendril.currentLength;

            ctx.beginPath();
            ctx.moveTo(
                this.centerX + offsetX + blob.x,
                this.centerY + offsetY + blob.y
            );

            // Bezier curve for organic tendril
            const ctrlX = this.centerX + offsetX + blob.x +
                Math.cos(angle) * (tendril.currentLength * 0.5);
            const ctrlY = this.centerY + offsetY + blob.y +
                Math.sin(angle) * (tendril.currentLength * 0.5);

            ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
            ctx.lineWidth = tendril.currentWidth;
            ctx.lineCap = 'round';
            ctx.stroke();
        });
    }

    drawInkblot() {
        const ctx = this.ctx;

        // Clear canvas with parchment background
        ctx.fillStyle = '#f7f1e1';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Add subtle sepia texture
        this.addSepiaTexture();

        // Set ink color - pure black
        ctx.fillStyle = '#0a0a0a';
        ctx.strokeStyle = '#0a0a0a';

        // Draw blobs with perfect symmetry
        this.blobs.forEach(blob => {
            // Left side
            this.drawSymmetricalBlob(blob, -100, 0);
            // Right side (mirrored)
            ctx.save();
            ctx.scale(-1, 1);
            this.drawSymmetricalBlob(blob, 100, 0);
            ctx.restore();
        });

        // Add connecting areas between blobs for classic Rorschach effect
        this.drawConnections();
    }

    drawConnections() {
        const ctx = this.ctx;
        ctx.fillStyle = '#0a0a0a';

        // Create organic connections between nearby blobs
        for (let i = 0; i < this.blobs.length; i++) {
            for (let j = i + 1; j < this.blobs.length; j++) {
                const b1 = this.blobs[i];
                const b2 = this.blobs[j];
                const dx = b1.x - b2.x;
                const dy = b1.y - b2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const strength = 1 - (dist / 200);
                    const width = strength * 40;

                    // Left side
                    ctx.beginPath();
                    ctx.moveTo(this.centerX - 100 + b1.x, this.centerY + b1.y);
                    ctx.lineTo(this.centerX - 100 + b2.x, this.centerY + b2.y);
                    ctx.lineWidth = width;
                    ctx.lineCap = 'round';
                    ctx.stroke();

                    // Right side (mirrored)
                    ctx.beginPath();
                    ctx.moveTo(this.centerX + 100 - b1.x, this.centerY + b1.y);
                    ctx.lineTo(this.centerX + 100 - b2.x, this.centerY + b2.y);
                    ctx.stroke();
                }
            }
        }
    }

    addSepiaTexture() {
        const ctx = this.ctx;
        const imageData = ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() > 0.98) {
                const sepia = 220 + Math.random() * 20;
                data[i] = sepia;     // R
                data[i + 1] = sepia - 20; // G
                data[i + 2] = sepia - 40; // B
                data[i + 3] = 20;    // A
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    updateStars() {
        this.stars.forEach(star => {
            star.phase += star.speed * 0.05;

            // Gentle fade in and out
            const fadePattern = Math.sin(star.phase);
            star.opacity = fadePattern > 0.7 ? (fadePattern - 0.7) * 3 : 0;

            // Drift slowly
            star.x += Math.cos(star.phase) * 0.3;
            star.y += Math.sin(star.phase) * 0.3;

            // Keep stars near edges
            if (star.x < 0 || star.x > this.canvas.width ||
                star.y < 0 || star.y > this.canvas.height) {
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
            }
        });
    }

    drawStars() {
        const ctx = this.starsCtx;
        ctx.clearRect(0, 0, this.starsCanvas.width, this.starsCanvas.height);

        this.stars.forEach(star => {
            if (star.opacity > 0) {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);

                const gradient = ctx.createRadialGradient(
                    star.x, star.y, 0,
                    star.x, star.y, star.radius * 3
                );
                gradient.addColorStop(0, `rgba(247, 241, 225, ${star.opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(247, 241, 225, 0)`);

                ctx.fillStyle = gradient;
                ctx.fill();
            }
        });
    }

    animate() {
        if (this.frozen) return;

        this.updateBlobs();
        this.drawInkblot();

        this.updateStars();
        this.drawStars();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    freezeInkblot() {
        this.frozen = true;
        this.frozenImageData = this.ctx.getImageData(
            0, 0, this.canvas.width, this.canvas.height
        );

        // Show oracle prompt
        document.getElementById('oraclePrompt').classList.remove('hidden');
        document.getElementById('visionInput').focus();
    }

    unfreezeInkblot() {
        this.frozen = false;
        document.getElementById('oraclePrompt').classList.add('hidden');
        document.getElementById('oracleReading').classList.add('hidden');
        this.animate();
    }

    generateNewInkblot() {
        this.frozen = false;
        document.getElementById('oraclePrompt').classList.add('hidden');
        document.getElementById('oracleReading').classList.add('hidden');

        cancelAnimationFrame(this.animationId);
        this.initializeBlobs();
        this.initializeStars();
        this.time = 0;
        this.animate();
    }

    analyzeColors() {
        if (!this.frozenImageData) return null;

        const data = this.frozenImageData.data;
        let totalR = 0, totalG = 0, totalB = 0, pixelCount = 0;

        // Sample pixels to find dominant non-background colors
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Skip parchment background
            if (r > 200 && g > 200 && b > 200) continue;

            totalR += r;
            totalG += g;
            totalB += b;
            pixelCount++;
        }

        if (pixelCount === 0) return null;

        const avgR = totalR / pixelCount;
        const avgG = totalG / pixelCount;
        const avgB = totalB / pixelCount;

        return this.getColorMeaning(avgR, avgG, avgB);
    }

    getColorMeaning(r, g, b) {
        // Pure black dominant (which it should be for our design)
        if (r < 50 && g < 50 && b < 50) {
            return {
                color: 'Deep Shadow',
                meaning: 'The unconscious speaks through absence and depth. You are exploring hidden territories of the self, drawn to mystery and transformation. This is the void from which all creation emerges—a space of infinite potential and ancestral wisdom.'
            };
        }

        // Fallback for variations
        return {
            color: 'Ancestral Ink',
            meaning: 'You have touched the liminal space between light and shadow. This represents a journey inward, a mirror reflecting the unseen patterns of your inner world. Trust what emerges from the silence.'
        };
    }

    getSymbolicMeaning(word) {
        const oracle = {
            // Animals & Creatures
            'butterfly': 'Transformation and rebirth. You are in metamorphosis, shedding old forms to embrace new wings.',
            'bird': 'Freedom and transcendence. Your spirit seeks to rise above earthly concerns into higher perspective.',
            'dragon': 'Primal power and ancient wisdom. You carry the fire of transformation and guardian strength.',
            'snake': 'Healing and renewal. The serpent sheds its skin—what are you ready to release?',
            'wolf': 'Instinct and loyalty. Your wild nature calls you to trust your inner compass and pack bonds.',
            'bat': 'Initiation and rebirth. Navigate the darkness with echolocation of the soul.',
            'spider': 'Creativity and fate-weaving. You are spinning your own destiny with patient artistry.',
            'owl': 'Wisdom through darkness. What truth can only be seen when the light fades?',
            'moth': 'Attraction to the ineffable. You are drawn toward light even through the unknown.',
            'crow': 'Magic and messages. The veil is thin; pay attention to omens and synchronicity.',

            // Human Forms
            'face': 'The mirror of self. Which aspect of your identity gazes back at you?',
            'eyes': 'Perception and witness. You are seeing or being seen in a new way.',
            'hands': 'Action and creation. What will you grasp, build, or release?',
            'figure': 'The shadow self or guide. An aspect of your psyche seeks acknowledgment.',
            'angel': 'Divine protection and higher guidance. You are being watched over and supported.',
            'demon': 'Rejected aspects seeking integration. What you fear is asking to be understood.',
            'skeleton': 'The essential self beneath masks. Truth stripped of pretense.',

            // Natural Forms
            'tree': 'Rootedness and growth. You are connecting earth and sky, past and future.',
            'mountain': 'Endurance and perspective. Challenges that elevate you.',
            'water': 'Emotion and flow. Let yourself move with the current of feeling.',
            'fire': 'Passion and purification. What needs to burn away to make space for new life?',
            'cloud': 'Transition and dreams. Reality is more fluid than it appears.',
            'flower': 'Beauty unfolding. You are blossoming in your own time.',
            'root': 'Hidden foundation. What lies beneath supports all you see above.',

            // Abstract Concepts
            'mirror': 'Reflection and truth. Reality bends to show you what you need to see.',
            'door': 'Threshold and opportunity. A passage awaits—will you cross it?',
            'key': 'Solution and access. You already hold what you seek.',
            'mask': 'Persona and protection. What face do you show the world, and why?',
            'crown': 'Sovereignty and recognition. Step into your own authority.',
            'heart': 'Love and vulnerability. The center of your emotional truth.',
            'void': 'Emptiness that is fullness. In nothing, everything is possible.',
            'spiral': 'Journey inward and outward. Cycles of return and expansion.',
            'labyrinth': 'The sacred path. Trust the winding way; it leads to center.',

            // Emotional States
            'darkness': 'The unknown that teaches. What can only grow in shadow?',
            'light': 'Illumination and clarity. Truth is being revealed.',
            'shadow': 'The unlived life and hidden self. Integration beckons.',
            'chaos': 'Creative potential before form. Embrace the fertile void.',
            'balance': 'Harmony between opposites. You are finding your center.',

            // Mythical & Symbolic
            'wings': 'Aspiration and elevation. Your soul remembers flight.',
            'moon': 'Cycles and intuition. Honor the waxing and waning within you.',
            'sun': 'Vitality and consciousness. You are the source of your own light.',
            'star': 'Guidance and hope. Even in darkness, you are oriented toward truth.',
            'path': 'Journey and purpose. Each step is both destination and beginning.',
            'portal': 'Gateway between worlds. You stand at the threshold of change.',
            'symbol': 'Sacred sign. Your unconscious is speaking in the language of myth.',
            'mandala': 'Wholeness and integration. All parts of you seek unity.',

            // Default
            'default': 'Your vision is unique and personal. The symbol you perceive holds meaning only you can fully know. Trust your intuition—the unconscious speaks in a language beyond words, and you are its translator.'
        };

        // Normalize input
        const normalized = word.toLowerCase().trim();

        // Direct match
        if (oracle[normalized]) {
            return oracle[normalized];
        }

        // Partial match
        for (let key in oracle) {
            if (normalized.includes(key) || key.includes(normalized)) {
                return oracle[key];
            }
        }

        // No match - return personalized default
        return `"${word}" — This symbol emerges from your unique unconscious landscape. ${oracle.default}`;
    }

    revealReading(vision) {
        const colorReading = this.analyzeColors();
        const symbolicReading = this.getSymbolicMeaning(vision);

        document.getElementById('colorReading').innerHTML = `
            <strong>${colorReading.color}</strong><br>
            ${colorReading.meaning}
        `;

        document.getElementById('symbolicReading').innerHTML = symbolicReading;

        // Hide prompt, show reading
        document.getElementById('oraclePrompt').classList.add('hidden');
        document.getElementById('oracleReading').classList.remove('hidden');
    }

    setupEventListeners() {
        // Click canvas to freeze
        this.canvas.addEventListener('click', () => {
            if (!this.frozen) {
                this.freezeInkblot();
            }
        });

        // New inkblot button
        document.getElementById('newInkblotBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.generateNewInkblot();
        });

        // Submit vision
        document.getElementById('submitVision').addEventListener('click', () => {
            const vision = document.getElementById('visionInput').value.trim();
            if (vision) {
                this.revealReading(vision);
            }
        });

        // Enter key to submit
        document.getElementById('visionInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const vision = e.target.value.trim();
                if (vision) {
                    this.revealReading(vision);
                }
            }
        });

        // Close reading
        document.getElementById('closeReading').addEventListener('click', () => {
            document.getElementById('oracleReading').classList.add('hidden');
        });

        // Continue exploring
        document.getElementById('continueBtn').addEventListener('click', () => {
            document.getElementById('visionInput').value = '';
            this.generateNewInkblot();
        });
    }
}

// Initialize the oracle when page loads
window.addEventListener('DOMContentLoaded', () => {
    new InkblotOracle();
});
