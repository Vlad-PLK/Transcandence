const vertexBlackHoleShader = `
precision highp float;

varying vec2 vUv;        // UV coordinates
varying vec3 vPosition;  // World position

// Vertex Shader
varying vec3 vWorldPosition;
uniform vec3 ucameraPosition;

void main() {
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz - ucameraPosition;  // Camera-relative position

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}


`;

export default vertexBlackHoleShader;
