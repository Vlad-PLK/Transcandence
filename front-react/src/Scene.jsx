import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Scene = () => {
	const canvasRef = useRef(null);

  	useEffect(() => {
    // Three.js code goes here
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });

    renderer.setSize(window.innerWidth, window.innerHeight);

    // ... Add geometry, materials, lights, etc.
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({ color: 'red' });
	const cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
	  cube.rotation.x += 0.01;
  	  cube.rotation.y += 0.01;

  	  renderer.render(scene, camera);
      // Update scene logic here
    };

    animate();

    return () => {
      // Cleanup Three.js objects and event listeners
    };
  }, []); // Empty dependency array to run effect only once

  return <canvas ref={canvasRef} />;
}

export default Scene