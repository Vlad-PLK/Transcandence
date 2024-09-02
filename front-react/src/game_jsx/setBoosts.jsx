import * as THREE from 'three';

function setBoosts(scene)
{
    // Speed boost surfaces
    const speedBoostMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, transparent:true, opacity: 0.5}); // Blue color for speed boost surfaces
    const speedBoostGeometry = new THREE.BoxGeometry(10, 0.1, 20);

    // Create multiple speed boost surfaces
    const speedBoost1 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial);
    speedBoost1.position.set(15, 0, 20);
    //speedBoost1.receiveShadow = true;
    //speedBoost1.castShadow = true;
    scene.add(speedBoost1);

    const speedBoost2 = new THREE.Mesh(speedBoostGeometry, speedBoostMaterial);
    speedBoost2.position.set(-15, 0, -20);
    //speedBoost1.receiveShadow = true;
    //speedBoost1.castShadow = true;
    scene.add(speedBoost2);

    return {speedBoostGeometry, speedBoost1, speedBoost2};
}

export default setBoosts
