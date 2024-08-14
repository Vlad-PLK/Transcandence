import * as THREE from 'three';

function setRenderer(renderer)
{
    // Create a renderer and add it to the DOM
    // !!! change width and height to static values //
    renderer.setSize(window.innerWidth80, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
}

export default setRenderer
