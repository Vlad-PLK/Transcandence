import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";
import SettingsModal from "./SettingsModal";
import { useParams } from "react-router";

function UserHomePage(){
	const {userData} = useContext(UserDataContext);
	const myStyle = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return (
		<>
			<div className="d-flex justify-content-center align-items-centercover-container d-flex vh-100" style={myStyle}>
				<p className="fs-3">HELLO THERE ITS A REAL USER {userData.id} {userData.username} {userData.email}</p>
			</div>
		</>
	);
}

export default UserHomePage