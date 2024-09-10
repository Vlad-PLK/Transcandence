const fragmentWhiteDwarfShader = `
uniform float time; 
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec3 vPosition;
varying vec2 vUv;

// Simple 3D noise function (can be replaced by a more complex one)
float noise(vec3 p) {
    return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0);
}

// Simulate solar surface with noise and fresnel-like glow effect
void main() {
    // Calculate brightness factor based on the normal and view direction
    float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(eyeVector)), 2.0);
    
    // Dynamic noise-based surface pattern
    float surfacePattern = noise(vPosition * 0.1 + vec3(time * 0.02));

    // Base sun color (fiery orange/yellow)
    vec3 sunColor = vec3(0.0, 0.4, 1.0);
    
    // Mix sun color with the surface pattern to create a glowing effect
    vec3 finalColor = mix(sunColor, vec3(0.0, 0.4, 1.0), surfacePattern * 2.0 + fresnel);

    // Create an intense glow around the edges
    finalColor += vec3(fresnel * 0.0, fresnel * 0.4, fresnel * 1.0);

    gl_FragColor = vec4(finalColor, 1.0);
}
`;

export default fragmentWhiteDwarfShader;