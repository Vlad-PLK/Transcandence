import * as THREE from 'three';
import { reflectVector } from '../game_js/vector_utils';

function calculateCollisionNormal(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry)
{
    console.log("calcul");
    const radius = sphereGeometry.parameters.radius;

    // Check collision with left vertical wall
    if (sphere.position.x - radius <= -planeGeometry.parameters.width / 2)
        return { normal: new THREE.Vector3(1, 0, 0).normalize(), flag: 1 };
    
    // Check collision with right vertical wall
    if (sphere.position.x + radius >= planeGeometry.parameters.width / 2)
        return { normal: new THREE.Vector3(-1, 0, 0).normalize(), flag: 2 };

    // Check collision with bottom paddle
    if (sphere.position.z - radius <= bottomPaddle.position.z + bottomPaddle.geometry.parameters.depth / 2 &&
        sphere.position.x >= bottomPaddle.position.x - (bottomPaddle.geometry.parameters.width / 2) - 2 &&
        sphere.position.x <= bottomPaddle.position.x + (bottomPaddle.geometry.parameters.width / 2) + 2)
    {
        return { normal: new THREE.Vector3(0, 0, 1).normalize(), flag: 3 };
    }

    // Check collision with top paddle
    if (sphere.position.z + radius >= topPaddle.position.z - topPaddle.geometry.parameters.depth / 2 &&
        sphere.position.x >= topPaddle.position.x - (topPaddle.geometry.parameters.width / 2) - 2 &&
        sphere.position.x <= topPaddle.position.x + (topPaddle.geometry.parameters.width / 2) + 2)
    {
        return { normal: new THREE.Vector3(0, 0, -1).normalize(), flag: 4 };
    }

    // Default normal (no collision)
    return { normal: null, flag: 0};
}

function resetSphere(sphere, sphereGeometry)
{
    // Reset ball position to the center of the plane with no speed
    console.log("resetSphere");
    velocity = vectorize(0, 0, 0);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);

    // Delay changing the velocity by 3 seconds
    setTimeout(() =>
    {
        // Generate a random angle between π/4 and 3π/4, or between 5π/4 and 7π/4
        let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
        velocity.x = Math.cos(randomAngle);
        velocity.z = Math.sin(randomAngle);
    }, 3000);
    
}

function shockWave(scene, contactPoint)
{
    const textureLoad = new THREE.TextureLoader();
    const texture = textureLoad.load("./scoring.jpeg");
    const geometry = new THREE.PlaneGeometry(10, 4);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        // transparent: true,
        // opacity: 0.6,
        side: THREE.DoubleSide,
        depthTest: true // Ensure it renders over everything

    });

    const shockwave = new THREE.Mesh(geometry, material);
    shockwave.position.copy(contactPoint);
    scene.add(shockwave);

    animateShockwave(shockwave, scene);
}

function checkCollision(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry, paddle1Left, paddle1Right, paddle2Left, paddle2Right, velocity, bottomWall, topWall, scene)
{
    const { normal, flag } = calculateCollisionNormal(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry);

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
        velocity = reflectVector(velocity, normal);
    }
    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        shockWave(scene, contactPoint);
        // player1Score += 1;
        // player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
        resetSphere(sphere, sphereGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        shockWave(scene, contactPoint);
        // player2Score += 1;
        // player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
        resetSphere(sphere, sphereGeometry);
    }
}

export default checkCollision