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
import setCamera from './setCamera.jsx';
import setPlane from './setPlane.jsx';
import updateKey from './updateKey.jsx';
import shockWave from './shockWave.jsx';
import checkSun from './checkSun';
import * as vec from './vectors_functions.jsx'
import { UserDataContext } from '../UserDataContext.jsx';
import { GuestDataContext } from '../GuestDataContext.jsx';
import CustomTimer from './CustomTimer.jsx';
import { use } from 'i18next';
import { GameContext } from '../GameContext.jsx';
import { TournamentPairDataContext } from '../TournamentPairDataContext.jsx';
import { useNavigate } from 'react-router-dom';


let cameraKeyIsPressed = false;
let paddle1Right = false;
let paddle1Left = false;
let paddle2Right = false;
let paddle2Left = false;
let streakPowerIsPressed = false;
let cameraPosition = 0;

let player1Score = 0;
let player2Score = 0;
let player1Streak = 0
let player2Streak = 0;
let scoreFlag = 0;
let streakPower = 0;

const paddleWidth = 12;
const paddleHeight = 2;
const paddleDepth = 1;
let isPaddlePowered = false;

let boostMultiplier = 1;
let boost1Flag = 0.5; 
let boost2Flag = -0.5; 

const semiMajorAxis = 500;
const eccentricity = 0.0549;
const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);

const a = semiMajorAxis;
const inclination = 5.145 * Math.PI / 180;
const b = semiMinorAxis


// SETTINGS //
// Stars
let earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, sunHaloMesh, sunLight, moonMesh, orbitRadius, stars;
let whiteDwarfMesh, whiteDwarfShadyMaterial, whiteDwarfShadyMesh, whiteDwarfShadingMaterial, whiteDwarfShadingMesh, fresnelwhiteDwarfMesh, whiteDwarfHaloMesh, whiteDwarfLight;
let redGiantMesh, redGiantShadyMaterial, redGiantShadyMesh, redGiantShadingMaterial, redGiantShadingMesh, fresnelRedGiantMesh, redGiantHaloMesh, redGiantLight;
let blackHoleMesh, blackHoleGLensMaterial, blackHoleGLensMesh, blackHoleShadingMaterial, blackHoleShadingMesh, fresnelBlackHoleMesh, blackHoleLight, discMesh;
let customMesh, customShadyMaterial, customShadyMesh, customShadingMaterial, customShadingMesh, fresnelCustomMesh, customHaloMesh, customHaloMaterial, customLight;
let initialMousePos = { x: 0, y: 0 };
let earthRotationSpeed = 0.005;
let sunRotationSpeed = 0.0002;
let moonOrbitSpeed = earthRotationSpeed / 2
let angle = 0;

// SpeedBoosts
let speedBoostGeometry, speedBoost1, speedBoost2;
const speedBoostSpeed = 0.8;
let velocity = vec.vectorize(0, 0, 0);


// PowerUps
let bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry;

// Score
let scoreTextMesh = null;

const displayPressedKeys = () => {
    const pressedKeys = Object.keys(keyboardState).filter(key => keyboardState[key]);
};

const keyboardState = {};
    
const handleKeyDown = (event) => {
    keyboardState[event.key] = true;
    displayPressedKeys();
};
const handleKeyUp = (event) => {
    keyboardState[event.key] = false;
    displayPressedKeys();
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

let sphereTimeoutID;
let setSphereFlag = false;

function setSphere(scene, sphere, sphereGeometry, setSphereFlag, sphereTimeoutID)
{
    console.log("SETSPHERE FLAG AVANT = ", setSphereFlag);

    if (sphereTimeoutID)
        clearTimeout(sphereTimeoutID);
    sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0, sphereGeometry.parameters.radius, 0);
    scene.add(sphere);

    sphereTimeoutID = setTimeout(() => {
        if (setSphereFlag == false)
        {
            let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
            velocity.x = Math.cos(randomAngle);
            velocity.z = Math.sin(randomAngle);
            setSphereFlag = true;
        }
    }, 4000);
    console.log("SETSPHERE FLAG APRES = ", setSphereFlag);
    return { sphere, sphereGeometry, setSphereFlag, sphereTimeoutID};
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

    return { normal: null, flag: 0 };
};

