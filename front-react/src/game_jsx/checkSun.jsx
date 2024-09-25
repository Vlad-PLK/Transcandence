import * as THREE from 'three';

function checkSun(camera, starMesh, stars, starLight)
{
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const sunDirection = new THREE.Vector3().subVectors(starMesh.position, camera.position).normalize();
    const angle = cameraDirection.angleTo(sunDirection);

    // Define the maximum angle at which stars start to disappear
    const maxAngle = Math.PI / 8;

    // Calculate opacity based on angle (as camera points towards sun, stars fade)
    let opacity = Math.pow(THREE.MathUtils.clamp(angle / maxAngle, 0, 1), 2 + (starLight.intensity / 2));

    stars.material.transparent = true; // Ensure transparency is enabled
    stars.material.opacity = opacity;

    // Ensure changes are applied
    stars.material.needsUpdate = true;
}

export default checkSun;

