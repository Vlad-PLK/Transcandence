import * as THREE from 'three';
import  { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
// import { useMemo } from 'react';

import vertexHalo from '../shaders/vertexHalo.js';

import vertexEarthShader from '../shaders/vertexEarth.js';
import { getFresnelEarthMat } from "../shaders/getFresnelEarthMat.js";
import fragmentEarthShader from '../shaders/fragmentEarth.js';

import vertexSunShader from '../shaders/vertexSun.js';
import { getFresnelSunMat } from "../shaders/getFresnelSunMat.js";
import fragmentSunShader from '../shaders/fragmentSun.js';
import fragmentSunShading from '../shaders/fragmentSunShader.js';
import fragmentSunHalo from '../shaders/fragmentSunHalo.js';

import { getFresnelWhiteDwarfMat } from "../shaders/getFresnelWhiteDwarfMat.js";
import fragmentWhiteDwarfShader from '../shaders/fragmentWhiteDwarf.js';
import fragmentWhiteDwarfShading from '../shaders/fragmentWhiteDwarfShader.js'
import fragmentWhiteDwarfHalo from '../shaders/fragmentWhiteDwarfHalo.js';

import { getFresnelRedGiant } from "../shaders/getFresnelRedGiant.js";
import fragmentRedGiantShader from '../shaders/fragmentRedGiant.js';
import fragmentRedGiantShading from '../shaders/fragmentRedGiantShader.js'
import fragmentRedGiantHalo from '../shaders/fragmentRedGiantHalo.js';

import vertexBlackHoleShader from '../shaders/vertexBlackHole.js';
import fragmentBlackHoleShader from '../shaders/fragmentBlackHole.js';
import photonSphereVertexShader from '../shaders/vertexPhotonBlackHole.js';
import photonSphereFragmentShader from '../shaders/fragmentPhotonBlackHole.js';

import { getFresnelCustomMat } from "../shaders/getFresnelCustomMat.js";
import fragmentCustomShader from '../shaders/fragmentCustom.js'; 
import fragmentCustomShading from '../shaders/fragmentCustomShader.js';
import fragmentCustomHalo from '../shaders/fragmentCustomHalo.js';
import fragmentSecondCustomHalo from '../shaders/fragmentSecondCustomHalo.js';

function hexToRGB(hexColor) {
  if (typeof hexColor === 'string' && hexColor.startsWith('#'))
      hexColor = parseInt(hexColor.slice(1), 16);
  const red = ((hexColor >> 16) & 0xFF) / 255.0;
  const green = ((hexColor >> 8) & 0xFF) / 255.0;
  const blue = (hexColor & 0xFF) / 255.0;

  return { r: red, g: green, b: blue };
}

function setStarfield(scene) {
  const starGeometry = new THREE.BufferGeometry();

  // Parameters
  const starCount = 1500;
  const spread = 20000;
  const exclusionRadius = 10000;

  const starVertices = [];
  const starColors = [];
  const starSizes = [];

  const colors = [
    new THREE.Color(0xFFFFFF), // White
    new THREE.Color(0xadd8e6), // Light Blue
    new THREE.Color(0x00C9FF), // Darker Blue
    new THREE.Color(0x27A5FF), // Blue
    new THREE.Color(0xFFC700), // Yellow
    new THREE.Color(0xFF9E00), // Orange
    new THREE.Color(0xFF4F4F)  // Red
];


  for (let i = 0; i < starCount; i++) {
      let x, y, z, distance;

      do {
          x = THREE.MathUtils.randFloatSpread(spread);
          y = THREE.MathUtils.randFloatSpread(spread);
          z = THREE.MathUtils.randFloatSpread(spread);

          distance = Math.sqrt(x * x + y * y + z * z);
      } while (distance < exclusionRadius);

      starVertices.push(x, y, z);

      const size = THREE.MathUtils.randFloat(0.01, 2);
      starSizes.push(size);

      const color = colors[Math.floor(Math.random() * colors.length)];
      starColors.push(color.r, color.g, color.b);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
  starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));

  // Create custom shader material
  const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
          pointSize: { value: 1.0 }
      },
      vertexShader: `
      uniform float pointSize;
      attribute float size;
      varying vec3 vColor;

      void main() {
          vColor = color;
          // Use only the projection and view matrices (ignore modelMatrix)
          vec4 mvPosition = viewMatrix * vec4(position, 1.0);
          gl_PointSize = size * pointSize;
          gl_Position = projectionMatrix * mvPosition;
      }
      `,
      fragmentShader: `
          varying vec3 vColor;

          void main() {
              gl_FragColor = vec4(vColor, 1.0);
          }
      `,
      vertexColors: true,
      depthTest: true,
      depthWrite: false,
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  
  
  return stars;
}



