import { useContext } from "react"
import { UserDataContext } from "./UserDataContext"

function UserFriends(){
	const {userData} = useContext(UserDataContext);
	return (
		<>
			{userData && <h1 className="text-dark">Friends page of : {userData.username}</h1>}
		</>
	);
}
export default UserFriends