import React, {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

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

function CustomTimer({seconds, Player1, Player2, ScorePlayer1, ScorePlayer2})
{
	const [count, setCount] = useState(seconds);
	const timerId = useRef();
	const navigate = useNavigate();

	useEffect(() => {
		timerId.current = setInterval(() => {
			setCount(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId.current);
	}, []);
	useEffect(() => {
		if (count === 0)
		{
			console.log(Player1, Player2, ScorePlayer1, ScorePlayer2);
			// need to make an api request for the game result
			clearInterval(timerId.current);
			navigate("../userGameEnd");
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