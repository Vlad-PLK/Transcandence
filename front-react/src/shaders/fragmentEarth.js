import * as THREE from 'three';

const fragmentEarthShader = `
    varying vec3 vNormal;
    varying vec3 eyeVector;

    void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);

        // Set the fragment color using atmospheric opacity and factor
        gl_FragColor = vec4(0.2, 0.4, 1.0, 1.0) * intensity;
    }
`;

export default fragmentEarthShader;