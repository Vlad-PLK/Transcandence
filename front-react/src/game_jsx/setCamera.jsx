import * as THREE from 'three';

function setCamera(camera, cameraDirection)
{
    // Position the camera to look over the Pong game
    camera.position.set(0, 20, -80);
    camera.lookAt(0, 0, 0); // Look at the center of the scene
    camera.getWorldDirection(cameraDirection);
}

export default setCamera