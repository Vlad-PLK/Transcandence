import * as THREE from 'three';
import  { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"

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

// import { getFresnelRedGiantMat } from "../shaders/getFresnelRedGiantMat.js";
import fragmentRedGiantShader from '../shaders/fragmentRedGiant.js';
import fragmentRedGiantShading from '../shaders/fragmentRedGiantShader.js'
import fragmentRedGiantHalo from '../shaders/fragmentRedGiantHalo.js';
function setStarfield(scene)
{
  // Create a star field
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

  // Parameters
  const starCount = 10000;
  const spread = 20000;
  const exclusionRadius = 10000; // Stars won't spawn within this distance from the origin

  const starVertices = [];
  
  for (let i = 0; i < starCount; i++) {
    let x, y, z, distance;
    
    // Repeat until the star is outside the exclusion radius
    do {
      x = THREE.MathUtils.randFloatSpread(spread);
      y = THREE.MathUtils.randFloatSpread(spread);
      z = THREE.MathUtils.randFloatSpread(spread);
      
      // Calculate the distance from the origin
      distance = Math.sqrt(x * x + y * y + z * z);
      
    } 
    while (distance < exclusionRadius);

    // Add the valid star position to the array
    starVertices.push(x, y, z);
  }

  // Set the star positions as attributes in the geometry
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  // Create the star Points object
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  return stars;
}

function setSolarySystem(scene, camera, renderer, textureLoader)
{
    const mainGroup = new THREE.Group();

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    scene.add(earthGroup);
    new OrbitControls(camera, renderer.domElement);
    const earthGeometry = new THREE.IcosahedronGeometry(300, 12);
    const bumpMapEarth = textureLoader.load("../../public/earthbump1k.jpg");
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("../../public/earthmap1k.jpg"),
        bumpMap: bumpMapEarth,
        bumpScale: 7,
      });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(200, 0, 1400);
    earthGroup.add(earthMesh);

    const lightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.4,
      map: textureLoader.load("../../public/earthByNight.jpg"),
      blending: THREE.AdditiveBlending,
      });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    lightsMesh.position.set(200, 0, 1400);
    lightsMesh.scale.setScalar(1.0000001);
    earthGroup.add(lightsMesh);

    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("../../public/Clouds.png"),
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

    // Create the moon mesh and add it to the moon's orbit group
    const moonGeometry = new THREE.IcosahedronGeometry(82, 12);
    const bumpMapMoon = textureLoader.load("./moonbump2k.jpg");
    const moonMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("../../public/moonmap2k.jpg"), bumpMap: bumpMapMoon,
    bumpScale: 1});
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    const orbitRadius = 500; // Distance from the Earth mesh
    moonMesh.position.set(earthMesh.position.x + orbitRadius, earthMesh.position.y, earthMesh.position.z);
    mainGroup.add(moonMesh);


    const stars = setStarfield(scene);


    const sunGroup = new THREE.Group();
    
    // Create the sun geometry
    const sunGeometry = new THREE.IcosahedronGeometry(850, 12); // Radius, detail
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

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2.5); // Lower intensity
    sunLight.position.set(-100, 200, -300);
    mainGroup.add(sunLight);
    // mainGroup.add(sunGroup);
    






    const whiteDwarfGroup = new THREE.Group();
    
    // Create the whiteDwarf geometry
    const whiteDwarfGeometry = new THREE.IcosahedronGeometry(150, 12); // Radius, detail
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

    mainGroup.add(whiteDwarfGroup);








    const redGiantGroup = new THREE.Group();
    
    // Create the redGiant geometry
    const redGiantGeometry = new THREE.IcosahedronGeometry(5000, 12); // Radius, detail
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

    const fresnelRedGiantMaterial = getFresnelEarthMat();
    const fresnelRedGiantMesh = new THREE.Mesh(redGiantGeometry, fresnelRedGiantMaterial);
    fresnelRedGiantMesh.position.set(0, 0, -10000);
    // redGiantGroup.add(fresnelRedGiantMesh);

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

    // mainGroup.add(redGiantGroup);  

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
    scene.add(mainGroup);

    return {earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, whiteDwarfMesh, whiteDwarfShadyMaterial, whiteDwarfShadyMesh, whiteDwarfShadingMaterial, whiteDwarfShadingMesh, fresnelwhiteDwarfMesh, redGiantMesh, redGiantShadyMaterial, redGiantShadyMesh, redGiantShadingMaterial, redGiantShadingMesh, fresnelRedGiantMesh, sunLight, moonMesh, orbitRadius, stars};
}

export default setSolarySystem