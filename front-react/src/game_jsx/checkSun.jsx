import * as THREE from 'three';

function checkSun(camera, sunMesh, stars)
{
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const sunDirection = new THREE.Vector3().subVectors(sunMesh.position, camera.position).normalize();

    const angle = cameraDirection.angleTo(sunDirection);

    // Adjust stars opacity based on the angle
    const maxAngle = Math.PI / 6;
    const opacity = THREE.MathUtils.clamp(angle / maxAngle, 0, 1);

    stars.material.opacity = opacity;
}

export default checkSun
