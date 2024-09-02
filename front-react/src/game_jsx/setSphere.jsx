import * as THREE from 'three';
import { resetSphere } from './UserGame';

function setSphere(scene)
{
    // Create a sphere
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);
    // //sphere.receiveShadow = true;
    // sphere.castShadow = true; 
    resetSphere(sphere, sphereGeometry);
    scene.add(sphere);
    
    return { sphere, sphereGeometry };
}

export default setSphere
