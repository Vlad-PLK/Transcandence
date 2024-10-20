import React, {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ConvertTime = (time) =>
	{
		let minutes = Math.floor(time / 60);
		let secondes = Math.floor(time - minutes * 60);
	
		if (minutes < 10)
			minutes = '0' + minutes;
		if (secondes < 10)
			secondes = '0' + secondes;
	
		return (minutes + ':' + secondes);
	}

function CustomTimer({flag, seconds, player1, player1_nick, player2, player2_nick, player1_score, player2_score, isGuest})
{
	const [count, setCount] = useState(seconds);
	const timerId = useRef();
	const navigate = useNavigate();

	const gameData = async () => {
			try {
				const response = await api.post('api/match-create/', {player1, player2, player1_score, player2_score});
				console.log(response.data);
			} catch (error) {
				alert(error);
			}
		}
	useEffect(() => {
		timerId.current = setInterval(() => {
			setCount(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId.current);
	}, []);
	useEffect(() => {
		if (count === 0)
		{
			console.log("TIMER :", flag, player1, player1_nick, player2, player2_nick, player1_score, player2_score);
			if (isGuest == false)
				gameData();
			clearInterval(timerId.current);
			navigate("../userGameEnd", {
				state:
				{
					flag: 1,
					player1: player1,
					player1_nick: player1_nick,
					player2: player2,
					player2_nick: player2_nick,
					player1_score: player1_score,
					player2_score: player2_score
				}
			});
		}
	}, [count]);
	return (
		<>
			<div>
				{ConvertTime(count)}
			</div>
		</>
	)
}

export default CustomTimer