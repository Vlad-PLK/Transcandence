import * as THREE from '../../node_modules/three/src/Three.js';

function getFresnelCustomMat(customColor, intensity, facingHex = 0x000000) {
    const uniforms = {
      color1: { value: new THREE.Color(customColor) }, // Custom color (rim)
      color2: { value: new THREE.Color(facingHex) },   // Facing color (default black)
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 0.4 },
      fresnelPower: { value: 0.75 },
      intensity: { value: intensity },  // Custom intensity
    };
  
    const vs = `
      uniform float fresnelBias;
      uniform float fresnelScale;
      uniform float fresnelPower;
  
      varying float vReflectionFactor;
  
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
  
        vec3 I = worldPosition.xyz - cameraPosition;
  
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
  
        gl_Position = projectionMatrix * mvPosition;
      }
    `;
  
    const fs = `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform float intensity;
  
      varying float vReflectionFactor;
  
      void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        vec3 fresnelColor = mix(color2, color1, vec3(f) * (intensity * 0.25));
        gl_FragColor = vec4(fresnelColor, f);
      }
    `;
  
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      // Optionally enable wireframe mode:
      // wireframe: true,
    });
  
    return fresnelMat;
  }
  
  export { getFresnelCustomMat };
  
