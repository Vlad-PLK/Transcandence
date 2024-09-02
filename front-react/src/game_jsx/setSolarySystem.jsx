import * as THREE from 'three';
import  { OrbitControls } from "../../node_modules/three/examples/jsm/controls/OrbitControls.js"
import { bumpMap, metalness, roughness } from '../../node_modules/three/examples/jsm/nodes/Nodes.js';
import metalnessmap_fragmentGlsl from 'three/src/renderers/shaders/ShaderChunk/metalnessmap_fragment.glsl.js';
// import { getFresnelMat } from "../../public/getFresnelMat.js";

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
        bumpScale: 6,
      });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(200, 0, 1400);
    earthGroup.add(earthMesh);

    // const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    // scene.add(hemiLight);

    const lightMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0.4,
      map: textureLoader.load("../../public/earthByNight.jpg"),
      // map: textureLoader.load("../../public/night_lights_modified.png"),
      blending: THREE.AdditiveBlending,
      });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    lightsMesh.position.set(200, 0, 1400);
    earthGroup.add(lightsMesh);

    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("../../public/Clouds.png"),
        transparent: true,
        // opacity: 0.8,
        blending: THREE.AdditiveBlending,
        // alphaMap: textureLoader.load('../../public/earthcloudmaptrans.jpg')
      });
    const cloudsMesh = new THREE.Mesh(earthGeometry, cloudMaterial);
    cloudsMesh.position.set(200, 0, 1400);
    cloudsMesh.scale.setScalar(1.003);
    earthGroup.add(cloudsMesh);

    mainGroup.add(earthGroup);

    // Create the moon mesh and add it to the moon's orbit group
    const moonGeometry = new THREE.IcosahedronGeometry(82, 12);
    const bumpMapMoon = textureLoader.load("./moonbump2k.jpg");
    const moonMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("../../public/moonmap2k.jpg"), bumpMap: bumpMapMoon,
    bumpScale: 0.1});
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    const orbitRadius = 500; // Distance from the Earth mesh
    moonMesh.position.set(earthMesh.position.x + orbitRadius, earthMesh.position.y, earthMesh.position.z);
    mainGroup.add(moonMesh);


    const stars = setStarfield(scene);

    // Create the sun geometry
    const sunGeometry = new THREE.IcosahedronGeometry(600, 12); // Radius, detail
    const sunMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("../../public/sunmap.jpg")});
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 200, -5000);

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
    const sunGroup = new THREE.Group();
    sunGroup.add(sunMesh);
    sunGroup.add(sunLight);
    scene.add(sunGroup);
    mainGroup.add(sunGroup);

    // Position the sunGroup in the scene
    scene.add(mainGroup);

    return {earthMesh, lightsMesh, cloudsMesh, sunMesh, moonMesh, orbitRadius, stars};
}

export default setSolarySystem