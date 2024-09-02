import * as THREE from 'three';

function setRenderer(renderer)
{
    // Create a renderer and add it to the DOM
    // !!! change width and height to static values //
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    document.body.appendChild(renderer.domElement);
}

export default setRenderer
