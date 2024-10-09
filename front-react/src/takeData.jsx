import { useContext, useEffect, useState } from "react";
import api from "./api";

function takeData(setUserData, setIsUserReady)
{
	api.get('api/player-info/')
	.then(response => {
		console.log(response.data)
		if (setIsUserReady != null)
			setIsUserReady(true);
		setUserData(response.data)
	  })
	.catch(error => {
		console.log('Error:', error);
		setUserData(null);
		if (setIsUserReady != null)
			setIsUserReady(true);
	  });
}

export default takeData
