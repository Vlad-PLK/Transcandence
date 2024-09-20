const fragmentSunShader = `
    uniform float time; 
    uniform vec3 color;
    uniform float intensity;
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
    vec3 darkColor = color * (intensity * 0.1);  // Reduce color intensity based on darkness factor

    gl_FragColor = vec4(darkColor, 1.0);
}
`;

export default fragmentSunShader;