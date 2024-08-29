import * as THREE from "./node_modules/three/src/Three.js";

function setPlane(scene, textureLoader)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({color: 0xFF0000});// map: textureLoader.load("./planetexture.png"), side: THREE.DoubleSide}); // Green color, double-sided
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
    const leftWallGeometry = new THREE.BoxGeometry(1, 5, planeGeometry.parameters.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -planeGeometry.parameters.width / 2 - 0.5;
    leftWall.position.y = 2.5;
    leftWall.receiveShadow = true;
    leftWall.castShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(1, 5, planeGeometry.parameters.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = planeGeometry.parameters.width / 2 + 0.5;
    rightWall.position.y = 2.5;
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
    const bottomWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 5, 1);
    const bottomWall = new THREE.Mesh(bottomWallGeometry, topWallMaterial);
    bottomWall.position.z = -planeGeometry.parameters.height / 2 - 0.5;
    bottomWall.position.y = 2.5;
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
    const topWallGeometry = new THREE.BoxGeometry(planeGeometry.parameters.width, 5, 1);
    const topWall = new THREE.Mesh(topWallGeometry, bottomWallMaterial);
    topWall.position.z = planeGeometry.parameters.height / 2 + 0.5;
    topWall.position.y = 2.5;
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
    const bottomPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const bottomPaddle = new THREE.Mesh(bottomPaddleGeometry, bottomPaddleMaterial);
    bottomPaddle.position.z = -planeGeometry.parameters.height / 2 + paddleDepth / 2; // Position along the Z axis
    bottomPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y axis
    bottomPaddle.castShadow = true;
    scene.add(bottomPaddle);

    // Top paddle
    const topPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const topPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // White
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

export function setObjects(scene, textureLoader)
{   
    const planeGeometry = setPlane(scene, textureLoader);

    const { leftWall, rightWall, bottomWall, topWall } = setWalls(scene, planeGeometry);

    const { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(scene, planeGeometry);

    const { sphere, sphereGeometry } = setSphere(scene);

    console.log("Sphere OBJECTS:", sphere); // Log sphere object

    return {sphere, sphereGeometry, planeGeometry, leftWall, rightWall, bottomWall, topWall, bottomPaddle, bottomPaddleGeometry, topPaddle, topPaddleGeometry};
}

export function rotateSphere(sphere, sphereGeometry, velocity)
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