import React, { useRef, useEffect, useState, useContext } from 'react';
import * as THREE from '../../node_modules/three/src/Three.js';
import { TTFLoader } from '../../node_modules/three/examples/jsm/loaders/TTFLoader.js';
import { Font, FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';
import Ponderosa_Regular from './Ponderosa_Regular.json'
import setRenderer from './setRenderer.jsx';
import setWalls from './setWalls.jsx';
import setPaddles from './setPaddles.jsx';
import setBoosts from './setBoosts.jsx';
import setSolarySystem from './setSolarySystem.jsx';
import isBallOverBoostSurface from './isBall.jsx';
import setPlane  from './setPlane.jsx';
import updateKey from './updateKey.jsx';
import shockWave from './shockWave.jsx';
import checkSun from './checkSun';
import * as vec from './vectors_functions.jsx'
import { UserDataContext } from '../UserDataContext.jsx';
import { GuestDataContext } from '../GuestDataContext.jsx';
import CustomTimer from './CustomTimer.jsx';
import setCamera from './setCamera.jsx';

let cameraKeyIsPressed = false;
let paddle1Right = false;
let paddle1Left = false;
let paddle2Right = false;
let paddle2Left = false;
let cameraPosition = 0;

let player1Score = 0;
let player2Score = 0;

let boostMultiplier = 1;
let boost1Flag = 0.5; // Initial direction (1 for right, -1 for left)
let boost2Flag = -0.5; // Initial direction (1 for right, -1 for left)

// Define the orbit parameters
const semiMajorAxis = 500; // Semi-major axis in km
const eccentricity = 0.0549; // Orbital eccentricity
const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

const a = semiMajorAxis;
const inclination = 5.145 * Math.PI / 180;
const b = semiMinorAxis

let earthRotationSpeed = 0.005;
let sunRotationSpeed = 0.0002;
let moonOrbitSpeed = earthRotationSpeed / 2
let angle = 0;

let scoreTextMesh = null;

let frameCounter = 0;
let lastTime = performance.now();

const speedBoostSpeed = 0.8;
let velocity = vec.vectorize(0, 0, 0);
let setFlag = 0;

const keyboardState = {};
    
const handleKeyDown = (event) => {
    keyboardState[event.key] = true;
};
const handleKeyUp = (event) => {
    keyboardState[event.key] = false;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function setSphere(scene, sphere, sphereGeometry, setFlag)
{
    // console.log("SETSPHERE");
    // console.log("SETFLAG = ", setFlag);
    if (setFlag == 0)
    {
        // console.log("SETSPHERE 0");
        // Create a sphere
        sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32); // Radius, width segments, height segments
        // const textureLoaderSphere = new THREE.TextureLoader().load('./texture1.jpg');
        const sphereMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF}); // Dark
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, sphereGeometry.parameters.radius, 0);
        //sphere.receiveShadow = true;
        //sphere.castShadow = true; 
        scene.add(sphere);
        setTimeout(() =>
        {
            // Generate a random angle between π/4 and 3π/4, or between 5π/4 and 7π/4
            let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
            velocity.x = Math.cos(randomAngle);
            velocity.z = Math.sin(randomAngle);
        }, 6000);
        setFlag = 1;
    }
    else
    {
        // console.log("SETSPHERE 1");
        sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32); // Radius, width segments, height segments
        // const textureLoaderSphere = new THREE.TextureLoader().load('./texture1.jpg');
        const sphereMaterial = new THREE.MeshStandardMaterial({color:0xFFFFFF}); // Dark
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(0, sphereGeometry.parameters.radius, 0);
        scene.add(sphere);
    }

    return { sphere, sphereGeometry, setFlag};
}

const calculateCollisionNormal = (sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry) =>
    {
        const radius = sphereGeometry.parameters.radius;
    
        if (sphere.position.x - radius <= -planeGeometry.parameters.width / 2) 
            return { normal: new THREE.Vector3(1, 0, 0).normalize(), flag: 1 };
    
        if (sphere.position.x + radius >= planeGeometry.parameters.width / 2)
            return { normal: new THREE.Vector3(-1, 0, 0).normalize(), flag: 2 };
    
        if (sphere.position.z - radius <= bottomPaddle.position.z + bottomPaddle.geometry.parameters.depth / 2 &&
            sphere.position.x >= bottomPaddle.position.x - (bottomPaddle.geometry.parameters.width / 2) - 2 &&
            sphere.position.x <= bottomPaddle.position.x + (bottomPaddle.geometry.parameters.width / 2) + 2)
            return { normal: new THREE.Vector3(0, 0, 1).normalize(), flag: 3 };
    
        if (sphere.position.z + radius >= topPaddle.position.z - topPaddle.geometry.parameters.depth / 2 &&
            sphere.position.x >= topPaddle.position.x - (topPaddle.geometry.parameters.width / 2) - 2 &&
            sphere.position.x <= topPaddle.position.x + (topPaddle.geometry.parameters.width / 2) + 2)
            return { normal: new THREE.Vector3(0, 0, -1).normalize(), flag: 4 };
    
        // Default normal (no collision)
        return { normal: null, flag: 0 };
    };

