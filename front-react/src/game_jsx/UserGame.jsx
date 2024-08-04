import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import setRenderer from './setRenderer';
import setWalls from './setWalls';
import setPaddles from './setPaddles';
import setBoosts from './setBoosts';
import setSolarySystem from './setSolarySystem';
import checkSun from './checkSun';
import isBallOverBoostSurface from './isBall';
import setCamera from './setCamera';
import setPlane from './setPlane';
import updateKey from './updateKey';
import * as vec from './vectors_functions'

let cameraKeyIsPressed = false;
let paddle1Right = false;
let paddle1Left = false;
let paddle2Right = false;
let paddle2Left = false;
let cameraPosition = 1;

let boostMultiplier = 1;
let boost1Flag = 1; // Initial direction (1 for right, -1 for left)
let boost2Flag = -1; // Initial direction (1 for right, -1 for left)

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

const speedBoostSpeed = 0.1;
let velocity = vec.vectorize(0, 0, 0);
// Keyboard controls
const keyboardState = {};

document.addEventListener('keydown', (event) => {
    keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.key] = false;
});

function setSphere(scene)
{
    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32); // Radius, width segments, height segments
    // const textureLoaderSphere = new THREE.TextureLoader().load('./texture1.jpg');
    const sphereMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF}); // Dark
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);
    //sphere.receiveShadow = true;
    //sphere.castShadow = true; 
    resetSphere(sphere, sphereGeometry);
    scene.add(sphere);
    
    return { sphere, sphereGeometry };
}

function calculateCollisionNormal(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry)
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
    velocity = vec.vectorize(0, 0, 0);
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

function checkCollision(sphere, sphereGeometry, planeGeometry,
    topPaddle, bottomPaddle)
{
    const { normal, flag } = calculateCollisionNormal(sphere, sphereGeometry, 
        topPaddle, bottomPaddle, planeGeometry);

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
        velocity = vec.reflectVector(velocity, normal);
    }

    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2)
    {
        //let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        //shockWave(scene, contactPoint);
        //player1Score += 1;
        //player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetSphere(sphere, sphereGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2)
    {
        //let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        //shockWave(scene, contactPoint);
        //player2Score += 1;
        //player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
        resetSphere(sphere, sphereGeometry);
    }
}

function UserGame(){
	const canvasRef = useRef(null);

    useEffect(() => {

    // scene, lights, textures  //
    // scene //
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    // renderer //
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current});
    setRenderer(renderer);
    document.body.appendChild(renderer.domElement);
    // ambient light //
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Color, intensity
    scene.add(ambientLight);
    // camera setup //
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      10000 // Far clipping plane
    );
    const cameraDirection = new THREE.Vector3();
    setCamera(camera, cameraDirection);
    // scene, lights, textures //

    // ... Add geometry, materials, lights, etc.
    const planeGeometry = setPlane(scene, textureLoader);
    const { leftWall, rightWall, bottomWall, topWall } = setWalls(scene, planeGeometry);
    const { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(scene, planeGeometry); 
    const { sphere, sphereGeometry } = setSphere(scene);
    const { speedBoostGeometry, speedBoost1, speedBoost2 } = setBoosts(scene);
    const { earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars } = setSolarySystem(scene, textureLoader);

    
    // animation
    const animate = () => {
      requestAnimationFrame(animate);

    updateKey(keyboardState, bottomPaddle, topPaddle, bottomPaddleGeometry, 
        topPaddleGeometry, planeGeometry, cameraKeyIsPressed,
        paddle1Left, paddle1Right, paddle2Left, paddle2Right,
        camera, cameraPosition, sunMesh, stars);

    //   if (isBallOverBoostSurface(speedBoost1, sphere, sphereGeometry) || isBallOverBoostSurface(speedBoost2, sphere, sphereGeometry))
        //   boostMultiplier = 2; // Double the ball's speed while over boost surface
    //   else
        //   boostMultiplier = 1; // Reset to normal speed if not over boost surface

    //   speedBoost1.position.x += boost1Flag * speedBoostSpeed;
    //   speedBoost2.position.x += boost2Flag * speedBoostSpeed;

    //   // Check if boost surfaces reached the edge of the plane and reverse direction if needed
    //   if ((speedBoost1.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost1.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
        //   boost1Flag *= -1; // Reverse direction for speedBoost1

    //   if ((speedBoost2.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost2.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
        //   boost2Flag *= -1; // Reverse direction for speedBoost2

    sphere.position.x += velocity.x;
    sphere.position.z += velocity.z;
    //rotateSphere(sphere, sphereGeometry, velocity);

    //   earthMesh.rotation.y += earthRotationSpeed;
    //   lightsMesh.rotation.y += earthRotationSpeed;
    //   sunMesh.rotation.y += 0.001;

    //   angle += moonOrbitSpeed;
    //   moonMesh.position.x = earthMesh.position.x + a * Math.cos(angle);
    //   moonMesh.position.y = earthMesh.position.y + (a * Math.sin(angle)) * Math.sin(inclination);
    //   moonMesh.position.z = earthMesh.position.z + b * Math.sin(angle);
    //   moonMesh.rotation.y = -angle;

    checkCollision(sphere, sphereGeometry, planeGeometry, topPaddle, bottomPaddle);

    ////////////////////////////RESET SPHERE MAKES PONG WORK - COMMENT TO START A GAME ////////////////////////////
    resetSphere(sphere, sphereGeometry);
    ////////////////////////////RESET SPHERE MAKES PONG WORK - COMMENT TO START A GAME ////////////////////////////

      renderer.render(scene, camera);
      // Update scene logic here
    };

    animate();
    window.addEventListener('resize', () =>
    {
         // Update camera aspect ratio
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        
        // Update renderer size
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    return () => {
      // Cleanup Three.js objects and event listeners
    };
    }, []); // Empty dependency array to run effect only once

  return <canvas ref={canvasRef} />;
};

export default UserGame