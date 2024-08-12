import * as THREE from 'three';

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
    //bottomPaddle.castShadow = true;
    scene.add(bottomPaddle);

    // Top paddle
    const topPaddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
    const topPaddleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // White
    const topPaddle = new THREE.Mesh(topPaddleGeometry, topPaddleMaterial);
    topPaddle.position.z = planeGeometry.parameters.height / 2 - paddleDepth / 2; // Position along the Z axis
    topPaddle.position.y = paddleHeight / 2; // Center of the paddle on the Y axis
    //topPaddle.castShadow = true;
    scene.add(topPaddle);

    return { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry};
}

export default setPaddles
