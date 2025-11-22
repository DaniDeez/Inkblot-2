class Blob {
    constructor(x, y, radius, canvas) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.vx = (Math.random() - 0.5) * 2.5;
        this.vy = (Math.random() - 0.5) * 2.5;
        this.canvas = canvas;
        this.phase = Math.random() * Math.PI * 2;
        this.radiusSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges (only on left half since we mirror)
        if (this.x - this.radius < 0 || this.x + this.radius > this.canvas.width / 2) {
            this.vx *= -1;
            this.x = Math.max(this.radius, Math.min(this.canvas.width / 2 - this.radius, this.x));
        }
        if (this.y - this.radius < 0 || this.y + this.radius > this.canvas.height) {
            this.vy *= -1;
            this.y = Math.max(this.radius, Math.min(this.canvas.height - this.radius, this.y));
        }

        // Morph radius for organic movement
        this.phase += this.radiusSpeed;
        this.radius = this.baseRadius + Math.sin(this.phase) * (this.baseRadius * 0.3);
    }
}

class InkblotAnimation {
    constructor() {
        this.canvas = document.getElementById('inkblotCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.blobs = [];
        this.isAnimating = true;
        this.animationFrame = null;

        this.setupCanvas();
        this.createBlobs();
        this.setupEventListeners();
        this.animate();
    }

    setupCanvas() {
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
    }

    createBlobs() {
        this.blobs = [];
        const numBlobs = 18 + Math.floor(Math.random() * 8);

        for (let i = 0; i < numBlobs; i++) {
            const radius = 25 + Math.random() * 20;
            const x = radius + Math.random() * (this.canvas.width / 2 - radius * 2);
            const y = radius + Math.random() * (this.canvas.height - radius * 2);
            this.blobs.push(new Blob(x, y, radius, this.canvas));
        }
    }

    setupEventListeners() {
        // Click to freeze/unfreeze
        this.canvas.addEventListener('click', () => {
            this.isAnimating = !this.isAnimating;
            const inputSection = document.getElementById('inputSection');

            if (!this.isAnimating) {
                inputSection.classList.remove('hidden');
                document.getElementById('userInput').focus();
            } else {
                inputSection.classList.add('hidden');
                document.getElementById('userInput').value = '';
            }

            if (this.isAnimating) {
                this.animate();
            }
        });

        // New Inkblot button
        document.getElementById('newInkblot').addEventListener('click', () => {
            this.reset();
        });
    }

    reset() {
        this.isAnimating = true;
        document.getElementById('inputSection').classList.add('hidden');
        document.getElementById('userInput').value = '';
        this.createBlobs();
        if (!this.animationFrame) {
            this.animate();
        }
    }

    drawMetaballs() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;

        // Only process left half, we'll mirror it
        for (let x = 0; x < this.canvas.width / 2; x++) {
            for (let y = 0; y < this.canvas.height; y++) {
                let sum = 0;

                // Calculate metaball field
                for (const blob of this.blobs) {
                    const dx = x - blob.x;
                    const dy = y - blob.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < blob.radius * 3) {
                        sum += (blob.radius * blob.radius) / (dist * dist + 1);
                    }
                }

                // Threshold for metaball effect
                const threshold = 2.2;
                const index = (y * this.canvas.width + x) * 4;
                const mirrorIndex = (y * this.canvas.width + (this.canvas.width - 1 - x)) * 4;

                if (sum > threshold) {
                    // Black inkblot
                    data[index] = 0;
                    data[index + 1] = 0;
                    data[index + 2] = 0;
                    data[index + 3] = 255;

                    // Mirror to right side
                    data[mirrorIndex] = 0;
                    data[mirrorIndex + 1] = 0;
                    data[mirrorIndex + 2] = 0;
                    data[mirrorIndex + 3] = 255;
                } else {
                    // White background
                    data[index] = 255;
                    data[index + 1] = 255;
                    data[index + 2] = 255;
                    data[index + 3] = 255;

                    // Mirror to right side
                    data[mirrorIndex] = 255;
                    data[mirrorIndex + 1] = 255;
                    data[mirrorIndex + 2] = 255;
                    data[mirrorIndex + 3] = 255;
                }
            }
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    animate() {
        if (!this.isAnimating) {
            this.animationFrame = null;
            return;
        }

        // Update blob positions
        for (const blob of this.blobs) {
            blob.update();
        }

        // Draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawMetaballs();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InkblotAnimation();
});
