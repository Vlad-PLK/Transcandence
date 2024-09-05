import * as THREE from 'three';

const vertexSunShader = `
    varying vec3 vNormal;
    varying vec3 eyeVector;
    varying vec3 vPosition;
    varying vec2 vUv;
    float PI = 3.141592653589793238;

    void main() {

        vUv = uv;
        vPosition = position;

        // // modelMatrix transforms the coordinates local to the model into world space
        vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );

        // // normalMatrix is a matrix that is used to transform normals from object space to view space.
        vNormal = normalize( normalMatrix * normal );
       
        // // vector pointing from camera to vertex in view space
        eyeVector = normalize(mvPos.xyz);

        gl_Position = projectionMatrix * mvPos;
    }
`;

export default vertexSunShader;
