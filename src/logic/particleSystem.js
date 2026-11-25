/**
 * Interactive Silver Butterfly & Sparkle Particle System
 * Renders fluttering silver butterflies on HTML5 canvas with wing-flapping physics
 * and interactive cursor/touch avoidance ("Yet the Butterflies Flutter Away").
 */

export class ButterflyParticleSystem {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.butterflies = [];
    this.sparkles = [];
    this.maxButterflies = 18;
    this.maxSparkles = 35;
    this.pointer = { x: -1000, y: -1000, isHovering: false };
    this.isRunning = false;
    this.animationFrameId = null;

    this._initResize();
    this._initEvents();
    this._spawnInitial();
  }

  _initResize() {
    this.resize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  _initEvents() {
    const updatePointer = (x, y) => {
      this.pointer.x = x;
      this.pointer.y = y;
      this.pointer.isHovering = true;
    };

    window.addEventListener('mousemove', (e) => updatePointer(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        updatePointer(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    window.addEventListener('mouseleave', () => {
      this.pointer.isHovering = false;
      this.pointer.x = -1000;
      this.pointer.y = -1000;
    });
  }

  _spawnInitial() {
    for (let i = 0; i < this.maxButterflies; i++) {
      this.butterflies.push(this._createButterfly(Math.random() * this.canvas.width, Math.random() * this.canvas.height));
    }
    for (let i = 0; i < this.maxSparkles; i++) {
      this.sparkles.push(this._createSparkle());
    }
  }

  _createButterfly(x, y) {
    return {
      x: x !== undefined ? x : (Math.random() > 0.5 ? -30 : this.canvas.width + 30),
      y: y !== undefined ? y : Math.random() * this.canvas.height,
      vx: (Math.random() - 0.45) * 1.4,
      vy: (Math.random() - 0.5) * 1.0,
      size: 5 + Math.random() * 6,
      flapSpeed: 0.15 + Math.random() * 0.12,
      flapAngle: Math.random() * Math.PI * 2,
      baseAlpha: 0.4 + Math.random() * 0.5,
      hueOffset: Math.random() * 20 - 10, // subtle silver-blue shimmer
      turnCounter: Math.floor(Math.random() * 80)
    };
  }

  _createSparkle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      radius: 0.8 + Math.random() * 1.8,
      alpha: Math.random() * 0.7,
      dAlpha: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      vy: -(0.2 + Math.random() * 0.5)
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const loop = () => {
      if (!this.isRunning) return;
      this._update();
      this._draw();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  _update() {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Update Sparkles
    for (let i = 0; i < this.sparkles.length; i++) {
      const sp = this.sparkles[i];
      sp.y += sp.vy;
      sp.alpha += sp.dAlpha;
      if (sp.alpha <= 0.05 || sp.alpha >= 0.85) sp.dAlpha = -sp.dAlpha;

      if (sp.y < -10) {
        this.sparkles[i] = this._createSparkle();
        this.sparkles[i].y = height + 10;
      }
    }

    // Update Butterflies
    for (let i = 0; i < this.butterflies.length; i++) {
      const b = this.butterflies[i];
      b.flapAngle += b.flapSpeed;

      // Natural gentle wandering
      b.turnCounter--;
      if (b.turnCounter <= 0) {
        b.vx += (Math.random() - 0.5) * 0.6;
        b.vy += (Math.random() - 0.5) * 0.6;
        // Limit velocity
        const speed = Math.hypot(b.vx, b.vy);
        if (speed > 2.2) {
          b.vx = (b.vx / speed) * 2.2;
          b.vy = (b.vy / speed) * 2.2;
        }
        b.turnCounter = 60 + Math.floor(Math.random() * 60);
      }

      // INTERACTION: Flutter away from cursor when near!
      if (this.pointer.isHovering) {
        const dx = b.x - this.pointer.x;
        const dy = b.y - this.pointer.y;
        const dist = Math.hypot(dx, dy);
        const repelRadius = 110;

        if (dist < repelRadius && dist > 1) {
          const force = (repelRadius - dist) / repelRadius;
          b.vx += (dx / dist) * force * 1.8;
          b.vy += (dy / dist) * force * 1.8;
          b.flapSpeed = 0.32; // flap wings rapidly when startled!
        } else if (b.flapSpeed > 0.2) {
          b.flapSpeed *= 0.98; // calm down gradually
        }
      }

      b.x += b.vx;
      b.y += b.vy;

      // Wrap around edges
      if (b.x < -40) b.x = width + 30;
      else if (b.x > width + 40) b.x = -30;
      if (b.y < -40) b.y = height + 30;
      else if (b.y > height + 40) b.y = -30;
    }
  }

  _draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw glowing silver sparkles
    for (const sp of this.sparkles) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(226, 232, 240, ${sp.alpha})`;
      this.ctx.shadowColor = 'rgba(192, 132, 252, 0.6)';
      this.ctx.shadowBlur = 6;
      this.ctx.fill();
      this.ctx.restore();
    }

    // 2. Draw Silver Butterflies
    for (const b of this.butterflies) {
      this.ctx.save();
      this.ctx.translate(b.x, b.y);

      // Orientation angle along velocity
      const angle = Math.atan2(b.vy, b.vx);
      this.ctx.rotate(angle);

      // Wing flap modulation via sine wave
      const wingScale = Math.sin(b.flapAngle);

      this.ctx.fillStyle = `rgba(241, 245, 249, ${b.baseAlpha})`;
      this.ctx.shadowColor = `rgba(186, 230, 253, 0.8)`;
      this.ctx.shadowBlur = 8;

      // Draw Left Wing
      this.ctx.beginPath();
      this.ctx.ellipse(0, -b.size * 0.7 * wingScale, b.size * 0.9, b.size * 0.6 * Math.abs(wingScale) + 0.5, -Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw Right Wing
      this.ctx.beginPath();
      this.ctx.ellipse(0, b.size * 0.7 * wingScale, b.size * 0.9, b.size * 0.6 * Math.abs(wingScale) + 0.5, Math.PI / 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Slender Butterfly Body
      this.ctx.fillStyle = `rgba(148, 163, 184, ${b.baseAlpha + 0.2})`;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, b.size * 0.6, b.size * 0.15, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }
  }
}

export default ButterflyParticleSystem;
