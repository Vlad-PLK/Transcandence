import * as THREE from 'three';

const vertexBlackHoleShader = `
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying vec2 vUv;          // To pass UV coordinates to the fragment shader for texture lookups
    varying vec3 vPosition;     // To calculate black hole effects based on the vertex position

    // Uniforms for camera and black hole properties
    uniform vec3 blackHolePosition;   // Position of the black hole in the scene
    uniform float blackHoleMass;      // Mass of the black hole
    uniform float discRadius;         // Radius of the accretion disc

    void main() {

        // Model view position of the vertex
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
        
        // Transform normal to view space
        vNormal = normalize(normalMatrix * normal);
        
        // Calculate the eye vector (camera direction) pointing to the vertex
        eyeVector = normalize(mvPos.xyz);

        // Calculate UV coordinates (texture mapping)
        vUv = uv;
        
        // Calculate the vertex position relative to the black hole for effects like lensing
        vPosition = position - blackHolePosition;

        // Calculate Schwarzschild radius: Rs = 2 * G * M / c^2 (simplified as 2 * M for normalized units)
        float schwarzschildRadius = 2.0 * blackHoleMass;
        
        // Check if the vertex is within the event horizon (no light escapes)
        if (length(vPosition) < schwarzschildRadius) {
            // Discard the vertex if inside event horizon
            gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
        } else {
            // Apply standard transformation for visible vertices outside event horizon
            gl_Position = projectionMatrix * mvPos;
        }
    }
`;

export default vertexBlackHoleShader;

