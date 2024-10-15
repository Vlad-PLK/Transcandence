import { useContext, useEffect, useState } from "react";
import api from "./api";

function takeData(setUserData, setIsUserReady)
{
	api.get('api/player-info/')
	.then(response => {
		if (setIsUserReady != null)
			setIsUserReady(true);
		setUserData(response.data)
	  })
	.catch(error => {
		setUserData(null);
		if (setIsUserReady != null)
			setIsUserReady(true);
	  });
}

export default takeData
