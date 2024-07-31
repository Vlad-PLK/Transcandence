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
		console.error('Error:', error);   
	  });
}

export default takeData