let resphereTimeoutID;
let resetSphereFlag = false;

function resetSphere(scene, sphere, sphereGeometry, resetSphereFlag, resphereTimeoutID) {
    console.log("RESET FLAG BEFORE = ", resetSphereFlag);
    
    // Clear any existing timeout
    if (resphereTimeoutID)
        clearTimeout(resphereTimeoutID);

    if (sphere)
    {
        scene.remove(sphere);
        sphere.geometry.dispose();
        sphere.material.dispose();
    }

    let newSphereGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    let newSphere = new THREE.Mesh(newSphereGeometry, sphereMaterial);
    newSphere.position.set(0, newSphereGeometry.parameters.radius, 0);
    scene.add(newSphere);

    velocity = vec.vectorize(0, 0, 0);

    resphereTimeoutID = setTimeout(() => {
        if (!resetSphereFlag) {
            let randomAngle = (Math.floor(Math.random() * 2) * Math.PI) + (Math.PI / 4) + (Math.random() * (Math.PI / 2));
            velocity.x = Math.cos(randomAngle);
            velocity.z = Math.sin(randomAngle);
            resetSphereFlag = true;
        }
    }, 4000);

    return { sphere: newSphere, sphereGeometry: newSphereGeometry, resetSphereFlag, resphereTimeoutID };
}

function resetPaddles(topPaddle, bottomPaddle, planeGeometry, streakPower)
{
    if (!streakPower)
    {
        const PaddleGeo = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleDepth);
        topPaddle.geometry.dispose();
        bottomPaddle.geometry.dispose();
        topPaddle.geometry = PaddleGeo;
        bottomPaddle.geometry = PaddleGeo;
    }
    topPaddle.position.set(0, 1, planeGeometry.parameters.height / 2 - 1 / 2)
    bottomPaddle.position.set(0, 1, -planeGeometry.parameters.height / 2 + 1 / 2);
}

function powerPaddle(paddle)
{
    const newPaddleGeo = new THREE.BoxGeometry(paddleWidth/2, paddleHeight, paddleDepth);
    
    paddle.geometry.dispose();
    paddle.geometry = newPaddleGeo;
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
        textMesh.rotation.y = Math.PI;
    else if (cameraPosition == 0 || cameraPosition == 5)
        textMesh.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    return textMesh;
}

function updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition)
{
    if (scoreTextMesh != null)
    {
        scene.remove(scoreTextMesh);
        scoreTextMesh.geometry.dispose();
        scoreTextMesh.material.dispose();
        scoreTextMesh = null;
    }
    
    scoreTextMesh = createScoreText(player1ID, player2ID, player1Score, player2Score, font, scoreTextMesh, cameraPosition);
    scene.add(scoreTextMesh);

    
    const animationStartTime = performance.now();

    function animateScoreText()
    {
        let elapsedTime = performance.now() - animationStartTime;
        if (elapsedTime <= 5000)
        {
            requestAnimationFrame(animateScoreText);
        }
        else
        {
            scene.remove(scoreTextMesh);
            scoreTextMesh.geometry.dispose();
            scoreTextMesh.material.dispose();
            scoreTextMesh = null;
        }
    }
    animateScoreText();
}

