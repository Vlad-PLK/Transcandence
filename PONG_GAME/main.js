// Import Three.js
import * as THREE from "./node_modules/three/src/Three.js";
import { Vector, vectorize, normalizeVector, vecAdd, vecSubtract, dot, crossProduct, scalarProduct, reflectVector } from './vector_utils.js';

// Create a scene
const scene = new THREE.Scene();
const textureLoaderScene = new THREE.TextureLoader().load('./space.jpg');
scene.background = textureLoaderScene;

// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(
    90, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);

// Position the camera to look over the Pong game
camera.position.set(0, 40, -70); // Adjust these values as needed
let cameraPosition = 0;
camera.lookAt(0, 0, 0); // Look at the center of the scene

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Add ambient light (provides a base level of light to the scene)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Color, intensity
scene.add(ambientLight);

// Add directional light for shadow casting
const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Color, intensity
directionalLight.position.set(10, 50, 50); // Position the light
directionalLight.castShadow = true; // Enable shadow casting

// Configure shadow properties
directionalLight.shadow.mapSize.width = 2048; // Shadow map width
directionalLight.shadow.mapSize.height = 2048; // Shadow map height
directionalLight.shadow.camera.near = 0.5; // Adjust near plane
directionalLight.shadow.camera.far = 200; // Adjust far plane
directionalLight.shadow.camera.left = -100; // Adjust left plane
directionalLight.shadow.camera.right = 100; // Adjust right plane
directionalLight.shadow.camera.top = 100; // Adjust top plane
directionalLight.shadow.camera.bottom = -100; // Adjust bottom plane

const orbitRadius = 50;
const orbitSpeed = 0.01;
const fullIntensity = 2; // Maximum intensity of the light

let angleLight = 0; // Initial angle for orbit
let intensityPhase = 0; // Phase of intensity cycle

scene.add(directionalLight);

// Create a plane on the X and Y axis
const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
const planeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}); // Green color, double-sided
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
plane.receiveShadow = true;
scene.add(plane);

// Add walls around the plane
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Gray color

// Left wall
const leftWallGeometry = new THREE.BoxGeometry(1, 10, planeGeometry.parameters.height);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.position.x = -planeGeometry.parameters.width / 2 - 0.5;
leftWall.position.y = 5;
leftWall.castShadow = true;
scene.add(leftWall);

// Right wall
const rightWallGeometry = new THREE.BoxGeometry(1, 10, planeGeometry.parameters.height);
const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
rightWall.position.x = planeGeometry.parameters.width / 2 + 0.5;
rightWall.position.y = 5;
rightWall.castShadow = true;
scene.add(rightWall);

// Top wall
const topWallMaterial = new THREE.MeshStandardMaterial
({
    color: 0xFF0000,
    transparent: true,
    opacity: 0.4 // Adjust the opacity value (0.0 to 1.0)
});
const downWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 10, 1);
const downWall = new THREE.Mesh(downWallGeometry, topWallMaterial);
downWall.position.z = -planeGeometry.parameters.height / 2 - 0.5;
downWall.position.y = 5;
downWall.castShadow = true;
scene.add(downWall);

// Bottom wall
const bottomWallMaterial = new THREE.MeshStandardMaterial
({
    color: 0xFF0000,
    transparent: true,
    opacity: 0.4 // Adjust the opacity value (0.0 to 1.0)
});
const topWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 10, 1);
const topWall = new THREE.Mesh(topWallGeometry, bottomWallMaterial);
topWall.position.z = planeGeometry.parameters.height / 2 + 0.5;
topWall.position.y = 5;
topWall.castShadow = true;
scene.add(topWall);

// Create a material for the paddles
const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0xFF00FF }); // Blue color

// Paddle dimensions
const paddleWidth = 12;
const paddleHeight = 2;
const paddleDepth = 1;

// Bottom paddle
const bottomPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
const bottomPaddle = new THREE.Mesh(bottomPaddleGeometry, paddleMaterial);
bottomPaddle.position.z = -planeGeometry.parameters.height / 2 + paddleDepth / 2; // Position along the Z-axis
bottomPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y-axis
bottomPaddle.castShadow = true;
scene.add(bottomPaddle);

// Top paddle
const topPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
const topPaddle = new THREE.Mesh(topPaddleGeometry, paddleMaterial);
topPaddle.position.z = planeGeometry.parameters.height / 2 - paddleDepth / 2; // Position along the Z-axis
topPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y-axis
topPaddle.castShadow = true;
scene.add(topPaddle);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(2, 32, 32); // Radius, width segments, height segments
const textureLoaderSphere = new THREE.TextureLoader().load('./texture1.jpg');
const sphereMaterial = new THREE.MeshStandardMaterial({map:textureLoaderSphere}); // Red color
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.y = sphereGeometry.parameters.radius; // Position the sphere above the plane
sphere.castShadow = true; 
scene.add(sphere);

function sphereRotation()
{
    // Calculate the distance traveled in this frame
    const distance = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z);

    // Calculate the rotation angle based on the distance traveled
    const rotationAngle = distance / sphereGeometry.parameters.radius;

    // Calculate rotation axis (perpendicular to the direction of velocity)
    const rotationAxis = new THREE.Vector3(velocity.z, 0, -velocity.x).normalize();

    // Apply rotation to the sphere
    sphere.rotateOnAxis(rotationAxis, rotationAngle);
}

let velocity = vectorize(0, 0, 0);
setTimeout(() => {velocity = vectorize(0.5, 0, 1);}, 3000);
// Scoring variables
let player1Score = 0;
let player2Score = 0;

