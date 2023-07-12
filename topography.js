// Configuration
const canvasId = 'topography';
const noiseScale = 300;   // Adjust this to change noise granularity
const heightmapSize = 2000;   // Size of the heightmap
const lineColor = 'white';   // Color of the topographic lines
const scaleFactor = 50;   // Adjust this to change the frequency of topographic lines
const lineInterval = 10;   // Interval for the topographic lines

// Get canvas and context
const canvas = document.getElementById(canvasId);
canvas.width = window.innerWidth * 5;
canvas.height = window.innerHeight * 5;
const ctx = canvas.getContext('2d');

// Set background properties
document.body.style.backgroundSize = 'cover';
document.body.style.backgroundPosition = 'center';

// Generate heightmap with Simplex noise
const simplex = new SimplexNoise();
const heightmap = new Array(heightmapSize);
for(let i = 0; i < heightmapSize; i++) {
    heightmap[i] = new Array(heightmapSize);
    for(let j = 0; j < heightmapSize; j++) {
        let value = (simplex.noise2D(i / noiseScale, j / noiseScale) + 1) / 2;
        heightmap[i][j] = value;
    }
}

// Draw topographic lines
ctx.strokeStyle = lineColor;
for(let i = 0; i < heightmapSize; i++) {
    for(let j = 0; j < heightmapSize; j++) {
        let value = heightmap[i][j] * scaleFactor;
        if (Math.floor(value) % lineInterval === 0) {
            ctx.beginPath();
            ctx.moveTo(j, i);
            ctx.lineTo(j+1, i);
            ctx.stroke();
        }
    }
}

let dataUrl = canvas.toDataURL();

// Get the background div and set the topography as its background
const backgroundDiv = document.getElementById('background');
backgroundDiv.style.backgroundImage = `url(${dataUrl})`;

// Fade in the background div once the topography is ready
backgroundDiv.style.opacity = '0.05';