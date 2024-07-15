// Import Three.js
import * as THREE from "./node_modules/three/src/Three.js";
import { Vector, vectorize, normalizeVector, vecAdd, vecSubtract, dot, crossProduct, scalarProduct, reflectVector } from './vector_utils.js';
import { setObjects, rotateSphere } from './3D_objects.js';
import { setVariables, checkSun, setAll } from './scene.js';
import { setScore } from './score.js';
import { setFeatures } from "./features.js";

const { cameraPosition, player1Score, player2Score, boostMultiplier, boost1Flag, boost2Flag, speedBoostSpeed, cameraKeyIsPressed, paddle1Right, paddle1Left, paddle2Right, paddle2Left, velocity } = setVariables();

const { scene, camera, renderer, ambientLight, earthMesh, lightsMesh, sunMesh, stars, textureLoader } = setAll();

const { sphere, sphereGeometry, planeGeometry, leftWall, rightWall, bottomWall, topWall, bottomPaddle, bottomPaddleGeometry, topPaddle, topPaddleGeometry } = setObjects(scene);
setTimeout(() => {velocity = vectorize(0, 0, 1);}, 3000);

const { player1ScoreElement, player2ScoreElement } = setScore(player1Score, player2Score);

const { speedBoostGeometry, speedBoost1, speedBoost2 } = setFeatures(scene);


function isBallOverBoostSurface(surface, sphere)
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
            velocity.z += 0.1;
        }
        else if (paddle1Right && flag == 3)
        {
            velocity.x -= 0.2;
            velocity.z += 0.1
        }
        else if (paddle2Left && flag == 4)
        {
            velocity.x += 0.2;
            velocity.z += 0.1
        }
        else if (paddle2Right && flag == 4)
        {
            velocity.x -= 0.2;
            velocity.z += 0.1
        }
        velocity = reflectVector(velocity, normal);
    }

    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2)
    {
        player1Score += 1;
        player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetSphere(sphere, sphereGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2)
    {
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
            if (cameraPosition > 3)
                cameraPosition = 0;
            // Toggle camera position based on cameraPosition flag
            if (cameraPosition == 0)
            {
                camera.position.set(0, 20, -65);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 1)
            {
                camera.position.set(0, 45, -80);
            }
            else if (cameraPosition == 2)
            {
                camera.position.set(0, 20, 65);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 3)
            {
                camera.position.set(0, 60, 0); // Place the camera above the scene
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
    if (isBallOverBoostSurface(speedBoost1, sphere) || isBallOverBoostSurface(speedBoost2, sphere))
        boostMultiplier = 2; // Double the ball's speed while over boost surface
    else
        boostMultiplier = 1; // Reset to normal speed if not over boost surface

    speedBoost1.position.x += boost1Flag * speedBoostSpeed;
    speedBoost2.position.x += boost2Flag * speedBoostSpeed;

    // Check if boost surfaces reached the edge of the plane and reverse direction if needed
    if (speedBoost1.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) {
        boost1Flag = -1; // Reverse direction for speedBoost1
    } else if (speedBoost1.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2) {
        boost1Flag = 1; // Reverse direction for speedBoost1
    }

    if (speedBoost2.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) {
        boost2Flag = -1; // Reverse direction for speedBoost2
    } else if (speedBoost2.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2) {
        boost2Flag = 1; // Reverse direction for speedBoost2
    }
}

function animate()
{
    requestAnimationFrame(animate);

    //checkBoost();

    // Update the sphere's position
    //sphere.position.x += velocity.x * boostMultiplier;
    //sphere.position.z += velocity.z * boostMultiplier;
    // rotateSphere(sphere, sphereGeometry, velocity);

    earthMesh.rotation.y += 0.002;
    lightsMesh.rotation.y += 0.002;
    sunMesh.rotation.y += 0.001;

    // Check for collisions and update velocity/direction accordingly
    //checkCollision();

    //updateKey();

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