function resetSphere(scene, sphere, sphereGeometry)
    {
        velocity = vec.vectorize(0, 0, 0);
        sphere.position.set(0, sphereGeometry.parameters.radius, 0);
    
        setTimeout(() =>
        {
            let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
            velocity.x = Math.cos(randomAngle);
            velocity.z = Math.sin(randomAngle);
        }, 6000);
        
    }

function resetPaddles(topPaddle, bottomPaddle, planeGeometry)
{
    topPaddle.position.set(0, 1, planeGeometry.parameters.height / 2 - 1 / 2)
    bottomPaddle.position.set(0, 1, -planeGeometry.parameters.height / 2 + 1 / 2);
}

function createScoreText(player1ID, player2ID, player1Score, player2Score, font, scoreTextMesh, cameraPosition)
{
    const properties =
    {
        font: font,
        size: 4,
        depth: 1,
        curveSegments: 10,
        bevelEnabled: true,
        bevelOffset: 0,
        bevelSegments: 2,
        bevelSize: 0.3,
        bevelThickness: 1
    };

    const scoreText = `${player1ID} ${player1Score} : ${player2Score} ${player2ID}`;
    const textGeometry = new TextGeometry(scoreText, properties);
    textGeometry.computeBoundingBox();
    const boundingBox = textGeometry.boundingBox;
    const centerX = -0.5 * (boundingBox.max.x - boundingBox.min.x);
    const centerY = -0.5 * (boundingBox.max.y - boundingBox.min.y);
    const centerZ = -0.5 * (boundingBox.max.z - boundingBox.min.z);
    textGeometry.translate(centerX, centerY, centerZ);

    const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(0, 10, 0);
    if (cameraPosition == 1 || cameraPosition == 2)
    {
        textMesh.rotation.y = Math.PI;  // 180 degrees
    }
    else if (cameraPosition === 0 || cameraPosition === 5)
    {
        // Rotate the score text to face a camera
        textMesh.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    }
    return textMesh;
}

function updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition)
{
    // Remove the old text mesh if it exists
    if (scoreTextMesh != null)
    {
        scene.remove(scoreTextMesh);
        scoreTextMesh.geometry.dispose();
        scoreTextMesh.material.dispose();
        scoreTextMesh = null;
    }
    // Create a new text mesh for the updated score
    scoreTextMesh = createScoreText(player1ID, player2ID, player1Score, player2Score, font, scoreTextMesh, cameraPosition);
    scene.add(scoreTextMesh);

    // Initialize animation start time
    const animationStartTime = performance.now();

    // Function to handle disappearance of the text
    function animateScoreText()
    {
        let elapsedTime = performance.now() - animationStartTime;
        if (elapsedTime <= 5000)
        {
            requestAnimationFrame(animateScoreText);
        }
        else
        {
            // Hide and clean up the score text after 4 seconds
            scene.remove(scoreTextMesh);
            scoreTextMesh.geometry.dispose();
            scoreTextMesh.material.dispose();
            scoreTextMesh = null; // Clear the reference
        }
    }
    // Start the animation
    animateScoreText();
}



function checkCollision(scene, sphere, sphereGeometry, planeGeometry,
    topPaddle, bottomPaddle, bottomWall, topWall, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, userData, font)
{
    const { normal, flag } = calculateCollisionNormal(sphere, sphereGeometry, 
        topPaddle, bottomPaddle, planeGeometry);

        if (normal != null && flag > 0)
        {
            if (paddle1Left == true && flag == 3)
                velocity.x += 0.2;
            else if (paddle1Right == true && flag == 3)
                velocity.x -= 0.2;
            else if (paddle2Left == true && flag == 4)
                velocity.x += 0.2;
            else if (paddle2Right == true && flag == 4)
                velocity.x -= 0.2;
            velocity = vec.reflectVector(velocity, normal);
        }

    // Check if the sphere goes out of the vertical bounds for scoring
    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2 + 0.01)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        shockWave(scene, contactPoint, planeGeometry);
        player1Score += 1;
        updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition);
        resetSphere(scene, sphere, sphereGeometry);
        resetPaddles(topPaddle, bottomPaddle, planeGeometry);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2 - 0.01)
    {
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        shockWave(scene, contactPoint, planeGeometry);
        player2Score += 1;
        updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition);
        resetSphere(scene, sphere, sphereGeometry);
        resetPaddles(topPaddle, bottomPaddle, planeGeometry);
    }
    return {player1Score, player2Score};
}

