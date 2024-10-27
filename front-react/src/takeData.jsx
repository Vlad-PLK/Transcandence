import { useContext, useEffect, useState } from "react";
import api from "./api";

function takeData(setUserData, setIsUserReady, setGameData)
{
	api.get('api/player-info/')
	.then(response => {
		if (setIsUserReady != null)
			setIsUserReady(true);
		setUserData(response.data)
		api.get('api/update-game-settings/')
		.then(response => {
			if (setGameData != null)
				setGameData(response.data);
		})
		.catch(error => {
			console.log('Error:', error);
		});
	  })
	.catch(error => {
		setUserData(null);
		if (setIsUserReady != null)
			setIsUserReady(true);
	  });
}

export default takeData
