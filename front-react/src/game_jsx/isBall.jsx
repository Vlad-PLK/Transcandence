import * as THREE from 'three';

function isBallOverBoostSurface(surface, sphere, sphereGeometry)
{
    // Create a sphere to represent the ball's collision volume
    const ballBoundingSphere = new THREE.Sphere(
        sphere.position, // Center of the sphere (ball's current position)
        sphereGeometry.parameters.radius // Radius of the sphere (ball's radius)
    );

    // Get the bounding box of the Boost surface mesh
    const boostSurfaceBoundingBox = new THREE.Box3().setFromObject(surface);

    // Check for intersection between the ball's sphere and the Boost surface's bounding box
    return boostSurfaceBoundingBox.intersectsSphere(ballBoundingSphere);
}

export default isBallOverBoostSurface
