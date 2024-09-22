import * as THREE from 'three';

export default function setRenderer(renderer)
{
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.2);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    document.body.appendChild(renderer.domElement);
}

export function setRendererTarget(renderer)
{
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.2);
    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    // document.body.appendChild(renderer.domElement);
}