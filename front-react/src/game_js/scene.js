import * as THREE from './node_modules/three/src/Three.js';
// import { Lensflare, LensflareElement } from './node_modules/three/examples/jsm/objects/Lensflare.js';
import { Vector, vectorize, normalizeVector, vecAdd, vecSubtract, dot, crossProduct, scalarProduct, reflectVector } from './vector_utils.js';
import { getFresnelMat } from "./getFresnelMat.js";


export function checkSun(camera, sunMesh, stars)
{
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const sunDirection = new THREE.Vector3().subVectors(sunMesh.position, camera.position).normalize();

    const angle = cameraDirection.angleTo(sunDirection);

    // Adjust stars opacity based on the angle
    const maxAngle = Math.PI / 4; // 45 degrees
    const opacity = THREE.MathUtils.clamp(angle / maxAngle, 0, 1);

    stars.material.opacity = opacity;
}

function setStarfield(scene)
{
    // Create a star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });

    // Generate random star positions
    const starCount = 10000;
    const spread = 20000;
    const starVertices = [];
    for (let i = 0; i < starCount; i++)
    {
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

function setScene()
{
    // Create a scene
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    // const textureLoaderScene = new THREE.TextureLoader().load('./space.jpg');
    scene.background = new THREE.Color(0x000000);

    return {scene, textureLoader};
}

function setCamera()
{
    // Create a camera, which determines what we'll see when we render the scene
    const camera = new THREE.PerspectiveCamera(
        45, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        8000 // Far clipping plane
    );

    // Position the camera to look over the Pong game
    camera.position.set(0, 20, -80);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    return (camera);
}

function setRenderer()
{
    // Create a renderer and add it to the DOM
    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    document.body.appendChild(renderer.domElement);

    return (renderer);
}

function setAmbient(scene)
{
    // Add ambient light (provides a base level of light to the scene)
    const ambientLight = new THREE.AmbientLight(0x404040, 3.5); // Color, intensity
    scene.add(ambientLight);

    return (ambientLight);
}

function setSolarySystem(scene, textureLoader)
{
    const mainGroup = new THREE.Group();

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    const earthGeometry = new THREE.IcosahedronGeometry(300, 12);
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("./earthmap1k.jpg"),
        specularMap: textureLoader.load("./earthspec1k.jpg"),
        bumpMap: textureLoader.load("./earthbump1k.jpg"),
        bumpScale: 0.05,
      });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(200, 0, 1400);
    earthGroup.add(earthMesh);

    const lightMaterial = new THREE.MeshBasicMaterial({
        map: textureLoader.load("./earthByNight.jpg"),
        blending: THREE.AdditiveBlending,
      });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    earthGroup.add(lightsMesh);

    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: textureLoader.load("./earthcloudmap.jpg"),
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: textureLoader.load("./earthcloudmaptrans.jpg")
      });
    const cloudssMesh = new THREE.Mesh(earthGeometry, cloudMaterial);
    earthGroup.add(cloudssMesh);

    mainGroup.add(earthGroup);

    // Create the moon mesh and add it to the moon's orbit group
    const moonGeometry = new THREE.IcosahedronGeometry(82, 12);
    const moonMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("./moonmap2k.jpg"), bumpMap: textureLoader.load("./moonbump2k.jpg"),
    bumpScale: 0.05});
    const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    const orbitRadius = 500; // Distance from the Earth mesh
    moonMesh.position.set(earthMesh.position.x + orbitRadius, earthMesh.position.y, earthMesh.position.z);
    mainGroup.add(moonMesh);

    const stars = setStarfield(scene);

    // Create the sun geometry
    const sunGeometry = new THREE.IcosahedronGeometry(600, 12); // Radius, detail
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("sunmap.jpg") });
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 200, -5000);

    // Create a point light to simulate the sun's light
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 4); // Color, intensity
    sunLight.castShadow = true;
    sunLight.position.set(-200, 1000, -500);

    sunLight.shadow.mapSize.width = 10000;
    sunLight.shadow.mapSize.height = 10000;

    // Set up shadow properties for the light
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    // // Create the lens flare effect
    // const lensflareTexture = textureLoader.load("./sunmapshiny.png");
    // const lensflare = new Lensflare();
    // lensflare.addElement(new LensflareElement(lensflareTexture, 700, 0, sunLight.color));
    // lensflare.addElement(new LensflareElement(lensflareTexture, 60, 0.6));
    // lensflare.addElement(new LensflareElement(lensflareTexture, 70, 0.7));
    // lensflare.addElement(new LensflareElement(lensflareTexture, 120, 0.9));
    // lensflare.addElement(new LensflareElement(lensflareTexture, 70, 1.0));
    // sunLight.add(lensflare);

    // Optional: create an object to hold the sun and light together
    const sunGroup = new THREE.Group();
    sunGroup.add(sunMesh);
    sunGroup.add(sunLight);
    mainGroup.add(sunGroup);

    // Position the sunGroup in the scene
    scene.add(mainGroup);

    return {earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars};
}

export function setAll()
{
    const { scene, textureLoader } = setScene();
    const camera = setCamera();
    const renderer = setRenderer();
    const ambientLight = setAmbient(scene);
    const { earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars } = setSolarySystem(scene, textureLoader);
    
    return { scene, camera, renderer, ambientLight, earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars, textureLoader };
}