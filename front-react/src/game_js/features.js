import * as THREE from "./node_modules/three/src/Three.js";

export function setBoosts(scene)
{
    // Speed boost surfaces
    const speedBoostMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent:true, opacity:0.6}); // Blue color for speed boost surfaces
    const speedBoostGeometry = new THREE.BoxGeometry(10, 0.1, 20);

    // Create multiple speed boost surfaces
    const speedBoost1 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial);
    speedBoost1.position.set(15, 0.05, 20);
    speedBoost1.receiveShadow = true;

    scene.add(speedBoost1);

    const speedBoost2 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial);
    speedBoost2.position.set(-15, 0.05, -20);
    speedBoost1.receiveShadow = true;
    scene.add(speedBoost2);

    return {speedBoostGeometry, speedBoost1, speedBoost2};
}

function animateShockwave(shockwave, scene)
{
    const initialScale = 1;
    const targetScale = 1.2; // Example: Scale up to 10 times the initial size

    const animationDuration = 1000; // Animation duration in milliseconds
    const startTime = Date.now();

    function animateWave()
    {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        // if (!flag)
            shockwave.scale.set(initialScale + (targetScale - initialScale) * progress, initialScale + (targetScale - initialScale) * progress, 1);
        // else
        //     shockwave.scale.set(initialScale + (targetScale - initialScale) * progress, initialScale + (targetScale - initialScale) * progress, -1);
        if (progress < 1)
            requestAnimationFrame(animateWave);
        else
            scene.remove(shockwave); // Remove shockwave after animation completes   
    }
    animateWave();
}

export function shockWave(scene, contactPoint)
{
    const textureLoad = new THREE.TextureLoader();
    const texture = textureLoad.load("./scoring.jpeg");
    const geometry = new THREE.PlaneGeometry(10, 4);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        // transparent: true,
        // opacity: 0.6,
        side: THREE.DoubleSide,
        depthTest: true // Ensure it renders over everything

    });

    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(contactPoint);
    scene.add(shockwave);

    animateShockwave(shockwave, scene);
}