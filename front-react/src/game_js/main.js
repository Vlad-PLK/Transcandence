// Import Three.js
import * as THREE from 'three';
import Stats from "./node_modules/stats.js/src/Stats.js";
import { Vector, vectorize, normalizeVector, vecAdd, vecSubtract, dot, crossProduct, scalarProduct, reflectVector } from './vector_utils.js';
import { setObjects, rotateSphere } from './3D_objects.js';
import { checkSun, setAll } from './scene.js';
import { setScore } from './score.js';
import { setBoosts, shockWave } from "./features.js";

const { scene, camera, renderer, ambientLight, earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars, textureLoader } = setAll();

const { sphere, sphereGeometry, planeGeometry, leftWall, rightWall, bottomWall, topWall, bottomPaddle, bottomPaddleGeometry, topPaddle, topPaddleGeometry } = setObjects(scene, textureLoader);

const { speedBoostGeometry, speedBoost1, speedBoost2 } = setBoosts(scene);

let boostMultiplier = 1;
let boost1Flag = 1; // Initial direction (1 for right, -1 for left)
let boost2Flag = -1; // Initial direction (1 for right, -1 for left)

let cameraPosition = 1;


const speedBoostSpeed = 0.1;

let velocity = vectorize(0, 0, 0);

// Scoring variables
let player1Score = 0;
let player2Score = 0;
let fps = 0;
const { player1ScoreElement, player2ScoreElement, fpsElement } = setScore(player1Score, player2Score, fps);

let cameraKeyIsPressed = false;
let paddle1Right = false;
let paddle1Left = false;
let paddle2Right = false;
let paddle2Left = false;

function isBallOverBoostSurface(surface)
{
    // Create a sphere to represent the ball's collision volume
    const ballBoundingSphere = new THREE.Sphere(
        sphere.position, // Center of the sphere (ball's current position)
        sphereGeometry.parameters.radius // Radius of the sphere (ball's radius)
    );

    // Get the bounding box of the boost surface mesh
    const boostSurfaceBoundingBox = new THREE.Box3().setFromObject(surface);

    // Check for intersection between the ball's sphere and the boost surface's bounding box
    return boostSurfaceBoundingBox.intersectsSphere(ballBoundingSphere);
}

function calculateCollisionNormal()
{
    const radius = sphereGeometry.parameters.radius;

    // Check collision with left vertical wall
    if (sphere.position.x - radius <= -planeGeometry.parameters.width / 2)
        return { normal: new THREE.Vector3(1, 0, 0).normalize(), flag: 1 };
    
    // Check collision with right vertical wall
    if (sphere.position.x + radius >= planeGeometry.parameters.width / 2)
        return { normal: new THREE.Vector3(-1, 0, 0).normalize(), flag: 2 };

    // Check collision with bottom paddle
    if (sphere.position.z - radius <= bottomPaddle.position.z + bottomPaddle.geometry.parameters.depth / 2 &&
        sphere.position.x >= bottomPaddle.position.x - (bottomPaddle.geometry.parameters.width / 2) - 2 &&
        sphere.position.x <= bottomPaddle.position.x + (bottomPaddle.geometry.parameters.width / 2) + 2)
    {
        return { normal: new THREE.Vector3(0, 0, 1).normalize(), flag: 3 };
    }

    // Check collision with top paddle
    if (sphere.position.z + radius >= topPaddle.position.z - topPaddle.geometry.parameters.depth / 2 &&
        sphere.position.x >= topPaddle.position.x - (topPaddle.geometry.parameters.width / 2) - 2 &&
        sphere.position.x <= topPaddle.position.x + (topPaddle.geometry.parameters.width / 2) + 2)
    {
        return { normal: new THREE.Vector3(0, 0, -1).normalize(), flag: 4 };
    }

    // Default normal (no collision)
    return { normal: null, flag: 0};
}

