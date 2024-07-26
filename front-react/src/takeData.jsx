import api from "./api";

function takeData(setIsUserReady, setUserData)
{
	const response = api.get('api/player-stats');
	if (response.data != null)
	{
		console.log(response.data);
		setUserData(response.data);
		setIsUserReady(true);
	}
	else{
		console.log("empty");
	}
}

export default takeData