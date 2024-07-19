import * as THREE from 'three';

let cameraKeyIsPressed = false;
let paddle1Right = false;
let paddle1Left = false;
let paddle2Right = false;
let paddle2Left = false;

function updateKey()
{
    if (keyboardState['d'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + bottomPaddleGeometry.parameters.width / 2)
        {
            bottomPaddle.position.x -= 1;
            paddle1Right = true;
        }
    }
    else if (keyboardState['q'])
    {
        // Move left paddle right
        if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - bottomPaddleGeometry.parameters.width / 2)
        {
            bottomPaddle.position.x += 1;
            paddle1Left = true
        }
    }
    else if (keyboardState['m'])
    {
        // Move right paddle left
        if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + topPaddleGeometry.parameters.width / 2)
        {
            topPaddle.position.x -= 1;
            paddle2Right = true;
        }
    }
    else if (keyboardState['k'])
    {
        // Move right paddle right
        if (topPaddle.position.x < planeGeometry.parameters.width / 2 - topPaddleGeometry.parameters.width / 2)
        {
            topPaddle.position.x += 1;
            paddle2Left = true
        }    
    }
    else if (keyboardState['c'])
    {
        // Check if 'c' key is pressed and wasn't already handled
        if (!cameraKeyIsPressed)
        {
            if (cameraPosition > 4)
                cameraPosition = 0;
            // Toggle camera position based on cameraPosition flag
            if (cameraPosition == 0)
            {
                camera.position.set(0, 20, -80);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 1)
            {
                camera.position.set(0, 40, -130);
            }
            else if (cameraPosition == 2)
            {
                camera.position.set(0, 20, 80);
                camera.lookAt(0, 0, 0);
            }
            else if (cameraPosition == 3)
            {
                camera.position.set(0, 40, 130);
            }
            else if (cameraPosition == 4)
            {
                camera.position.set(0, 120, 0); // Place the camera above the scene
                camera.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
            }
            checkSun(camera, sunMesh, stars);
            ++cameraPosition;   
            // Set flag to true to prevent multiple toggles in rapid succession
            cameraKeyIsPressed = true;
        }
    }
    else
    {   
        cameraKeyIsPressed = false;
        paddle1Right = false;
        paddle1Left = false;
        paddle2Right = false;
        paddle2Left = false;
    }
}