function checkCollision(scene, sphere, sphereGeometry, 
    planeGeometry, topPaddle, bottomPaddle, bottomWall, topWall, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, font, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID)
{
    const { normal, flag } = calculateCollisionNormal(sphere, sphereGeometry, topPaddle, bottomPaddle, planeGeometry);

    if (normal != null && flag > 0) {
        if (paddle1Left && flag == 3) velocity.x += 0.3;
        else if (paddle1Right && flag == 3) velocity.x -= 0.3;
        else if (paddle2Left && flag == 4) velocity.x += 0.3;
        else if (paddle2Right && flag == 4) velocity.x -= 0.3;
        
        velocity = vec.reflectVector(velocity, normal);
    }

    if (sphere.position.z + sphereGeometry.parameters.radius >= planeGeometry.parameters.height / 2 + 0.01) {
        player2Streak = 0;
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, topWall.position.z);
        shockWave(scene, contactPoint, planeGeometry);
        player2Score += 1;
        resetSphereFlag = false;
        
        if (scoreFlag == 1)
        {
            player1Streak += 1;
            streakPower = player1Streak == 2 ? 2 : 0;
        }
        scoreFlag = 1;

        updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition);
        ({ sphere, sphereGeometry, resetSphereFlag, resphereTimeoutID } = resetSphere(scene, sphere, sphereGeometry, resetSphereFlag, resphereTimeoutID));
        resetPaddles(topPaddle, bottomPaddle, planeGeometry, streakPower);
    }
    else if (sphere.position.z - sphereGeometry.parameters.radius <= -planeGeometry.parameters.height / 2 - 0.01) {
        player1Streak = 0;
        let contactPoint = new THREE.Vector3(sphere.position.x, sphere.position.y + 0.25, bottomWall.position.z);
        shockWave(scene, contactPoint, planeGeometry);
        player1Score += 1;
        resetSphereFlag = false;

        if (scoreFlag == 2)
        {
            player2Streak += 1;
            streakPower = player2Streak == 2 ? 1 : 0;
        }
        scoreFlag = 2;

        updateScoreText(scene, font, player1ID, player2ID, player1Score, player2Score, scoreTextMesh, cameraPosition);
        ({ sphere, sphereGeometry, resetSphereFlag, resphereTimeoutID } = resetSphere(scene, sphere, sphereGeometry, resetSphereFlag, resphereTimeoutID));
        resetPaddles(topPaddle, bottomPaddle, planeGeometry, streakPower);
    }

    return { player1Score, player2Score, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID, sphere, sphereGeometry };
}

function calculateRotationSpeed(radius, sunRotationSpeed)
{
    const baseThreshold = 850;
    const decayConstant = 0.001664;
    const increaseFactor = 10;

    let exponentialFactor = 0;

    const difference = Math.abs((radius - baseThreshold));
    if (radius >= 850)
        exponentialFactor = Math.exp(-decayConstant * difference);
    else
        exponentialFactor = Math.exp(decayConstant * (difference * difference) / (baseThreshold * 0.2));
    return sunRotationSpeed * (1 + increaseFactor * exponentialFactor);
}

function updateStarfield(stars, camera)
{
    if (!stars || !stars.geometry || !stars.geometry.attributes.position) {
        console.error("Stars object or its geometry is not properly initialized.");
        return;
    }

    const starPositions = stars.geometry.attributes.position.array;
    const cameraDistance = camera.position.length();

    for (let i = 0; i < starPositions.length; i += 3) {
        const x = starPositions[i];
        const y = starPositions[i + 1];
        const z = starPositions[i + 2];

        const distance = Math.sqrt(x * x + y * y + z * z);

        // Adjust this scaleFactor to ensure stars look stationary
        const scaleFactor = cameraDistance / (distance / 8); 
        starPositions[i] = x * scaleFactor;
        starPositions[i + 1] = y * scaleFactor;
        starPositions[i + 2] = z * scaleFactor;
    }

    stars.geometry.attributes.position.needsUpdate = true;
}
  

