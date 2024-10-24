import * as THREE from 'three';

function setCamera(camera, cameraDirection)
{
    // Position the camera to look over the Pong game
    camera.position.set(Math.PI / 2, 175, 0);
    camera.getWorldDirection(cameraDirection);
}

export default setCamera
