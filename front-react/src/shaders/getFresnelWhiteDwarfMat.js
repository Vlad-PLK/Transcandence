import * as THREE from '../../node_modules/three/src/Three.js';

function getFresnelWhiteDwarfMat({ rimHex = 0x0099FFFF, facingHex = 0x00CCFFFF } = {}) {
  const uniforms = {
    color1: { value: new THREE.Color(rimHex) },  // Outer rim color (light bluish gray)
    color2: { value: new THREE.Color(facingHex) },  // Facing color (soft blue)
    fresnelBias: { value: 1.0 },  // Slightly less bias for sharper edge transitions
    fresnelScale: { value: 1.0 },  // Increased for stronger edge glow
    fresnelPower: { value: 2.0 },  // Higher power to simulate intense energy near the edges
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
      vReflectionFactor = fresnelBias + fresnelScale * pow( 0.2 + dot( normalize( I ), worldNormal ), fresnelPower );

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

      // Mix between the soft blue core and the light bluish-gray rim
      gl_FragColor = vec4( mix(color2, color1, vec3(f)), 1.0 );
    }
  `;

  const fresnelMat = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vs,
    fragmentShader: fs,
    transparent: true,  // Keep transparent for additive blending
    opacity: 0.85,  // Adjust opacity to enhance the white dwarf glow
    blending: THREE.AdditiveBlending,  // Additive blending for a glowing effect
    // Optionally enable wireframe mode for debugging:
    // wireframe: true,
  });

  return fresnelMat;
}

export { getFresnelWhiteDwarfMat };
