import * as THREE from 'three';
import  { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
// import fresnelShader from './fresnelEffect.jsx';
import vertexEarthShader from './vertexEarth.js';
import fragmentEarthShader from './fragmentEarth.js';
import { getFresnelMat } from "../game_js/getFresnelMat.js";
import vertexSunShader from './vertexSun.js';
import fragmentSunShader from './fragmentSun.js';


function setStarfield(scene) {
  // Create a star field
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

  // Generate random star positions
  const starCount = 10000;
  const spread = 20000;
  const starVertices = [];
  for (let i = 0; i < starCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(spread);
      const y = THREE.MathUtils.randFloatSpread(spread);
      const z = THREE.MathUtils.randFloatSpread(spread);
      starVertices.push(x, y, z);
  }
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
  return (stars);
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
    // const roughnessMapEarth = "../../public/Ocean.png";
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
      // map: textureLoader.load("../../public/night_lights_modified.png"),
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
        // alphaMap: textureLoader.load('../../public/earthcloudmaptrans.jpg')
      });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudMaterial);
    cloudsMesh.position.set(200, 0, 1400);
    cloudsMesh.scale.setScalar(1.008);
    earthGroup.add(cloudsMesh);

    const fresnelMaterial = getFresnelMat();
    const fresnelMesh = new THREE.Mesh(earthGeometry, fresnelMaterial);
    fresnelMesh.position.set(200, 0, 1400);
    fresnelMesh.scale.setScalar(1.015);
    earthGroup.add(fresnelMesh);

    // fresnelShader.uniforms.earthPosition.value = earthMesh.position.clone();  // Set Earth position in shader

    const atmoMaterial = new THREE.ShaderMaterial(
    {
      vertexShader: vertexEarthShader,
      fragmentShader: fragmentEarthShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide // such that it does not overlays on top of the earth; this points the normal in opposite direction in vertex shader
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
    const sunGeometry = new THREE.IcosahedronGeometry(600, 12); // Radius, detail
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 200, -5000);

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
    sunShadyMesh.position.set(-600, 200, -5000);
    sunGroup.add(sunShadyMesh);
    

    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2); // Lower intensity
    sunLight.position.set(-100, 200, -300);

    // sunLight.shadow.mapSize.width = 10000;
    // sunLight.shadow.mapSize.height = 10000;

    // // Set up shadow properties for the light
    // sunLight.shadow.camera.near = 0.5;
    // sunLight.shadow.camera.far = 10000;
    // sunLight.shadow.camera.left = -100;
    // sunLight.shadow.camera.right = 100;
    // sunLight.shadow.camera.top = 100;
    // sunLight.shadow.camera.bottom = -100;

    // Optional: create an object to hold the sun and light together

    sunGroup.add(sunMesh);
    
    sunGroup.add(sunLight);
    // scene.add(sunGroup);
    mainGroup.add(sunGroup);

    // Position the sunGroup in the scene
    scene.add(mainGroup);

    return {earthMesh, lightsMesh, cloudsMesh, fresnelMesh, sunMesh, sunShadyMaterial, sunShadyMesh, moonMesh, orbitRadius, stars};
}

export default setSolarySystem