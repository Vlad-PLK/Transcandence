import * as THREE from 'three';

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
        alphaMap: textureLoader.load('./earthcloudmaptrans.jpg')
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
    const sunMaterial = new THREE.MeshBasicMaterial({map: textureLoader.load("sunmap.jpg")});
    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    sunMesh.position.set(-600, 200, -5000);

    // Create a point light to simulate the sun's light
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 3); // Color, intensity
    sunLight.castShadow = true;
    sunLight.position.set(-400, 500, -2000);

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
    mainGroup.add(sunGroup);

    // Position the sunGroup in the scene
    scene.add(mainGroup);

    return {earthMesh, lightsMesh, sunMesh, moonMesh, orbitRadius, stars};
}

export default setSolarySystem