function UserGame({gameData})
{
    const {userData} = useContext(UserDataContext);
    const {guestData} = useContext(GuestDataContext);
    const {tournamentPairData} = useContext(TournamentPairDataContext);
    // const {gameData} = useContext(GameContext);
    const [scoreP1, setScoreP1] = useState(0);
    const [scoreP2, setScoreP2] = useState(0);
    const animationFrameId = useRef(null);
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
    // let velocity = vec.vectorize(0,0,0);
    // let setSphereFlag = false;
    // let resetSphereFlag = false;
    // scene, lights, textures  //
    // scene //
    if (!gameData){
        navigate('/userGameSetup');
        return ;
    }
    sceneRef.current = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    sceneRef.current.background = new THREE.Color(0x000000);
    // renderer //
    rendererRef.current = new THREE.WebGLRenderer();
    setRenderer(rendererRef.current);
    mountRef.current.appendChild(rendererRef.current.domElement);
    const milky = textureLoader.load('../../public/milkyway.jpg', (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
    });
    // ambient light //
    const ambientLight = new THREE.AmbientLight(0x404040, 15);
    sceneRef.current.add(ambientLight);
    // camera //
    cameraRef.current = new THREE.PerspectiveCamera(
      45,
      (window.innerWidth / 1.5) / (window.innerHeight / 1.2),
      0.1,
      1000000
    );
    const cameraDirection = new THREE.Vector3();
    setCamera(cameraRef.current, cameraDirection);
    let cameraDistance = 0;
    const loader = new FontLoader();
    const font = loader.parse(Ponderosa_Regular);

    //updateScoreText(sceneRef.current, font, userData.username, guestData.guestNickname, player1Score, player2Score, scoreTextMesh, cameraPosition);
    // Start score
    
    if (tournamentPairData.player1_name != '' && tournamentPairData.player2_name != '')
        updateScoreText(sceneRef.current, font, tournamentPairData.player1_name, tournamentPairData.player2_name, player1Score, player2Score, scoreTextMesh, cameraPosition);
    else if ((guestData.guestNickname != '' || guestData.nickname != '') && userData)
        updateScoreText(sceneRef.current, font, userData.username, guestData.guestNickname, player1Score, player2Score, scoreTextMesh, cameraPosition);

    // SETTINGS
    const starType = gameData.startFlag;
    let BHsize, sizeChecker, BHcolor, BHintensity;
    let starRadius, starIntensity, starColor, starCorona;

    if (starType == 3)
    {
        sizeChecker = parseFloat(gameData.gargantuaSize) 
        BHsize = sizeChecker;
        BHcolor = gameData.gargantuaColor;
        BHintensity = 2 * gameData.gargantuaIntensity;
    }
    if (starType != 3)
        sceneRef.current.background = milky;
    if (starType == 4)
    {
        starRadius = gameData.customStarSize * 400;
        starIntensity = gameData.customStarIntensity;
        starColor = gameData.customStarColor;
        starCorona = gameData.customCoronaType;
    }

    const Boost = gameData.boostsEnabled;

    const BoostPower = gameData.boostFactor;

    const PowerUp = gameData.powerEnabled;




    // // TESTING SETTINGS

    // if (gameData)
    // {
    //     console.log("Current Star FLAG", starType);
    //     console.log("Current size BH", BHsize);
    //     console.log("Current color BH", BHcolor);
    //     console.log("Current custom size", starRadius);
    //     console.log("Current custom intensity", starIntensity);
    //     console.log("Current custom color", starColor);
    //     console.log("Current custom corona", starCorona);
    //     console.log("Current boosts status", Boost);
    //     console.log("Current Boost factor", boostPower);
    //     console.log("Current powerup", powerUp);
    // }

    let maxDistance = 0;

    let whiteDwarfRotationSpeed = 0;
    let redGiantRotationSpeed = 0;
    let customRotationSpeed = 0;


    // ... Add geometry, materials, lights, etc.
    const planeGeometry = setPlane(sceneRef.current);
    const { leftWall, rightWall, bottomWall, topWall} = setWalls(sceneRef.current, planeGeometry);
    ({bottomPaddle, topPaddle, bottomPaddleGeometry, topPaddleGeometry } = setPaddles(sceneRef.current, planeGeometry));
    if (Boost == 1)
        ({ speedBoostGeometry, speedBoost1, speedBoost2 } = setBoosts(sceneRef.current));
    if (starType == 0)
        ({earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, sunMesh, sunShadyMaterial, sunShadyMesh, sunShadingMaterial, sunShadingMesh, fresnelSunMesh, sunHaloMesh, sunLight, moonMesh, orbitRadius, stars} = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader, starType, starIntensity, starRadius, starColor, starCorona));
    else if (starType == 1)
    {
        ({earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, whiteDwarfMesh, whiteDwarfShadyMaterial, whiteDwarfShadyMesh, whiteDwarfShadingMaterial, whiteDwarfShadingMesh, fresnelwhiteDwarfMesh, whiteDwarfHaloMesh, whiteDwarfLight, moonMesh, orbitRadius, stars} = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader, starType, starIntensity, starRadius, starColor, starCorona));
        whiteDwarfRotationSpeed = calculateRotationSpeed(150, sunRotationSpeed);
    }
    else if (starType == 2)
    {
        ({earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, redGiantMesh, redGiantShadyMaterial, redGiantShadyMesh, redGiantShadingMaterial, redGiantShadingMesh, fresnelRedGiantMesh, redGiantHaloMesh, redGiantLight, moonMesh, orbitRadius, stars} = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader, starType, starIntensity, starRadius, starColor, starCorona));
        redGiantRotationSpeed = calculateRotationSpeed(5000, sunRotationSpeed);
    }
    else if (starType == 3)
    {
        starRadius = BHsize;
        starColor = BHcolor;
        starIntensity = BHintensity;
        ({earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, blackHoleMesh, blackHoleGLensMesh, blackHoleGLensMaterial, blackHoleLight, moonMesh, orbitRadius, stars} = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader, starType, starIntensity, starRadius, starColor, starCorona));
        maxDistance = 3790;
    }
    else if (starType == 4)
    {
        ({earthMesh, lightsMesh, cloudsMesh, fresnelEarthMesh, customMesh, customShadyMaterial, customShadyMesh, customShadingMaterial, customShadingMesh, fresnelCustomMesh, customHaloMaterial, customHaloMesh, customLight, moonMesh, orbitRadius, stars} = setSolarySystem(sceneRef.current, cameraRef.current, rendererRef.current, textureLoader, starType, starIntensity, starRadius, starColor, starCorona));
        customRotationSpeed = calculateRotationSpeed(customMesh.geometry.parameters.radius, sunRotationSpeed);
    }
    let sphere = null;
    let sphereGeometry = null;
    ({ sphere, sphereGeometry, setSphereFlag, sphereTimeoutID} = setSphere(sceneRef.current, sphere, sphereGeometry, setSphereFlag, sphereTimeoutID));

    // animation
    const animate = () =>
    {
        animationFrameId.current = requestAnimationFrame(animate);
        setScoreP1(player1Score);
        setScoreP2(player2Score);

        if (starType != 3)
            updateStarfield(stars, cameraRef.current);

        const updatedValues = updateKey(keyboardState, bottomPaddle, topPaddle, bottomPaddleGeometry, 
            topPaddleGeometry, planeGeometry, cameraKeyIsPressed,
            paddle1Left, paddle1Right, paddle2Left, paddle2Right,
            cameraRef.current, cameraPosition, streakPowerIsPressed, streakPower);

        ({cameraKeyIsPressed, paddle1Left, paddle1Right, paddle2Left, paddle2Right, cameraPosition, streakPowerIsPressed, streakPower, bottomPaddle, topPaddle} = updatedValues);

        // ({player1Score, player2Score, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID} = checkCollision(sceneRef.current, sphere, sphereGeometry, 
            // planeGeometry, topPaddle, bottomPaddle, bottomWall, topWall, userData.username, guestData.guestNickname, player1Score, player2Score, scoreTextMesh, font, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag));
        if (tournamentPairData.player1_name != '' && tournamentPairData.player2_name != '')
        {
        ({player1Score, player2Score, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID, sphere, sphereGeometry} = checkCollision(sceneRef.current, sphere, sphereGeometry, 
            planeGeometry, topPaddle, bottomPaddle, bottomWall, topWall, tournamentPairData.player1_name, tournamentPairData.player2_name, player1Score, player2Score, scoreTextMesh, font, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID));
        }
        else if ((guestData.guestNickname != '' || guestData.nickname != '') && userData)
        {
            ({player1Score, player2Score, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID, sphere, sphereGeometry} = checkCollision(sceneRef.current, sphere, sphereGeometry, 
                 planeGeometry, topPaddle, bottomPaddle, bottomWall, topWall, userData.username, guestData.guestNickname, player1Score, player2Score, scoreTextMesh, font, player1Streak, player2Streak, scoreFlag, streakPower, resetSphereFlag, resphereTimeoutID));
        }

        if (PowerUp == 1)
        {
            if (streakPowerIsPressed && streakPower != 0 && !isPaddlePowered)
            {
                if (streakPower === 1)
                {
                    powerPaddle(topPaddle);
                    isPaddlePowered = true;
                }
                else if (streakPower === 2)
                {
                    powerPaddle(bottomPaddle);
                    isPaddlePowered = true;
                }
                streakPower = 0;
            }
            if (isPaddlePowered && streakPower === 0)
            {
                topPaddle.geometry.parameters.width = paddleWidth;
                bottomPaddle.geometry.parameters.width = paddleWidth;
                isPaddlePowered = false;
            }
        }

        if (Boost == 1)
        {
            if (isBallOverBoostSurface(speedBoost1, sphere, sphereGeometry) || isBallOverBoostSurface(speedBoost2, sphere, sphereGeometry))
                boostMultiplier = 2 * BoostPower;
            else
                boostMultiplier = 1;
            
            speedBoost1.position.x += boost1Flag * speedBoostSpeed;
            speedBoost2.position.x += boost2Flag * speedBoostSpeed;

            if ((speedBoost1.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost1.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
                boost1Flag *= -1;

            if ((speedBoost2.position.x + speedBoostGeometry.parameters.width / 2 >= planeGeometry.parameters.width / 2) || (speedBoost2.position.x - speedBoostGeometry.parameters.width / 2 <= -planeGeometry.parameters.width / 2))
                boost2Flag *= -1;
        }
        sphere.position.x += velocity.x * boostMultiplier;
        sphere.position.z += velocity.z * boostMultiplier;

        earthMesh.rotation.y += earthRotationSpeed;
        lightsMesh.rotation.y += earthRotationSpeed;
        cloudsMesh.rotation.y += earthRotationSpeed + 0.001;
        fresnelEarthMesh.rotation.y += earthRotationSpeed;

        angle += moonOrbitSpeed;
        moonMesh.position.x = earthMesh.position.x + a * Math.cos(angle);
        moonMesh.position.y = earthMesh.position.y + (a * Math.sin(angle)) * Math.sin(inclination);
        moonMesh.position.z = earthMesh.position.z + b * Math.sin(angle);
        moonMesh.rotation.y = -angle;

        if (starType == 0)
        {
            sunMesh.rotation.y -= sunRotationSpeed;
            sunShadyMesh.rotation.y -= sunRotationSpeed;
            sunShadyMaterial.uniforms.time.value += 0.01;
            sunShadingMesh.rotation.y -= sunRotationSpeed;
            sunShadingMaterial.uniforms.time.value += 0.01;
            fresnelSunMesh.rotation.y -= sunRotationSpeed;
            checkSun(cameraRef.current, sunMesh, stars, sunLight);
        }
        else if (starType == 1)
        {
            whiteDwarfMesh.rotation.y -= whiteDwarfRotationSpeed;
            whiteDwarfShadyMesh.rotation.y -= whiteDwarfRotationSpeed;
            whiteDwarfShadyMaterial.uniforms.time.value += 0.01;
            whiteDwarfShadingMesh.rotation.y -= whiteDwarfRotationSpeed;
            whiteDwarfShadingMaterial.uniforms.time.value += 0.01;
            fresnelwhiteDwarfMesh.rotation.y -= whiteDwarfRotationSpeed;
            checkSun(cameraRef.current, whiteDwarfMesh, stars, whiteDwarfLight);
        }
        else if (starType == 2)
        {
            redGiantMesh.rotation.y -= redGiantRotationSpeed;
            redGiantShadyMesh.rotation.y -= redGiantRotationSpeed;
            redGiantShadyMaterial.uniforms.time.value += 0.01;
            redGiantShadingMesh.rotation.y -= redGiantRotationSpeed;
            redGiantShadingMaterial.uniforms.time.value += 0.01;
            fresnelRedGiantMesh.rotation.y -= redGiantRotationSpeed;
            checkSun(cameraRef.current, redGiantMesh, stars, redGiantLight);
        }
        else if (starType == 3)
        {
            blackHoleGLensMaterial.uniforms.iTime.value += 0.05;
            cameraDistance = cameraRef.current.position.length();
            blackHoleGLensMaterial.uniforms.ucameraPosition.value.copy(cameraRef.current.position);
            
            cameraRef.current.getWorldDirection(blackHoleGLensMaterial.uniforms.cameraDirection.value);
            if (cameraDistance > maxDistance)
                cameraRef.current.position.normalize().multiplyScalar(maxDistance);
        }
        else if (starType == 4)
        {
            customMesh.rotation.y -= customRotationSpeed;
            customShadyMesh.rotation.y -= customRotationSpeed;
            customShadyMaterial.uniforms.time.value += 0.01;
            customShadingMesh.rotation.y -= customRotationSpeed;
            customShadingMaterial.uniforms.time.value += 0.01;
            fresnelCustomMesh.rotation.y -= customRotationSpeed;
            if (starCorona != 0)
            {
                customHaloMesh.rotation.y -= customRotationSpeed;
                customHaloMaterial.uniforms.iTime.value += 0.004;
                // customHaloMaterial.uniforms.ucameraPosition.value.copy(cameraRef.current.position);
                customHaloMesh.lookAt(cameraRef.current.position);
                customHaloMesh.rotateY(9.5 / 2);
                // console.log(cameraRef.current.position.distanceTo(customHaloMesh));
                // customHaloMesh.scale.setScalar(10000000000/cameraRef.current.position.distanceTo(customHaloMesh));
            }

            checkSun(cameraRef.current, customMesh, stars, customLight);
        }

        rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    const onWindowResize = () => {
        // Update camera aspect ratio
        cameraRef.current.aspect = (window.innerWidth / 1.5) / (window.innerHeight / 1.2);
        cameraRef.current.updateProjectionMatrix();
        
        // Update renderer size
        rendererRef.current.setSize(window.innerWidth / 1.5, window.innerHeight / 1.2);
    }

    window.addEventListener('mousemove', (event) => {
        // Update the initial mouse position only once, or use some logic to update it when needed
        initialMousePos.x = event.clientX / window.innerWidth;
        initialMousePos.y = event.clientY / window.innerHeight;
    });
    

    window.addEventListener('resize', onWindowResize)
    return () => {
        //if (sceneRef.current) sceneRef.current.dispose();
        cancelAnimationFrame(animationFrameId.current);
        player1Score = 0;
        player2Score = 0;
        setSphereFlag = false;
        resetSphereFlag = false;
        velocity = vec.vectorize(0,0,0);
        cameraPosition = 0;
        if (sphereTimeoutID) {
            clearTimeout(sphereTimeoutID);
        }
        if (resphereTimeoutID) {
            clearTimeout(resphereTimeoutID);
        }
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
            if (Boost == 1)
            {
                speedBoostGeometry.dispose();
                sceneRef.current.remove(speedBoost1);
                sceneRef.current.remove(speedBoost2);
                speedBoost1.geometry.dispose();
                speedBoost1.material.dispose();
                speedBoost2.geometry.dispose();
                speedBoost2.material.dispose();
            }
            sceneRef.current.remove(earthMesh);
            sceneRef.current.remove(moonMesh);
            sceneRef.current.remove(lightsMesh);
            sceneRef.current.remove(cloudsMesh);
            sceneRef.current.remove(fresnelEarthMesh);
            sceneRef.current.remove(stars);
            if (starType == 0)
            {
                sceneRef.current.remove(sunMesh);
                sunMesh.geometry.dispose();
                sunMesh.material.dispose();
                sceneRef.current.remove(sunShadyMesh);
                sunShadyMesh.geometry.dispose();
                sunShadyMesh.material.dispose();
                sceneRef.current.remove(sunShadingMesh);
                sunShadingMesh.geometry.dispose();
                sunShadingMesh.material.dispose();
                sceneRef.current.remove(fresnelSunMesh);
                fresnelSunMesh.geometry.dispose();
                fresnelSunMesh.material.dispose();

            }
            else if (starType == 1)
            {
                sceneRef.current.remove(whiteDwarfMesh);
                whiteDwarfMesh.geometry.dispose();
                whiteDwarfMesh.material.dispose();
                sceneRef.current.remove(whiteDwarfShadyMesh);
                whiteDwarfShadyMesh.geometry.dispose();
                whiteDwarfShadyMesh.material.dispose();
                sceneRef.current.remove(whiteDwarfShadingMesh);
                whiteDwarfShadingMesh.geometry.dispose();
                whiteDwarfShadingMesh.material.dispose();
                sceneRef.current.remove(fresnelwhiteDwarfMesh);
                fresnelwhiteDwarfMesh.geometry.dispose();
                fresnelwhiteDwarfMesh.material.dispose();

            }
            if (starType == 2)
            {
                sceneRef.current.remove(redGiantMesh);
                redGiantMesh.geometry.dispose();
                redGiantMesh.material.dispose();
                sceneRef.current.remove(redGiantShadyMesh);
                redGiantShadyMesh.geometry.dispose();
                redGiantShadyMesh.material.dispose();
                sceneRef.current.remove(redGiantShadingMesh);
                redGiantShadingMesh.geometry.dispose();
                redGiantShadingMesh.material.dispose();
                sceneRef.current.remove(fresnelRedGiantMesh);
                fresnelRedGiantMesh.geometry.dispose();
                fresnelRedGiantMesh.material.dispose();

            }
            if (starType == 3)
            {
                sceneRef.current.remove(blackHoleMesh);
                blackHoleMesh.geometry.dispose();
                blackHoleMesh.material.dispose();
                sceneRef.current.remove(blackHoleGLensMesh);
                blackHoleGLensMesh.geometry.dispose();
                blackHoleGLensMesh.material.dispose();
            }
            else if (starType == 4)
            {
                sceneRef.current.remove(customMesh);
                customMesh.geometry.dispose();
                customMesh.material.dispose();
                sceneRef.current.remove(customShadyMesh);
                customShadyMesh.geometry.dispose();
                customShadyMesh.material.dispose();
                sceneRef.current.remove(customShadingMesh);
                customShadingMesh.geometry.dispose();
                customShadingMesh.material.dispose();
                sceneRef.current.remove(fresnelCustomMesh);
                fresnelCustomMesh.geometry.dispose();
                fresnelCustomMesh.material.dispose();
                sceneRef.current.remove(customHaloMesh);
                customHaloMesh.geometry.dispose();
                customHaloMesh.material.dispose();
            }
            planeGeometry.dispose();
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
            earthMesh.geometry.dispose();
            earthMesh.material.dispose();
            cloudsMesh.geometry.dispose();
            cloudsMesh.material.dispose();
            fresnelEarthMesh.geometry.dispose();
            fresnelEarthMesh.material.dispose();
            moonMesh.geometry.dispose();
            moonMesh.material.dispose();
            lightsMesh.geometry.dispose();
            lightsMesh.material.dispose();
            if (scoreTextMesh)
            {
                sceneRef.current.remove(scoreTextMesh);
                scoreTextMesh.geometry.dispose();
                scoreTextMesh.material.dispose();
            }
        }
        window.removeEventListener('resize', onWindowResize);
        if (rendererRef.current) {
            rendererRef.current.dispose();
        }
        if (mountRef.current){
            mountRef.current.removeChild(rendererRef.current.domElement);
        }
    };
    }, [setScoreP1, setScoreP2]);
    return (
        <>
            {/* il faut clear le score, et renvoyer le score final avec les 2 joeurs pour le endgame */}
            {
                (userData && (guestData.nickname != '' || guestData.guestNickname != '')) ? (
                <div className="d-flex justify-content-center" style={{color:'white', fontSize:'50px'}}>
                <CustomTimer 
                        flag={0}
                        tournamentID={0}
                        matchID={0}
                        seconds={45} 
                        player1={userData.id} 
                        player1_nick={userData.username}
                        player2={guestData.id} 
                        player2_nick={guestData.guestNickname}
                        player1_score={scoreP1} 
                        player2_score={scoreP2} 
                        isGuest={guestData.isGuest}
                    />
                </div>
                ) : (userData && (tournamentPairData.player1_name != '' && tournamentPairData.player2_name != '')) ? (
                <div className="d-flex justify-content-center" style={{color:'white', fontSize:'50px'}}>
                <CustomTimer 
                        flag={1}
                        tournamentID={tournamentPairData.tournament_id}
                        matchID={tournamentPairData.match_id}
                        seconds={45} 
                        player1={tournamentPairData.player1_id} 
                        player1_nick={tournamentPairData.player1_name}
                        player2={tournamentPairData.player2_id} 
                        player2_nick={tournamentPairData.player2_name}
                        player1_score={scoreP1} 
                        player2_score={scoreP2}
                        isGuest={false}
                    />
                </div>) : (<></>)}
            <div className="d-flex justify-content-center" ref={mountRef}/>;
        </>
      )
};

export default UserGame