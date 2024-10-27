function updateKey(keyboardState, bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry,  
    planeGeometry, cameraKeyIsPressed, paddle1Left, paddle1Right, 
    paddle2Left, paddle2Right, camera, cameraPosition, streakPowerIsPressed, streakPower)
{

    if (keyboardState['d'] || keyboardState['a'] || keyboardState['6'] || keyboardState['4'] || keyboardState['8'] || keyboardState['5'] || keyboardState['w'] || keyboardState['s'] || keyboardState['c'])
    {
        if (cameraPosition == 1 || cameraPosition == 2)
        {
            if (keyboardState['6'])
            {
                // Move white paddle right
                if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x -= 1;
                    paddle1Right = true;
                }
            }
            else if (keyboardState['4'])
            {
                // Move white paddle left
                if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x += 1;
                    paddle1Left = true
                }
            }
            if (keyboardState['d'])
            {
                // Move black paddle right
                if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x -= 1;
                    paddle2Right = true;
                }
            }
            else if (keyboardState['a'])
            {
                // Move black paddle left
                if (topPaddle.position.x < planeGeometry.parameters.width / 2 - topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x += 1;
                    paddle2Left = true
                }    
            }
        }
        else if (cameraPosition == 3 || cameraPosition == 4)
        {
            if (keyboardState['4'])
            {
                // Move white paddle left
                if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x -= 1;
                    paddle1Right = true;
                }
            }
            else if (keyboardState['6'])
            {
                // Move white paddle right
                if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x += 1;
                    paddle1Left = true
                }
            }
            if (keyboardState['a'])
            {
                // Move black paddle left
                if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x -= 1;
                    paddle2Right = true;
                }
            }
            else if (keyboardState['d'])
            {
                // Move black paddle right
                if (topPaddle.position.x < planeGeometry.parameters.width / 2 - topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x += 1;
                    paddle2Left = true
                }    
            }
        }
        else if (cameraPosition == 0 || cameraPosition == 5)
        {
            if (keyboardState['8'])
            {
                // Move white paddle up
                if (bottomPaddle.position.x > -planeGeometry.parameters.width / 2 + bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x -= 1;
                    paddle1Right = true;
                }
            }
            else if (keyboardState['5'])
            {
                // Move white paddle down
                if (bottomPaddle.position.x < planeGeometry.parameters.width / 2 - bottomPaddleGeometry.parameters.width / 2)
                {
                    bottomPaddle.position.x += 1;
                    paddle1Left = true
                }
            }
            if (keyboardState['w'])
            {
                // Move black paddle up
                if (topPaddle.position.x > -planeGeometry.parameters.width / 2 + topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x -= 1;
                    paddle2Right = true;
                }
            }
            else if (keyboardState['s'])
            {
                // Move black paddle down
                if (topPaddle.position.x < planeGeometry.parameters.width / 2 - topPaddleGeometry.parameters.width / 2)
                {
                    topPaddle.position.x += 1;
                    paddle2Left = true
                }    
            }
        }
        if (keyboardState['c'])
        {
            if (!cameraKeyIsPressed)
            {
                if (cameraPosition > 4)
                    cameraPosition = 0;
                if (cameraPosition == 0)
                {
                    camera.position.set(0, 50, -175);
                    camera.lookAt(0, 0, 0);
                }
                else if (cameraPosition == 1)
                {
                    camera.position.set(0, 80, -200);
                    camera.lookAt(0, 0, 0);
                }
                else if (cameraPosition == 2)
                {
                    camera.position.set(0, 50, 175);
                    camera.lookAt(0, 0, 0);
                }
                else if (cameraPosition == 3)
                {
                    camera.position.set(0, 80, 200);
                    camera.lookAt(0, 0, 0);
                }
                else if (cameraPosition == 4)
                {
                    camera.position.set(0, 175, 0); // Place the camera above the scene
                    camera.lookAt(0, 0, 0);
                    camera.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
                    
                }
                cameraPosition += 1;  
                // Set flag to true to prevent multiple toggles in rapid succession
                cameraKeyIsPressed = true;
            }
        }
    }
    else if (keyboardState['r'])
    {
        if (!streakPowerIsPressed && (streakPower == 1 || streakPower == 2))
        {
            // console.log("POWER : ");
            streakPowerIsPressed = true;
        }
    }
    else
    {   
        cameraKeyIsPressed = false;
        paddle1Left = false;
        paddle2Left = false;
        paddle1Right = false;
        paddle2Right = false;
        streakPowerIsPressed = false;
    }
    return {cameraKeyIsPressed, paddle1Left, paddle1Right, paddle2Left, paddle2Right, cameraPosition, streakPowerIsPressed, streakPower, bottomPaddle, topPaddle};
}

export default updateKey