import * as THREE from "./node_modules/three/src/Three.js";
import { Vector, vectorize, normalizeVector, vecAdd, vecSubtract, dot, crossProduct, scalarProduct, reflectVector } from './vector_utils.js';


export function checkSun(camera, sunMesh, stars)
{
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const sunDirection = new THREE.Vector3().subVectors(sunMesh.position, camera.position).normalize();

    const angle = cameraDirection.angleTo(sunDirection);

    // Adjust stars opacity based on the angle
    const maxAngle = Math.PI / 3;
    const opacity = THREE.MathUtils.clamp(angle / maxAngle, 0, 1);

    stars.material.opacity = opacity;
}

function setStarfield(scene)
{
    // Create a star field
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, transparent: true });

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

export function setScene()
{
    // Create a scene
    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    // const textureLoaderScene = new THREE.TextureLoader().load('./space.jpg');
    scene.background = new THREE.Color(0x000000);

    // Create a camera, which determines what we'll see when we render the scene
    const camera = new THREE.PerspectiveCamera(
        90, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near clipping plane
        10000 // Far clipping plane
    );

    // Position the camera to look over the Pong game
    camera.position.set(0, 20, -65);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Create a renderer and add it to the DOM
    const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);

    // Add ambient light (provides a base level of light to the scene)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Color, intensity
    scene.add(ambientLight);

    const earthGroup = new THREE.Group();
    earthGroup.rotation.z = -23.4 * Math.PI / 180;
    const earthGeometry = new THREE.IcosahedronGeometry(300, 12);
    const earthMaterial = new THREE.MeshStandardMaterial({map: textureLoader.load("./earthmap1k.jpg")});
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    earthMesh.position.set(600, 300, 1400);
    // earthMesh.position.set(0, 0, 0);
    earthGroup.add(earthMesh);

    const lightMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("./earthByNight.jpg"), blending: THREE.AdditiveBlending });
    const lightsMesh = new THREE.Mesh(earthGeometry, lightMaterial);
    earthGroup.add(lightsMesh);
    scene.add(earthGroup);

    const stars = setStarfield(scene);

    // Create the sun geometry
    const sunGeometry = new THREE.IcosahedronGeometry(600, 12); // Radius, detail
    const sunMaterial = new THREE.MeshBasicMaterial({ map: textureLoader.load("sunmap.jpg") }); // Yellow color
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 500, -5000);

    // Create a point light to simulate the sun's light
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 0.6); // Color, intensity
    sunLight.position.set(-600, 500, -2000); // Position it at the center of the sun
    sunLight.castShadow = true;
    // Increase shadow map size for better quality shadows
    sunLight.shadow.mapSize.width = 10000; // Default is 512
    sunLight.shadow.mapSize.height = 10000; // Default is 512

    // Set up shadow properties for the light
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 10000;
    sunLight.shadow.camera.left = -100;
    sunLight.shadow.camera.right = 100;
    sunLight.shadow.camera.top = 100;
    sunLight.shadow.camera.bottom = -100;

    // Optional: create an object to hold the sun and light together
    const sunGroup = new THREE.Group();
    sunGroup.add(sunMesh);
    sunGroup.add(sunLight);

    // Position the sunGroup in the scene
    sunGroup.position.set(-600, 500, -2000);
    scene.add(sunGroup);

    return {scene, camera, renderer, ambientLight, earthMesh, lightsMesh, sunMesh, stars};
}