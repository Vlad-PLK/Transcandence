import React, {useRef, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function CustomTimer({seconds})
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
			clearInterval(timerId.current);
			navigate("../userGameSetup");
		}
	}, [count]);
	return (
		<>
			<div>
				Time Left : {count}
			</div>
		</>
	)
}

export default CustomTimer