import { useState } from "react";

function takeData(setIsUserReady, setUserData)
{
	const [error, setError] = useState('');
	try {
		const response = api.post('users/@me');
		console.log(response.data);
		setUserData(reponse.data);
		setIsUserReady(true);
		setError('');
	} catch (error) {
		alert(error);
		console.error(error);
	}
}

export default takeData