// Create HTML elements to display scores
const player1ScoreElement = document.createElement('div');
player1ScoreElement.style.position = 'absolute';
player1ScoreElement.style.top = '10px';
player1ScoreElement.style.left = '10px';
player1ScoreElement.style.fontSize = '24px';
player1ScoreElement.style.color = 'white';
player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
document.body.appendChild(player1ScoreElement);

const player2ScoreElement = document.createElement('div');
player2ScoreElement.style.position = 'absolute';
player2ScoreElement.style.top = '10px';
player2ScoreElement.style.right = '10px';
player2ScoreElement.style.fontSize = '24px';
player2ScoreElement.style.color = 'white';
player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
document.body.appendChild(player2ScoreElement);

function resetBall()
{
    // Reset ball position to the center of the plane with no speed
    velocity = vectorize(0, 0, 0);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);

    // Delay changing the velocity by 3 seconds
    setTimeout(() =>
    {
        // Generate a random angle between π/4 and 3π/4, or between 5π/4 and 7π/4
        let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
        velocity.x = Math.cos(randomAngle);
        velocity.z = Math.sin(randomAngle);
    }, 3000);
}



function checkCollision()
{
    
    // Walls collision
    if (sphere.position.x + sphereGeometry.parameters.radius >= planeGeometry.parameters.width / 2 || sphere.position.x - sphereGeometry.parameters.radius <= -planeGeometry.parameters.width / 2)
    {
        // Collision with vertical walls
        const normal = vectorize(Math.sign(sphere.position.x), 0, 0); // Normal vector of the vertical wall
        velocity = reflectVector(velocity, normal);
    }
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2)
    {
        // Collision with horizontal walls
        player1Score += 1;
        player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetBall();
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2)
    {
        player2Score += 1;
        player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
        resetBall();
    }

    // Paddles collision
    // Collision with bottom paddle
    if (sphere.position.z - sphereGeometry.parameters.radius <= bottomPaddle.position.z + paddleDepth / 2 &&
        sphere.position.x >= bottomPaddle.position.x - paddleWidth / 2 &&
        sphere.position.x <= bottomPaddle.position.x + paddleWidth / 2)
    {
        const normal = vectorize(0, 0, 1);
        velocity = reflectVector(velocity, normal);
    }

    // Collision with top paddle
    if (sphere.position.z + sphereGeometry.parameters.radius >= topPaddle.position.z - paddleDepth / 2 &&
        sphere.position.x >= topPaddle.position.x - paddleWidth / 2 &&
        sphere.position.x <= topPaddle.position.x + paddleWidth / 2)
    {
        const normal = vectorize(0, 0, -1);
        velocity = reflectVector(velocity, normal);
    }
}

// Keyboard controls
const keyboardState = {};

document.addEventListener('keydown', (event) => {
    keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.key] = false;
});

let bottomPaddleRight = false;
let bottomPaddleLeft = false;
let topPaddleRight = false;
let topPaddleLeft = false;
let cameraKeyIsPressed = false;

// Update function
function updateKey()
{
    if (keyboardState['d'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + paddleWidth / 2)
            bottomPaddle.position.x -= 1;
    }
    else if (keyboardState['q'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - paddleWidth / 2)
            bottomPaddle.position.x += 1;
    }
    else if (keyboardState['m'])
    {
        // Move right paddle left
        if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + paddleWidth / 2)
            topPaddle.position.x -= 1;
    }
    else if (keyboardState['k'])
    {
        // Move right paddle right
        if (topPaddle.position.x < planeGeometry.parameters.width / 2 - paddleWidth / 2)
            topPaddle.position.x += 1;
    }
    else if (keyboardState['c'])
    {
        // Check if 'c' key is pressed and wasn't already handled
        if (!cameraKeyIsPressed)
        {
            // Toggle camera position based on cameraPosition flag
            if (cameraPosition == 0)
            {
                camera.position.set(0, 20, -60);
                cameraPosition = 1;
            }
            else if (cameraPosition == 0)
            {
                camera.position.set(0, 40, -70);
                cameraPosition = 0;
            }
            
            // Set flag to true to prevent multiple toggles in rapid succession
            cameraKeyIsPressed = true;
        }
    }
    else
    {
        // Reset flag when 'c' key is released
        cameraKeyIsPressed = false;
    }
}

function animate()
{
    requestAnimationFrame(animate);

    // Calculate new position based on angle
    const posX = Math.cos(angleLight) * orbitRadius;
    const posY = 50; // Adjust vertical position if needed
    const posZ = Math.sin(angleLight) * orbitRadius;

    // Update directional light position
    directionalLight.position.set(posX, posY, posZ);

    // Calculate intensity based on current phase
    let intensity;
    if (intensityPhase < Math.PI)
        // First half of the cycle: increase intensity
        intensity = fullIntensity * (intensityPhase / Math.PI);
    else if (intensityPhase < 2 * Math.PI)
        // Second half of the cycle: decrease intensity
        intensity = fullIntensity * (2 - (intensityPhase / Math.PI));

    // Set light intensity
    directionalLight.intensity = intensity;

    // Increment angle and phase for next frame
    angleLight += orbitSpeed;
    intensityPhase += orbitSpeed;

    // Wrap intensityPhase within [0, 2 * Math.PI]
    if (intensityPhase > 2 * Math.PI)
    {
        intensityPhase -= 2 * Math.PI;
    }

    // Update the sphere's position
    sphere.position.x += velocity.x;
    sphere.position.z += velocity.z;
    sphereRotation();

    // Check for collisions and update velocity accordingly
    checkCollision();

    updateKey();

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

animate();

// Handle window resizing
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});
