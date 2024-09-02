import * as THREE from 'three';

function alterPlaneGeometry(planeGeometry, center, radius) {
    const positionAttribute = planeGeometry.attributes.position;
    const vertices = positionAttribute.array;
    const vertexCount = vertices.length / 3; // 3 components per vertex (x, y, z)

    for (let i = 0; i < vertexCount; i++) {
        const x = vertices[i * 3];
        const y = vertices[i * 3 + 1];
        const z = vertices[i * 3 + 2];

        // Calculate distance from the vertex to the shockwave's center
        const distance = Math.sqrt(
            (x - center.x) ** 2 + (z - center.z) ** 2
        );

        // If the vertex is within the shockwave radius, lower its y-coordinate to make it "disappear"
        if (distance < radius) {
            vertices[i * 3 + 1] = -10; // Move the vertex downwards (arbitrary value)
        }
    }

    // Notify Three.js that the position attribute has been updated
    positionAttribute.needsUpdate = true;
    planeGeometry.computeVertexNormals();
}

function shockWave(scene, contactPoint, planeGeometry) {
    const geometry = new THREE.SphereGeometry(4, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        depthTest: true, // Ensure it renders over everything
        transparent: true,
        opacity: 0.5
    });

    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(contactPoint);
    scene.add(shockwave);

    animateShockwave(shockwave, scene, planeGeometry, contactPoint);
}

function animateShockwave(shockwave, scene, planeGeometry, contactPoint) {
    const initialScale = 0.2;
    const targetScale = 5; // Set a larger target scale for more noticeable expansion

    const animationDuration = 1000; // Animation duration in milliseconds
    const startTime = Date.now();

    function animateWave() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // Scale the shockwave uniformly in all directions (X, Y, Z)
        const currentScale = initialScale + (targetScale - initialScale) * progress;
        shockwave.scale.set(currentScale, currentScale, currentScale);

        // Reduce opacity as it expands
        shockwave.material.opacity = 1 - progress;

        // Modify the plane geometry based on shockwave's expansion
        alterPlaneGeometry(planeGeometry, contactPoint, currentScale * shockwave.geometry.parameters.radius);

        if (progress < 1) {
            requestAnimationFrame(animateWave);
        } else {
            scene.remove(shockwave); // Remove shockwave after animation completes
        }
    }
    animateWave();
}


export default shockWave
