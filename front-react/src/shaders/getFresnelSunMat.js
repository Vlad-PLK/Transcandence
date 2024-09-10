import * as THREE from '../../node_modules/three/src/Three.js';

function getFresnelSunMat({ rimHex = 0xffaa00, facingHex = 0xff3300 } = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },  // Outer rim color (fiery orange)
    color2: { value: new THREE.Color(facingHex) },  // Facing color (deep red)
    fresnelBias: { value: 0.6 },  // Subtle bias for stronger effect on the edges
    fresnelScale: { value: 10 },  // Increased to intensify the edge glow
    fresnelPower: { value: 12 },  // Higher power for sharper glow near the edges
  };

  const vs = `
    uniform float fresnelBias;
    uniform float fresnelScale;
    uniform float fresnelPower;

    varying float vReflectionFactor;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      vec4 worldPosition = modelMatrix * vec4( position, 1.0 );

      // Calculate the world normal
      vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );

      // Vector from camera to vertex
      vec3 I = worldPosition.xyz - cameraPosition;

      // Fresnel reflection factor
      vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );

      // Final position of the vertex
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fs = `
    uniform vec3 color1;
    uniform vec3 color2;

    varying float vReflectionFactor;

    void main() {
      // Clamp the reflection factor between 0 and 1
      float f = clamp( vReflectionFactor, 0.0, 1.0 );

      // Mix between the deep red core and the fiery orange rim
      gl_FragColor = vec4( mix(color2, color1, vec3(f)), 1.0 );
    }
  `;

  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,  // Keep transparent to allow additive blending
    opacity: 0.9,  // Slightly increased opacity for a brighter look
    blending: THREE.AdditiveBlending,  // Additive blending for a glowing effect
    // Optionally enable wireframe mode for debugging:
    // wireframe: true,
  });

  return fresnelMat;
}

export { getFresnelSunMat };

