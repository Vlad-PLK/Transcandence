import { useContext } from "react"
import { UserDataContext } from "./UserDataContext"

function UserFriends(){
	const {userData} = useContext(UserDataContext);
	<h1>Friends page of : {userData.username}</h1>
}
export default UserFriends