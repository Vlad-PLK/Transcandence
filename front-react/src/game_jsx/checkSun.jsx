import * as THREE from 'three';

function checkSun(camera, sunMesh, stars) {
    // Calculate camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Calculate direction to sun from camera
    const sunDirection = new THREE.Vector3().subVectors(sunMesh.position, camera.position).normalize();

    // Calculate the angle between the camera direction and the sun direction
    const angle = cameraDirection.angleTo(sunDirection);

    // Define the maximum angle at which stars start to disappear
    const maxAngle = Math.PI / 4; // 45 degrees

    // Calculate opacity based on angle (as camera points towards sun, stars fade)
    let opacity = 1 - Math.pow(THREE.MathUtils.clamp(angle / maxAngle, 0, 1), 3);

    // Set stars material opacity and ensure it supports transparency
    stars.material.transparent = true; // Ensure transparency is enabled
    stars.material.opacity = opacity;

    // Debugging output to check values
    console.log("Camera Direction:", cameraDirection);
    console.log("Sun Direction:", sunDirection);
    console.log("Angle:", angle);
    console.log("Opacity:", opacity);
}


export default checkSun;
