import * as THREE from "./node_modules/three/src/Three.js";

export function setScore(player1Score, player2Score)
{
    // Create HTML elements to display scores
    const player1ScoreElement = document.createElement('div');
    player1ScoreElement.style.position = 'absolute';
    player1ScoreElement.style.top = '10px';
    player1ScoreElement.style.left = '10px';
    player1ScoreElement.style.fontSize = '24px';
    player1ScoreElement.style.color = 'white';
    player1ScoreElement.innerHTML = `Player 1: ${player1Score}`;
    document.body.appendChild(player1ScoreElement);

    const player2ScoreElement = document.createElement('div');
    player2ScoreElement.style.position = 'absolute';
    player2ScoreElement.style.top = '10px';
    player2ScoreElement.style.right = '10px';
    player2ScoreElement.style.fontSize = '24px';
    player2ScoreElement.style.color = 'white';
    player2ScoreElement.innerHTML = `Player 2: ${player2Score}`;
    document.body.appendChild(player2ScoreElement);

    return {player1ScoreElement, player2ScoreElement};
}