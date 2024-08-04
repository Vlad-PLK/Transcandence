import * as THREE from 'three';

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

export function animateShockwave(shockwave, scene)
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
