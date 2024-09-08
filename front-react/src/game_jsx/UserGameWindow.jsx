import { useContext } from "react";
import { UserDataContext } from "../UserDataContext";
import UserGame from "./UserGame";
import { GuestDataContext } from "../GuestDataContext";

function UserGameWindow()
{
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
		fontFamily: 'cyber4'
	};
	return (
		<>
			<div className="d-flex flex-column vh-100" style={main_image}>
				<UserGame/>
			</div>
		</>
	)
}
export default UserGameWindow