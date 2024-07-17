import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import setWalls from './setWalls';
import setPaddles from './setPaddles';
import setBoosts from './setBoosts';
import setSolarySystem from './setSolarySystem';

function setPlane(scene, textureLoader)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({map: textureLoader, side: THREE.DoubleSide}); // Green color, double-sided
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
    //plane.receiveShadow = true;
    //plane.castShadow = true;
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
    scene.add(sphere);
    
    return { sphere, sphereGeometry };
}

function MyScene(){
	const canvasRef = useRef(null);

  useEffect(() => {

    // Three.js code goes here

    // scene, lights, textures //
    // scene //
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./planetexture.png");
    scene.background = new THREE.Color(0x000000);
    ///////////

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
    const planeGeometry = setPlane(scene, texture);
    const { leftWall, rightWall, bottomWall, topWall } = setWalls(scene, planeGeometry);
    const { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(scene, planeGeometry); 
    const { sphere, sphereGeometry } = setSphere(scene);
    const { speedBoostGeometry, speedBoost1, speedBoost2 } = setBoosts(scene);
    const { earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars } = setSolarySystem(scene, textureLoader);

    
    // animation
    const animate = () => {
      requestAnimationFrame(animate);

      earthMesh.rotation.y += 0.002;
      lightsMesh.rotation.y += 0.002;
      sunMesh.rotation.y += 0.001;

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

export default MyScene