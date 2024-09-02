import * as THREE from 'three';

function setWalls(scene, planeGeometry)
{
    // Add walls around the plane
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa }); // Gray color

    // Left wall
    const leftWallGeometry = new THREE.BoxGeometry(1, 5, planeGeometry.parameters.height);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.x = -planeGeometry.parameters.width / 2 - 0.5;
    leftWall.position.y = 2.5;
    //leftWall.receiveShadow = true;
    //leftWall.castShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWallGeometry = new THREE.BoxGeometry(1, 5, planeGeometry.parameters.height);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.x = planeGeometry.parameters.width / 2 + 0.5;
    rightWall.position.y = 2.5;
    //rightWall.receiveShadow = true;
    //rightWall.castShadow = true;
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
    //bottomWall.receiveShadow = true;
    //bottomWall.castShadow = true;
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
    //topWall.receiveShadow = true;
    //topWall.castShadow = true;
    scene.add(topWall);

    return { leftWall, rightWall, bottomWall, topWall };
}

export default setWalls