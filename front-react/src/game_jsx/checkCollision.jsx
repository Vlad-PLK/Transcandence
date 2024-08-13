import * as THREE from 'three';
import { calculateCollisionNormal, resetSphere } from './UserGame';
import * as vec from './vectors_functions'
import {paddle1Left, paddle1Right, paddle2Left, paddle2Right, velocity} from './UserGame'

function checkCollision(sphere, sphereGeometry, planeGeometry,
    topPaddle, bottomPaddle, player1Score, player2Score)
{
    const { normal, flag } = calculateCollisionNormal(sphere, sphereGeometry, 
        topPaddle, bottomPaddle, planeGeometry);

    if (normal && flag > 0)
    {
        if (paddle1Left && flag == 3)
        {
            velocity.x += 0.2;
            // velocity.z += 0.1;
        }
        else if (paddle1Right && flag == 3)
        {
            velocity.x -= 0.2;
            // velocity.z += 0.1
        }
        else if (paddle2Left && flag == 4)
        {
            velocity.x += 0.2;
            // velocity.z += 0.1
        }
        else if (paddle2Right && flag == 4)
        {
            velocity.x -= 0.2;
            // velocity.z += 0.1
        }
        velocity = vec.reflectVector(velocity, normal);
    }

    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2 + 0.1)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        shockWave(scene, contactPoint);
        player1Score += 1;
        //player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetSphere(sphere, sphereGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2 - 0.1)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        shockWave(scene, contactPoint);
        player2Score += 1;
        //player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
        resetSphere(sphere, sphereGeometry);
    }
}


export default checkCollision