function UserGame()
{
    const {userData} = useContext(UserDataContext);
    const {guestData} = useContext(GuestDataContext);
    const animationFrameId = useRef(null);
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);

    useEffect(() => {

    // scene, lights, textures  //
    // scene //
    sceneRef.current = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    sceneRef.current.background = new THREE.Color(0x000000);
    // renderer //
    rendererRef.current = new THREE.WebGLRenderer();
    setRenderer(rendererRef.current);
    mountRef.current.appendChild(rendererRef.current.domElement);
    // ambient light //
    const ambientLight = new THREE.AmbientLight(0x404040, 15); // Color, intensity
    sceneRef.current.add(ambientLight);
    // camera //
    cameraRef.current = new THREE.PerspectiveCamera(
      45,
      (window.innerWidth / 1.5) / (window.innerHeight / 1.2),
      0.1,
      100000
    );
    const cameraDirection = new THREE.Vector3();
    setCamera(cameraRef.current, cameraDirection);
    cameraRef.current.position.set(Math.PI / 2, 100, Math.PI / 10000); // Place the camera above the scene


    const loader = new FontLoader();
    const font = loader.parse(Ponderosa_Regular);

    // Start score
    if (userData)
        updateScoreText(sceneRef.current, font, userData.username, guestData, player1Score, player2Score, scoreTextMesh, cameraPosition);


    // ... Add geometry, materials, lights, etc.
    const planeGeometry = setPlane(sceneRef.current);
    const { leftWall, rightWall, bottomWall, topWall} = setWalls(sceneRef.current, planeGeometry);
    const { bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(sceneRef.current, planeGeometry); 
    const { speedBoostGeometry, speedBoost1, speedBoost2 } = setBoosts(sceneRef.current);
    const { earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, sunLight, moonMesh, orbitRadius, stars } = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader);
    let sphere = null; 
    let sphereGeometry = null;
    ({ sphere, sphereGeometry, setFlag} = setSphere(sceneRef.current, sphere, sphereGeometry, setFlag));
    // const envMap = textureLoader.load("../../public/Gaia_EDR3_darkened.png");
    // envMap.mapping = THREE.EquirectangularReflectionMapping;
    // sceneRef.current.background = envMap;
    

    // animation
    const animate = () =>
    {
        animationFrameId.current = requestAnimationFrame(animate);

        const updatedValues = updateKey(keyboardState, bottomPaddle, topPaddle, bottomPaddleGeometry, 
            topPaddleGeometry, planeGeometry, cameraKeyIsPressed,
            paddle1Left, paddle1Right, paddle2Left, paddle2Right,
            cameraRef.current, cameraPosition, sunMesh, stars);

        ({ cameraKeyIsPressed, paddle1Left, paddle1Right, paddle2Left, paddle2Right, cameraPosition } = updatedValues);

        ({player1Score, player2Score} = checkCollision(sceneRef.current, sphere, sphereGeometry, 
            planeGeometry, topPaddle, bottomPaddle, bottomWall, topWall, userData.username, guestData, player1Score, player2Score, scoreTextMesh, userData, font));
        if (isBallOverBoostSurface(speedBoost1, sphere, sphereGeometry) || isBallOverBoostSurface(speedBoost2, sphere, sphereGeometry))
            boostMultiplier = 2; // Double the ball's speed while over boost surface
        else
            boostMultiplier = 1; // Reset to normal speed if not over boost surface

        speedBoost1.position.x += boost1Flag * speedBoostSpeed;
        speedBoost2.position.x += boost2Flag * speedBoostSpeed;

        // Check if boost surfaces reached the edge of the plane and reverse direction if needed
        if ((speedBoost1.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost1.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
            boost1Flag *= -1; // Reverse direction for speedBoost1

        if ((speedBoost2.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost2.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
            boost2Flag *= -1; // Reverse direction for speedBoost2
        sphere.position.x += velocity.x * boostMultiplier;
        sphere.position.z += velocity.z * boostMultiplier;
        //   rotateSphere(sphere, sphereGeometry, velocity);

        earthMesh.rotation.y += earthRotationSpeed;
        lightsMesh.rotation.y += earthRotationSpeed;
        cloudsMesh.rotation.y += earthRotationSpeed + 0.001;
        fresnelEarthMesh.rotation.y += earthRotationSpeed;
        sunMesh.rotation.y -= sunRotationSpeed;
        sunShadyMesh.rotation.y -= sunRotationSpeed;
        sunShadyMaterial.uniforms.time.value += 0.01;
        sunShadingMesh.rotation.y -= sunRotationSpeed;
        sunShadingMaterial.uniforms.time.value += 0.01;
        fresnelSunMesh.rotation.y -= sunRotationSpeed;
        

        angle += moonOrbitSpeed;
        moonMesh.position.x = earthMesh.position.x + a * Math.cos(angle);
        moonMesh.position.y = earthMesh.position.y + (a * Math.sin(angle)) * Math.sin(inclination);
        moonMesh.position.z = earthMesh.position.z + b * Math.sin(angle);
        moonMesh.rotation.y = -angle;

        checkSun(cameraRef.current, sunMesh, stars, sunLight);

        ////////////////////////////RESET SPHERE MAKES PONG WORK - COMMENT TO START A GAME ////////////////////////////
        //resetSphere(sphere, sphereGeometry);
        ////////////////////////////RESET SPHERE MAKES PONG WORK - COMMENT TO START A GAME ////////////////////////////

        rendererRef.current.render(sceneRef.current, cameraRef.current);
        // Update sceneRef.current logic here
    };

    animate();

    const onWindowResize = () => {
        // Update camera aspect ratio
        cameraRef.current.aspect = (window.innerWidth / 1.5) / (window.innerHeight / 1.2);
        cameraRef.current.updateProjectionMatrix();
        
        // Update renderer size
        rendererRef.current.setSize(window.innerWidth / 1.5, window.innerHeight / 1.2);
    }

    window.addEventListener('resize', onWindowResize)
    return () => {
        //if (sceneRef.current) sceneRef.current.dispose();
        cancelAnimationFrame(animationFrameId.current);
        player1Score = 0;
        player2Score = 0;
        if (sceneRef.current){
            sceneRef.current.remove(planeGeometry);
            sceneRef.current.remove(bottomPaddle);
            sceneRef.current.remove(topPaddle);
            sceneRef.current.remove(sphere);
            sceneRef.current.remove(speedBoostGeometry);
            sceneRef.current.remove(leftWall);
            sceneRef.current.remove(rightWall);
            sceneRef.current.remove(topWall);
            sceneRef.current.remove(bottomWall);
            sceneRef.current.remove(speedBoost1);
            sceneRef.current.remove(speedBoost2);
            sceneRef.current.remove(earthMesh);
            sceneRef.current.remove(moonMesh);
            sceneRef.current.remove(sunMesh);
            sceneRef.current.remove(lightsMesh);
            if (scoreTextMesh != null)
            {
                sceneRef.current.remove(scoreTextMesh);
                scoreTextMesh.geometry.dispose();
                scoreTextMesh.material.dispose();
            }
            planeGeometry.dispose();
            speedBoostGeometry.dispose();
            bottomPaddle.geometry.dispose();
            bottomPaddle.material.dispose();
            topPaddle.geometry.dispose();
            topPaddle.material.dispose();
            sphere.geometry.dispose();
            sphere.material.dispose();
            leftWall.geometry.dispose();
            leftWall.geometry.dispose();
            rightWall.material.dispose();
            topWall.geometry.dispose();
            topWall.material.dispose();
            bottomWall.geometry.dispose();
            bottomWall.material.dispose();
            speedBoost1.geometry.dispose();
            speedBoost1.material.dispose();
            speedBoost2.geometry.dispose();
            speedBoost2.material.dispose();
            earthMesh.geometry.dispose();
            earthMesh.material.dispose();
            moonMesh.geometry.dispose();
            moonMesh.material.dispose();
            sunMesh.geometry.dispose();
            sunMesh.material.dispose();
            lightsMesh.geometry.dispose();
            lightsMesh.material.dispose();
        }
        window.removeEventListener('resize', onWindowResize);
        //document.removeEventListener('keydown', handleKeyDown);
        //document.removeEventListener('keyup', handleKeyUp);
        if (rendererRef.current) {
            rendererRef.current.dispose();
        }
        if (mountRef.current){
            mountRef.current.removeChild(rendererRef.current.domElement);
        }
      // Cleanup Three.js objects and event listeners
    };
    }, []); // Empty dependency array to run effect only once

  return (
    <>
        {/* il faut clear le score, et renvoyer le score final avec les 2 joeurs pour le endgame */}
        <div className="d-flex justify-content-center" style={{color:'red', fontSize:'50px'}}>
            <CustomTimer seconds={120} Player1={userData.username} Player2={guestData} ScorePlayer1={player1Score} ScorePlayer2={player2Score}/>
        </div>
        <div className="d-flex justify-content-center" ref={mountRef}/>;
    </>
  )
};

export default UserGame
