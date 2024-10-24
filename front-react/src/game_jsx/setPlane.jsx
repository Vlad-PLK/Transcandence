import * as THREE from 'three';

function setPlane(scene)
{
    // Create a plane on the X and Y axis
    const planeGeometry = new THREE.PlaneGeometry(125, 180); // Width, height
    const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ff00, // Green color
        side: THREE.DoubleSide, // Ensure the plane is visible from both sides
        transparent: true, // Make sure the material is transparent
        opacity: 0.5, // Adjust opacity as needed
        depthWrite: false, // Ensure the plane does not write to the depth buffer
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate the plane to lie flat on the X and Y axis
    // plane.receiveShadow = true;
    // plane.castShadow = true;
    scene.add(plane);

    // Create a white line in the middle of the plane
    const lineWidth = 5;
    const lineHeight = planeGeometry.parameters.width; // Length of the line to match the width of the plane
    const lineGeometry = new THREE.PlaneGeometry(lineHeight, lineWidth); // Width, height
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.5}); // White color
    const line = new THREE.Mesh(lineGeometry, lineMaterial);
    line.rotation.x = -Math.PI / 2; // Rotate to lie flat
    line.position.y = 0.01; // Slightly above the plane to avoid z-fighting
    scene.add(line);

    return (planeGeometry);
}

export default setPlane
