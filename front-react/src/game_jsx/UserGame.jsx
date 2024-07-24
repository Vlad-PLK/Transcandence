import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import setWalls from './setWalls';
import setPaddles from './setPaddles';
import setBoosts from './setBoosts';
import setSolarySystem from './setSolarySystem';
import checkSun from './checkSun';
import isBallOverBoostSurface from './isBall';
import checkCollision from './checkCollision';

class Vector
{
    constructor(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// Function to create a vector
function vectorize(x, y, z)
{
    return new Vector(x, y, z);
}

// Function to normalize a vector
function normalizeVector(v)
{
    let denominator = Math.sqrt(dot(v, v));
    return vectorize(v.x / denominator, v.y / denominator, v.z / denominator);
}

// Function to add two vectors
function vecAdd(v1, v2)
{
    return vectorize(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
}

// Function to subtract one vector from another
function vecSubtract(v1, v2)
{
    return vectorize(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
}

// Function to calculate the dot product of two vectors
function dot(v1, v2)
{
    return (v1.x * v2.x) + (v1.y * v2.y) + (v1.z * v2.z);
}

function reflectVector(v, n)
{
    const dotProduct = dot(v, n);
    return vectorize(v.x - 2 * dotProduct * n.x, v.y - 2 * dotProduct * n.y, v.z - 2 * dotProduct * n.z);
}

// Function to calculate the cross product of two vectors
function crossProduct(v1, v2)
{
    return vectorize((v1.y * v2.z) - (v1.z * v2.y), (v1.z * v2.x) - (v1.x * v2.z), (v1.x * v2.y) - (v1.y * v2.x));
}

// Function to calculate the scalar product of a vector and a scalar
function scalarProduct(v, a)
{
    return vectorize(v.x * a, v.y * a, v.z * a);
}

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
let velocity = vectorize(0, 0, 0);
// Keyboard controls
const keyboardState = {};

document.addEventListener('keydown', (event) => {
    keyboardState[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keyboardState[event.key] = false;
});

function setPlane(scene, TextureLoader)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({map: TextureLoader.load("./planetexture.png"), side: THREE.DoubleSide}); // Green color, double-sided
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);
    return (planeGeometry);
}

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
    console.log("calcul");
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
    console.log("resetSphere");
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

function shockWave(scene, contactPoint)
{
    const textureLoad = new THREE.TextureLoader();
    const texture = textureLoad.load("./scoring.jpeg");
    const geometry = new THREE.PlaneGeometry(10, 4);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        // transparent: true,
        // opacity: 0.6,
        side: THREE.DoubleSide,
        depthTest: true // Ensure it renders over everything

    });

    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(contactPoint);
    scene.add(shockwave);

    animateShockwave(shockwave, scene);
}

function animateShockwave(shockwave, scene)
{
    const initialScale = 1;
    const targetScale = 1.2; // Example: Scale up to 10 times the initial size

    const animationDuration = 1000; // Animation duration in milliseconds
    const startTime = Date.now();

    function animateWave()
    {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // if (!flag)
            shockwave.scale.set(initialScale + (targetScale - initialScale) * progress, initialScale + (targetScale - initialScale) * progress, 1);
        // else
        //     shockwave.scale.set(initialScale + (targetScale - initialScale) * progress, initialScale + (targetScale - initialScale) * progress, -1);
        if (progress < 1)
            requestAnimationFrame(animateWave);
        else
            scene.remove(shockwave); // Remove shockwave after animation completes   
    }
    animateWave();
}

function UserGame(){
	const canvasRef = useRef(null);

  useEffect(() => {

    // Three.js code goes here

    // scene, lights, textures //
    // scene //
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    //scene.background = new THREE.Color(0x000000);
    ///////////
    //const texturePath = './planetexture.png';

    // renderer //
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    document.body.appendChild(renderer.domElement);
    ///////////

    // ambient light //
    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // Color, intensity
    scene.add(ambientLight);
    ///////////

    // camera setup //
    const camera = new THREE.PerspectiveCamera(
      45, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      10000 // Far clipping plane
    );
    // Position the camera to look over the Pong game
    camera.position.set(0, 20, -80);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    ///////////
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

      if (isBallOverBoostSurface(speedBoost1, sphere, sphereGeometry) || isBallOverBoostSurface(speedBoost2, sphere, sphereGeometry))
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

      checkCollision(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry, paddle1Left, paddle1Right, paddle2Left, paddle2Right, velocity, bottomWall, topWall, scene);

      renderer.render(scene, camera);
      // Update scene logic here
    };

    animate();

    return () => {
      // Cleanup Three.js objects and event listeners
    };
  }, []); // Empty dependency array to run effect only once

  return <canvas ref={canvasRef} />;
};

export default UserGame