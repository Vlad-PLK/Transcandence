const fragmentRedGiantShader = `
    uniform float time; 
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying vec3 vPosition;
    varying vec2 vUv;

    float noise(vec3 p) {
        return sin(p.x * 10.0) * sin(p.y * 10.0) * sin(p.z * 10.0);
    }

    void main() {
        float fresnel = pow(1.0 - dot(normalize(vNormal), normalize(eyeVector)), 2.0);
        
        float surfacePattern = noise(vPosition * 0.5 + vec3(time * 0.1));

        vec3 sunColor = vec3(0.1, 0.0, 0.0);
        
        // Mix sun color with the surface pattern to create a glowing effect
        vec3 finalColor = mix(sunColor, vec3(0.6, 0.0, 0.0), surfacePattern * 0.8 + fresnel);

        // Create an intense glow around the edges
        finalColor += vec3(fresnel * 0.6, fresnel * 0.025, fresnel * 0.0);

        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

export default fragmentRedGiantShader;