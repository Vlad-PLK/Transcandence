import { useContext, useEffect } from "react";
import { UserDataContext } from "../UserDataContext";
import UserGame from "./UserGame";
import { GuestDataContext } from "../GuestDataContext";
import { GameContext } from "../GameContext";
import api from "../api";
import { getAdapter } from "axios";

function UserGameWindow()
{
	const {gameData, setGameData} = useContext(GameContext);
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
		fontFamily: 'cyber4'
	};

	useEffect(() => {
		const fetchGameData = async () => {
		  try {
			const response = await api.get('api/update-game-settings/');
			setGameData(response.data);
			console.log(response.data);
		  } catch (error) {
			console.log("error while fetching game data: ", error);
		  }
		};
	
		fetchGameData();
	  }, [setGameData]);
	return (
		<>
			<div className="d-flex flex-column vh-100" style={main_image}>
				<UserGame gameData={gameData}/>
			</div>
		</>
	)
}
export default UserGameWindow