const photonSphereVertexShader = `
varying vec2 vUv; // UV coordinates
varying vec3 vPosition; // World position of the vertex

void main() {
    vUv = uv;
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
}
`;

export default photonSphereVertexShader;