function resetSphere(sphere, sphereGeometry)
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
    const { normal, flag } = calculateCollisionNormal();

    if (normal && flag > 0)
    {
        if (paddle1Left && flag == 3)
        {
            velocity.x += 0.2;
            // velocity.z += 0.1;
        }
        else if (paddle1Right && flag == 3)
        {
            velocity.x -= 0.2;
            // velocity.z += 0.1
        }
        else if (paddle2Left && flag == 4)
        {
            velocity.x += 0.2;
            // velocity.z += 0.1
        }
        else if (paddle2Right && flag == 4)
        {
            velocity.x -= 0.2;
            // velocity.z += 0.1
        }
        velocity = reflectVector(velocity, normal);
    }

    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        shockWave(scene, contactPoint);
        player1Score += 1;
        player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetSphere(sphere, sphereGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        shockWave(scene, contactPoint);
        player2Score += 1;
        player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
        resetSphere(sphere, sphereGeometry);
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

// Update function
function updateKey()
{
    if (keyboardState['d'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + bottomPaddleGeometry.parameters.width / 2)
        {
            bottomPaddle.position.x -= 1;
            paddle1Right = true;
        }
    }
    else if (keyboardState['q'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - bottomPaddleGeometry.parameters.width / 2)
        {
            bottomPaddle.position.x += 1;
            paddle1Left = true
        }
    }
    else if (keyboardState['m'])
    {
        // Move right paddle left
        if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + topPaddleGeometry.parameters.width / 2)
        {
            topPaddle.position.x -= 1;
            paddle2Right = true;
        }
    }
    else if (keyboardState['k'])
    {
        // Move right paddle right
        if (topPaddle.position.x < planeGeometry.parameters.width / 2 - topPaddleGeometry.parameters.width / 2)
        {
            topPaddle.position.x += 1;
            paddle2Left = true
        }    
    }
    else if (keyboardState['c'])
    {
        // Check if 'c' key is pressed and wasn't already handled
        if (!cameraKeyIsPressed)
        {
            if (cameraPosition > 4)
                cameraPosition = 0;
            // Toggle camera position based on cameraPosition flag
            if (cameraPosition == 0)
            {
                camera.position.set(0, 20, -80);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 1)
            {
                camera.position.set(0, 40, -130);
            }
            else if (cameraPosition == 2)
            {
                camera.position.set(0, 20, 80);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 3)
            {
                camera.position.set(0, 40, 130);
            }
            else if (cameraPosition == 4)
            {
                camera.position.set(0, 120, 0); // Place the camera above the scene
                camera.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
            }
            checkSun(camera, sunMesh, stars);
            ++cameraPosition;   
            // Set flag to true to prevent multiple toggles in rapid succession
            cameraKeyIsPressed = true;
        }
    }
    else
    {   
        cameraKeyIsPressed = false;
        paddle1Right = false;
        paddle1Left = false;
        paddle2Right = false;
        paddle2Left = false;
    }
}

function checkBoost()
{
    if (isBallOverBoostSurface(speedBoost1) || isBallOverBoostSurface(speedBoost2))
        boostMultiplier = 2; // Double the ball's speed while over boost surface
    else
        boostMultiplier = 1; // Reset to normal speed if not over boost surface

    speedBoost1.position.x += boost1Flag * speedBoostSpeed;
    speedBoost2.position.x += boost2Flag * speedBoostSpeed;

    // Check if boost surfaces reached the edge of the plane and reverse direction if needed
    if ((speedBoost1.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost1.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
        boost1Flag *= -1; // Reverse direction for speedBoost1

    if ((speedBoost2.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost2.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
        boost2Flag *= -1; // Reverse direction for speedBoost2
}

resetSphere(sphere, sphereGeometry);

// Define the orbit parameters
const semiMajorAxis = 500; // Semi-major axis in km
const eccentricity = 0.0549; // Orbital eccentricity
const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

const a = semiMajorAxis;
const inclination = 5.145 * Math.PI / 180;
const b = semiMinorAxis

let earthRotationSpeed = 0.1;
let moonOrbitSpeed = earthRotationSpeed / 27
let angle = 0;

let frameCounter = 0;
let lastTime = performance.now();

function checkFPS(frameCount)
{
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    const fps = frameCount / deltaTime;
    fpsElement.innerHTML = `FPS: ${fps}`;
    frameCounter = 0; // Reset frame counter
    lastTime = currentTime; // Update the lastTime
}

function animate()
{
    requestAnimationFrame(animate);

    updateKey();

    checkBoost();

    // Update the sphere's position
    sphere.position.x += velocity.x * boostMultiplier;
    sphere.position.z += velocity.z * boostMultiplier;
    // rotateSphere(sphere, sphereGeometry, velocity);

    earthMesh.rotation.y += earthRotationSpeed;
    lightsMesh.rotation.y += earthRotationSpeed;
    sunMesh.rotation.y += 0.001;

    angle += moonOrbitSpeed;
    moonMesh.position.x = earthMesh.position.x + a * Math.cos(angle);
    moonMesh.position.y = earthMesh.position.y + (a * Math.sin(angle)) * Math.sin(inclination);
    moonMesh.position.z = earthMesh.position.z + b * Math.sin(angle);
    moonMesh.rotation.y = -angle;

    // Check for collisions and update velocity/direction accordingly
    checkCollision();

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
    frameCounter++;
}

// Start the FPS check interval
setInterval(() =>
{
    checkFPS(frameCounter);
}, 1000);

animate();

// Handle window resizing
window.addEventListener('resize', () =>
{
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});
