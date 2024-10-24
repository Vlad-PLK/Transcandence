import * as THREE from 'three';

function setBoosts(scene)
{
    const textureLoader = new THREE.TextureLoader();
    const boostTexture1 = textureLoader.load('../../public/booster-image.png');
    const boostTexture2 = textureLoader.load('../../public/booster-image.png');

    boostTexture1.rotation = Math.PI / 2;
    boostTexture1.center.set(0.5, 0.5);

    boostTexture2.rotation = -Math.PI / 2;
    boostTexture2.center.set(0.5, 0.5);
    const speedBoostMaterial1 = new THREE.MeshStandardMaterial({ map: boostTexture1 });
    const speedBoostMaterial2 = new THREE.MeshStandardMaterial({ map: boostTexture2 });
    const speedBoostGeometry = new THREE.BoxGeometry(20, 0.1, 40);
    
    // Create multiple speed boost surfaces
    const speedBoost1 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial1);
    speedBoost1.position.set(15, 0, 50);
    //speedBoost1.receiveShadow = true;
    //speedBoost1.castShadow = true;
    scene.add(speedBoost1);

    const speedBoost2 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial2);
    speedBoost2.position.set(-15, 0, -50);
    //speedBoost1.receiveShadow = true;
    //speedBoost1.castShadow = true;
    scene.add(speedBoost2);

    return {speedBoostGeometry, speedBoost1, speedBoost2};
}

export default setBoosts
