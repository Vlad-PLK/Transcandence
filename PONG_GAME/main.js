// main.js

import * as THREE from 'three';

// Create a scene
const scene = new THREE.Scene();

// Set background color to differentiate from a blank screen
scene.background = new THREE.Color(0xcccccc);

// Create a camera, which determines what we'll see when we render the scene
const camera = new THREE.PerspectiveCamera(
    75, // Field of view
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);

// Position the camera to look over the Pong game
camera.position.set(0, 20, 30); // Adjust these values as needed
camera.lookAt(0, 0, 0); // Look at the center of the scene

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a sphere
const sphereGeometry = new THREE.SphereGeometry(5, 32, 32); // Radius, width segments, height segments
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the sphere for demonstration
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;

    // Render the scene from the perspective of the camera
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
