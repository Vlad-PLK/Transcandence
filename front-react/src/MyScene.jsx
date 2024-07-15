import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

function setPlane(scene)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0x00ff00, side: THREE.DoubleSide}); // Green color, double-sided
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);
    return (planeGeometry);
}

function setWalls(scene, planeGeometry)
{
    // Add walls around the plane
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Gray color

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(1, 10, planeGeometry.parameters.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -planeGeometry.parameters.width / 2 - 0.5;
    leftWall.position.y = 5;
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(1, 10, planeGeometry.parameters.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = planeGeometry.parameters.width / 2 + 0.5;
    rightWall.position.y = 5;
    rightWall.receiveShadow = true;
    rightWall.castShadow = true;
    scene.add(rightWall);

    // Top wall
    const topWallMaterial = new THREE.MeshStandardMaterial
    ({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.4
    });
    const bottomWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 10, 1);
    const bottomWall = new THREE.Mesh(bottomWallGeometry, topWallMaterial);
    bottomWall.position.z = -planeGeometry.parameters.height / 2 - 0.5;
    bottomWall.position.y = 5;
    bottomWall.receiveShadow = true;
    bottomWall.castShadow = true;
    scene.add(bottomWall);

    // Bottom wall
    const bottomWallMaterial = new THREE.MeshStandardMaterial
    ({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.4
    });
    const topWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 10, 1);
    const topWall = new THREE.Mesh(topWallGeometry, bottomWallMaterial);
    topWall.position.z = planeGeometry.parameters.height / 2 + 0.5;
    topWall.position.y = 5;
    topWall.receiveShadow = true;
    topWall.castShadow = true;
    scene.add(topWall);

    return { leftWall, rightWall, bottomWall, topWall };
}

function setPaddles(scene, planeGeometry)
{
    // Paddle dimensions
    const paddleWidth = 12;
    const paddleHeight = 2;
    const paddleDepth = 1;

    // Bottom paddle
    const bottomPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const bottomPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black
    const bottomPaddle = new THREE.Mesh(bottomPaddleGeometry, bottomPaddleMaterial);
    bottomPaddle.position.z = -planeGeometry.parameters.height / 2 + paddleDepth / 2; // Position along the Z axis
    bottomPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y axis
    bottomPaddle.castShadow = true;
    scene.add(bottomPaddle);

    // Top paddle
    const topPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const topPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // White
    const topPaddle = new THREE.Mesh(topPaddleGeometry, topPaddleMaterial);
    topPaddle.position.z = planeGeometry.parameters.height / 2 - paddleDepth / 2; // Position along the Z axis
    topPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y axis
    topPaddle.castShadow = true;
    scene.add(topPaddle);

    return { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry};
}

function setSphere(scene)
{
    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 32); // Radius, width segments, height segments
    // const textureLoaderSphere = new THREE.TextureLoader().load('./texture1.jpg');
    const sphereMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF}); // Dark
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);
    sphere.receiveShadow = true;
    sphere.castShadow = true; 
    scene.add(sphere);
    
    return { sphere, sphereGeometry };
}

function setStarfield(scene)
{
    // Create a star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true });

    // Generate random star positions
    const starCount = 10000;
    const spread = 20000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++)
    {
        const x = THREE.MathUtils.randFloatSpread(spread);
        const y = THREE.MathUtils.randFloatSpread(spread);
        const z = THREE.MathUtils.randFloatSpread(spread);
        starVertices.push(x, y, z);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    return (stars);
}

function setSolarySystem(scene, textureLoader)
{
    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    const earthGeometry = new THREE.IcosahedronGeometry(300, 12);
    const earthMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("./earthmap1k.jpg")});
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(600, 300, 1400);
    // earthMesh.position.set(0, 0, 0);
    earthGroup.add(earthMesh);


    const lightMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("./earthByNight.jpg"), blending: THREE.AdditiveBlending });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    earthGroup.add(lightsMesh);
    scene.add(earthGroup);

    const stars = setStarfield(scene);

    // Create the sun geometry
    const sunGeometry = new THREE.IcosahedronGeometry(600, 12); // Radius, detail
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("sunmap.jpg") }); // Yellow color
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 500, -5000);

    // Create a point light to simulate the sun's light
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.6); // Color, intensity
    sunLight.position.set(-600, 500, -2000); // Position it at the center of the sun
    sunLight.castShadow = true;
    // Increase shadow map size for better quality shadows
    sunLight.shadow.mapSize.width = 10000; // Default is 512
    sunLight.shadow.mapSize.height = 10000; // Default is 512

    // Set up shadow properties for the light
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    // Optional: create an object to hold the sun and light together
    const sunGroup = new THREE.Group();
    sunGroup.add(sunMesh);
    sunGroup.add(sunLight);

    // Position the sunGroup in the scene
    sunGroup.position.set(-600, 500, -2000);
    scene.add(sunGroup);

    return {earthMesh, lightsMesh, sunMesh, stars};
}

function MyScene(){
	const canvasRef = useRef(null);

  useEffect(() => {
    // Three.js code goes here
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    // const textureLoaderScene = new THREE.TextureLoader().load('./space.jpg');
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current});
    const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Color, intensity
    const { earthMesh, lightsMesh, sunMesh, stars } = setSolarySystem(scene, textureLoader);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0x000000);
    scene.add(ambientLight);
    const camera = new THREE.PerspectiveCamera(
      90, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      0.1, // Near clipping plane
      10000 // Far clipping plane
    );
    // Position the camera to look over the Pong game
    camera.position.set(0, 20, -65);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    renderer.setSize(window.innerWidth, window.innerHeight);
    // ... Add geometry, materials, lights, etc.
    const planeGeometry = setPlane(scene);
    const { leftWall, rightWall, bottomWall, topWall } = setWalls(scene, planeGeometry);
    const { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(scene, planeGeometry); 
    const { sphere, sphereGeometry } = setSphere(scene);
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