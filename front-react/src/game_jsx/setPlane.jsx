import * as THREE from 'three';

function setPlane(scene, TextureLoader)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(75, 100); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({map: TextureLoader.load("./planetexture.png"), side: THREE.DoubleSide}); // Green color, double-sided
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
    plane.receiveShadow = true;
    plane.castShadow = true;
    scene.add(plane);
    return (planeGeometry);
}

export default setPlane