function setSolarySystem(scene, camera, renderer, textureLoader, starType, customIntensity, customRadius, customColor, customCorona)
{
    const mainGroup = new THREE.Group();

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    const earthGeometry = new THREE.IcosahedronGeometry(300, 12);
    const bumpMapEarth = textureLoader.load("../../earthbump1k.jpg");
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("../../earthmap1k.jpg"),
        bumpMap: bumpMapEarth,
        bumpScale: 7,
      });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(200, 0, 1400);
    earthGroup.add(earthMesh);

    const lightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.4,
      map: textureLoader.load("../../earthByNight.jpg"),
      blending: THREE.AdditiveBlending,
      });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    lightsMesh.position.set(200, 0, 1400);
    lightsMesh.scale.setScalar(1.0000001);
    earthGroup.add(lightsMesh);

    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("../../Clouds.png"),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudMaterial);
    cloudsMesh.position.set(200, 0, 1400);
    cloudsMesh.scale.setScalar(1.008);
    earthGroup.add(cloudsMesh);

    const fresnelEarthMaterial = getFresnelEarthMat();
    const fresnelEarthMesh = new THREE.Mesh(earthGeometry, fresnelEarthMaterial);
    fresnelEarthMesh.position.set(200, 0, 1400);
    fresnelEarthMesh.scale.setScalar(1.015);
    earthGroup.add(fresnelEarthMesh);

    const atmoMaterial = new THREE.ShaderMaterial(
    {
      vertexShader: vertexEarthShader,
      fragmentShader: fragmentEarthShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    })
    const atmoMesh = new THREE.Mesh(earthGeometry, atmoMaterial)
    atmoMesh.position.set(200, 0, 1400);
    atmoMesh.scale.setScalar(1.07);
    earthGroup.add(atmoMesh);

    mainGroup.add(earthGroup);

    const moonGeometry = new THREE.IcosahedronGeometry(82, 12);
    const bumpMapMoon = textureLoader.load("./moonbump2k.jpg");
    const moonMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("../../moonmap2k.jpg"), bumpMap: bumpMapMoon,
    bumpScale: 2});
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    const orbitRadius = 500;
    moonMesh.position.set(earthMesh.position.x + orbitRadius, earthMesh.position.y, earthMesh.position.z);
    mainGroup.add(moonMesh);

    const stars = setStarfield(scene);

    if (starType == 0)
    {
      const sunGroup = new THREE.Group();
    
      const sunGeometry = new THREE.IcosahedronGeometry(850, 12);
      const sunMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
      sunMesh.position.set(-600, 0, -5000);

      const sunShadyMaterial = new THREE.ShaderMaterial(
      {
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          uniforms: 
          {
            time: {value: 0},
            resolution: { value: new THREE.Vector4() },
          },
          vertexShader: vertexSunShader,
          fragmentShader: fragmentSunShader,
      });
      const sunShadyMesh = new THREE.Mesh(sunGeometry, sunShadyMaterial);
      sunShadyMesh.position.set(-600, 0, -5000);
      sunGroup.add(sunShadyMesh);

      const fresnelSunMaterial = getFresnelSunMat();
      const fresnelSunMesh = new THREE.Mesh(sunGeometry, fresnelSunMaterial);
      fresnelSunMesh.position.set(-600, 0, -5000);
      sunGroup.add(fresnelSunMesh);

      const sunShadingMaterial = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            uniforms: 
            {
              time: {value: 0},
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertexSunShader,
            fragmentShader: fragmentSunShading,
        });
        const sunShadingMesh = new THREE.Mesh(sunGeometry, sunShadingMaterial);
        sunShadingMesh.position.set(-600, 0, -5000);
        sunGroup.add(sunShadingMesh);

        const sunHaloMaterial = new THREE.ShaderMaterial(
          {
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              uniforms: 
              {
                  time: {value: 0},
                  resolution: { value: new THREE.Vector4() },
              },
              transparent: true,
              vertexShader: vertexSunShader,
              fragmentShader: fragmentSunHalo,
          }
      );
      
      const sunHaloMesh = new THREE.Mesh(sunGeometry, sunHaloMaterial);
      sunHaloMesh.position.set(-600, 0, -5000);
      sunHaloMesh.scale.setScalar(1.5);
      sunGroup.add(sunHaloMesh);

      sunGroup.add(sunMesh);

      const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
      sunLight.position.set(-100, 200, -300);

      mainGroup.add(sunLight);
      mainGroup.add(sunGroup);

      scene.add(mainGroup);
      return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, sunLight, moonMesh, orbitRadius, stars};
    }
    else if (starType == 1)
    {
      const whiteDwarfGroup = new THREE.Group();
  
      const whiteDwarfGeometry = new THREE.IcosahedronGeometry(150, 12);
      const whiteDwarfMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const whiteDwarfMesh = new THREE.Mesh(whiteDwarfGeometry, whiteDwarfMaterial);
      whiteDwarfMesh.position.set(-600, 0, -5000);
      whiteDwarfGroup.add(whiteDwarfMesh);

      const whiteDwarfShadyMaterial = new THREE.ShaderMaterial(
      {
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          uniforms: 
          {
            time: {value: 0},
            resolution: { value: new THREE.Vector4() },
          },
          vertexShader: vertexSunShader,
          fragmentShader: fragmentWhiteDwarfShader,
      });
      const whiteDwarfShadyMesh = new THREE.Mesh(whiteDwarfGeometry, whiteDwarfShadyMaterial);
      whiteDwarfShadyMesh.position.set(-600, 0, -5000);
      whiteDwarfGroup.add(whiteDwarfShadyMesh);

      const fresnelwhiteDwarfMaterial = getFresnelEarthMat();
      const fresnelwhiteDwarfMesh = new THREE.Mesh(whiteDwarfGeometry, fresnelwhiteDwarfMaterial);
      fresnelwhiteDwarfMesh.position.set(-600, 0, -5000);
      whiteDwarfGroup.add(fresnelwhiteDwarfMesh);

      const whiteDwarfShadingMaterial = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            uniforms: 
            {
              time: {value: 0},
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertexSunShader,
            fragmentShader: fragmentWhiteDwarfShading,
        });
        const whiteDwarfShadingMesh = new THREE.Mesh(whiteDwarfGeometry, whiteDwarfShadingMaterial);
        whiteDwarfShadingMesh.position.set(-600, 0, -5000);
        whiteDwarfGroup.add(whiteDwarfShadingMesh);

        const whiteDwarfHaloMaterial = new THREE.ShaderMaterial(
          {
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              uniforms: 
              {
                  time: {value: 0},
                  resolution: { value: new THREE.Vector4() },
              },
              transparent: true,
              vertexShader: vertexSunShader,
              fragmentShader: fragmentWhiteDwarfHalo,
          }
      );
      
      const whiteDwarfHaloMesh = new THREE.Mesh(whiteDwarfGeometry, whiteDwarfHaloMaterial);
      whiteDwarfHaloMesh.position.set(-600, 0, -5000);
      whiteDwarfHaloMesh.scale.setScalar(5);
      whiteDwarfGroup.add(whiteDwarfHaloMesh);

      const whiteDwarfLight = new THREE.DirectionalLight(0xB1D8FF, 2.5);
      whiteDwarfLight.position.set(-100, 200, -300);
      mainGroup.add(whiteDwarfLight);

      mainGroup.add(whiteDwarfGroup);
      scene.add(mainGroup);

      return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, whiteDwarfMesh, whiteDwarfShadyMaterial, whiteDwarfShadyMesh, whiteDwarfShadingMaterial, whiteDwarfShadingMesh, fresnelwhiteDwarfMesh, whiteDwarfLight, moonMesh, orbitRadius, stars};
    }
    else if (starType == 2)
    {
      const redGiantGroup = new THREE.Group();
    
      const redGiantGeometry = new THREE.IcosahedronGeometry(5000, 12);
      const redGiantMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const redGiantMesh = new THREE.Mesh(redGiantGeometry, redGiantMaterial);
      redGiantMesh.position.set(0, 0, -10000);
      redGiantGroup.add(redGiantMesh);

      const redGiantShadyMaterial = new THREE.ShaderMaterial(
      {
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          uniforms: 
          {
            time: {value: 0},
            resolution: { value: new THREE.Vector4() },
          },
          vertexShader: vertexSunShader,
          fragmentShader: fragmentRedGiantShader,
      });
      const redGiantShadyMesh = new THREE.Mesh(redGiantGeometry, redGiantShadyMaterial);
      redGiantShadyMesh.position.set(0, 0, -10000);
      redGiantGroup.add(redGiantShadyMesh);

      const fresnelRedGiantMaterial = getFresnelRedGiant();
      const fresnelRedGiantMesh = new THREE.Mesh(redGiantGeometry, fresnelRedGiantMaterial);
      fresnelRedGiantMesh.position.set(0, 0, -10000);
      redGiantGroup.add(fresnelRedGiantMesh);

      const redGiantShadingMaterial = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            uniforms: 
            {
              time: {value: 0},
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertexSunShader,
            fragmentShader: fragmentRedGiantShading,
        });
        const redGiantShadingMesh = new THREE.Mesh(redGiantGeometry, redGiantShadingMaterial);
        redGiantShadingMesh.position.set(0, 0, -10000);
        redGiantGroup.add(redGiantShadingMesh);

        const redGiantHaloMaterial = new THREE.ShaderMaterial(
          {
              side: THREE.BackSide,
              blending: THREE.AdditiveBlending,
              uniforms: 
              {
                  time: {value: 0},
                  resolution: { value: new THREE.Vector4() },
              },
              transparent: true,
              vertexShader: vertexSunShader,
              fragmentShader: fragmentRedGiantHalo,
          }
      );
      
      const redGiantHaloMesh = new THREE.Mesh(redGiantGeometry, redGiantHaloMaterial);
      redGiantHaloMesh.position.set(0, 0, -10000);
      redGiantHaloMesh.scale.setScalar(1.5);
      redGiantGroup.add(redGiantHaloMesh);

      const redGiantLight = new THREE.DirectionalLight(0xFFC2C2, 2.5);
      redGiantLight.position.set(-100, 200, -300);
      mainGroup.add(redGiantLight);

      mainGroup.add(redGiantGroup);
      scene.add(mainGroup);
      return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, redGiantMesh, redGiantShadyMaterial, redGiantShadyMesh, redGiantShadingMaterial, redGiantShadingMesh, fresnelRedGiantMesh, redGiantLight, moonMesh, orbitRadius, stars};
    }
    else if (starType == 3)
      {
        const BHColor = hexToRGB(customColor)
        const blackHoleGroup = new THREE.Group();
      
        const blackHoleGeometry = new THREE.IcosahedronGeometry(1, 12);
        const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const blackHoleMesh = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial);
        blackHoleMesh.position.set(0, 0, 0);
        // blackHoleGroup.add(blackHoleMesh);

        const blackHoleGLensMaterial = new THREE.ShaderMaterial({
          vertexShader: vertexBlackHoleShader,
          fragmentShader: fragmentBlackHoleShader,
          uniforms: {
              iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
              ucameraPosition: { value: new THREE.Vector3() },
              cameraDirection: { value: new THREE.Vector3() },
              color: {value: BHColor},
              customSize: { value: customRadius },
              customIntensity: {value: customIntensity},
              iTime: { value: 0.0 }
          },
          side: THREE.DoubleSide,
          transparent: true,
        });
      const blackHoleGLensMesh = new THREE.Mesh(blackHoleGeometry, blackHoleGLensMaterial);
      blackHoleGLensMesh.position.set(0, 0, 0);
      blackHoleGLensMesh.scale.setScalar(3800);
      blackHoleGroup.add(blackHoleGLensMesh);
  
        const blackHoleLight = new THREE.DirectionalLight(0xffffff, 2.5);
        blackHoleLight.position.set(-100, 200, -300);
        mainGroup.add(blackHoleLight);

        const photonSphereMaterial = new THREE.ShaderMaterial({
          vertexShader: photonSphereVertexShader,
          fragmentShader: photonSphereFragmentShader,
          uniforms: {
              blackHolePosition: { value: blackHoleMesh.position },
              photonSphereRadius: { value: blackHoleGeometry.parameters.radius},
          },
          side: THREE.DoubleSide,
          transparent: true,
      });
      
      // Create the photon sphere mesh
      const photonSphereGeometry = new THREE.SphereGeometry(blackHoleGeometry.parameters.radius, 32, 32); // Adjust radius and segments as needed
      const photonSphereMesh = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial);
      photonSphereMesh.position.set(0, 0, 0);
      // photonSphereMesh.scale.setScalar(3800 * 0.9);

        // blackHoleGroup.add(photonSphereMesh);
        mainGroup.add(blackHoleGroup);
        scene.add(mainGroup);
        return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, blackHoleMesh, blackHoleGLensMesh, blackHoleGLensMaterial, blackHoleLight,  moonMesh, orbitRadius, stars}; // blackHoleGLensMaterial, blackHoleGLensMesh, blackHoleShadingMaterial, blackHoleShadingMesh, fresnelblackHoleMesh
      }
      else if (starType == 4)
      {
        const starColor = hexToRGB(customColor);
        const distance = 5000 + customRadius * 2.5;
        const customGroup = new THREE.Group();
    
        const customGeometry = new THREE.IcosahedronGeometry(customRadius, 12);
        const customMaterial = new THREE.MeshBasicMaterial({ color: customColor });
        const customMesh = new THREE.Mesh(customGeometry, customMaterial);
        customMesh.position.set(0, 150, -distance);
        customGroup.add(customMesh);

        const customShadyMaterial = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            uniforms: 
            {
              time: {value: 0},
              intensity: {value: customIntensity},
              color: {value: starColor},
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertexSunShader,
            fragmentShader: fragmentCustomShader,
        });
        const customShadyMesh = new THREE.Mesh(customGeometry, customShadyMaterial);
        customShadyMesh.position.set(0, 150, -distance);
        customGroup.add(customShadyMesh);

        const fresnelCustomMaterial = getFresnelCustomMat(customColor, customIntensity);
        const fresnelCustomMesh = new THREE.Mesh(customGeometry, fresnelCustomMaterial);
        fresnelCustomMesh.position.set(0, 150, -distance);
        customGroup.add(fresnelCustomMesh);

        const customShadingMaterial = new THREE.ShaderMaterial(
        {
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            uniforms: 
            {
              time: {value: 0},
              intensity: {value: customIntensity},
              color: {value: starColor},
              resolution: { value: new THREE.Vector4() },
            },
            vertexShader: vertexSunShader,
            fragmentShader: fragmentCustomShading,
        });
        const customShadingMesh = new THREE.Mesh(customGeometry, customShadingMaterial);
        customShadingMesh.position.set(0, 150, -distance);
        customGroup.add(customShadingMesh);
        let customHaloMaterial;
        if (customCorona == 1)
        {
          customHaloMaterial = new THREE.ShaderMaterial(
            {
                blending: THREE.AdditiveBlending,
                uniforms: {
                  iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                  iTime: { value: 0 },
                  intensity: { value: customIntensity },
                  color: { value: starColor }, // example star color
                  ucameraPosition: {value: new THREE.Vector3()}
              },
                depthTest: true,
                depthWrite: true,
                transparent: false,
                vertexShader: vertexHalo,
                fragmentShader: fragmentCustomHalo,
                side: THREE.BackSide,
            }
          );
        }
        else if (customCorona == 2)
        {
          customHaloMaterial = new THREE.ShaderMaterial(
            {
                blending: THREE.AdditiveBlending,
                uniforms: {
                  iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                  iTime: { value: 0 },
                  intensity: { value: customIntensity },
                  color: { value: starColor }, // example star color
                  ucameraPosition: {value: new THREE.Vector3()}
              },
                depthTest: true,
                depthWrite: true,
                transparent: false,
                vertexShader: vertexHalo,
                fragmentShader: fragmentSecondCustomHalo,
                side: THREE.BackSide,
            }
          );
        }
          
        const customHaloMesh = new THREE.Mesh(customGeometry, customHaloMaterial);
        customHaloMesh.position.set(0, 150, -distance);
        if (customIntensity < 4)
          customHaloMesh.scale.setScalar(1.0 + customIntensity * 0.05);
        else
          customHaloMesh.scale.setScalar(1.0 + customIntensity * 0.15);
        if (customCorona != 0)
          customGroup.add(customHaloMesh);

        const customLight = new THREE.DirectionalLight(customColor, customIntensity * 2.0);
        customLight.position.set(-100, 200, -300);
        mainGroup.add(customLight);

        mainGroup.add(customGroup);
        scene.add(mainGroup);

        return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, customMesh, customShadyMaterial, customShadyMesh, customShadingMaterial, customShadingMesh, fresnelCustomMesh, customHaloMesh, customHaloMaterial, customLight, moonMesh, orbitRadius, stars};
      }
      

    // sunLight.shadow.mapSize.width = 10000;
    // sunLight.shadow.mapSize.height = 10000;

    // // Set up shadow properties for the light
    // sunLight.shadow.camera.near = 0.5;
    // sunLight.shadow.camera.far = 10000;
    // sunLight.shadow.camera.left = -100;
    // sunLight.shadow.camera.right = 100;
    // sunLight.shadow.camera.top = 100;
    // sunLight.shadow.camera.bottom = -100;

    // scene.add(sunGroup);

    // Position the sunGroup in the scene

    // return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, customMesh, customShadyMaterial, customShadyMesh, customShadingMaterial, customShadingMesh, fresnelcustomMesh, blackHoleMesh, blackHoleGLensMaterial, blackHoleGLensMesh, blackHoleShadingMaterial, blackHoleShadingMesh, fresnelblackHoleMesh, sunLight, moonMesh, orbitRadius, stars};
}

export default setSolarySystem