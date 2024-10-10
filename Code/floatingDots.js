// Set variables
const show = 250;
const maxLinesPerDot = 3; // Maximum lines a dot can form
const canvas = document.getElementById("floatingDotsCanvas");
const scene = canvas.getContext("2d");
let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);
const mouse = { x: null, y: null };  // Track mouse position
const mouseRadius = 80;  // Radius around the mouse to connect dots

// Track mouse position
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Create dot
class Dot {
  constructor() {
    const angle = Math.floor(Math.random() * 360);

    this.size = 1.2;
    this.dx = Math.cos(angle) * 0.3;
    this.dy = Math.sin(angle) * 0.3;
    this.px = Math.random() * width;
    this.py = Math.random() * height;
  }

  // Update dot position and draw
  update() {
    this.bounds();

    this.px += this.dx;
    this.py += this.dy;

    this.draw();
  }

  // Draw the dots then connect them
  draw() {
    scene.beginPath();
    scene.arc(this.px, this.py, this.size, 0, Math.PI * 2);
    scene.closePath();
    scene.fillStyle = "rgba(168, 255, 214, 1)";
    scene.fill();

    this.connect();
  }

  // Connect the nearby dots only when within the mouse radius
  connect() {
    const nearby = (width + height) * 0.1;
    let linesDrawn = 0;  // Track number of lines drawn for this dot

    // Check if this dot is within the mouse radius
    const mouseDistance = this.distance({ px: mouse.x, py: mouse.y });
    if (mouseDistance > mouseRadius) return;  // Don't connect if outside the radius

    dots.forEach(dot => {
      const distance = this.distance(dot);

      if (distance > nearby || linesDrawn >= maxLinesPerDot) return;  // Stop if max lines reached

      const opacity = 1 - distance / nearby - 0.2;

      scene.beginPath();
      scene.lineWidth = 1;
      scene.strokeStyle = `rgba(168, 255, 214, ${opacity})`;
      scene.moveTo(this.px, this.py);
      scene.lineTo(dot.px, dot.py);
      scene.stroke();

      linesDrawn++;  // Increment line count after drawing
    });
  }

  // Check if we've hit a wall and invert the direction
  bounds() {
    if (this.px < 0 || this.px > width) this.dx *= -1;

    if (this.py < 0 || this.py > height) this.dy *= -1;
  }

  // Calculate the distance between this dot and that dot
  distance(dot) {
    const distX = this.px - dot.px;
    const distY = this.py - dot.py;

    return Math.sqrt(distX * distX + distY * distY);
  }
}

// Create dots
const dots = [...Array(show).fill().map(() => new Dot())];

// Draw scene
function draw() {
  scene.clearRect(0, 0, width, height);

  // Update all dots and redraw
  dots.forEach(particle => {
    particle.update();
  });

  requestAnimationFrame(draw);
}

draw();

// Resize canvas
window.addEventListener("resize", () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});