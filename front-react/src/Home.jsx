import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";

function Home(){
	const {userData, setUserData} = useContext(UserDataContext);

	console.log(userData);
	return userData === null ?	
		<HomePageUnknown/>
	:
		<HomePageKnown/>

}

function HomePageUnknown(){
	const myStyle = {
		backgroundImage: `url('/yellow-bg.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return (
		<div className="d-flex flex-column vh-100 justify-content-center" style={myStyle}>
			<div className="row row-cols-1 row-cols-md-4 g-4 justify-content-between">
				<div className="col mb-3 ms-3">
					<div className="card text-center text-bg-dark">
						<img src="./Pong.png" className="card-img-top"/>
						<div className="card-body">
							<p className="card-text">Experience Pong with your friends, localy or online !</p>
						</div>
					</div>
				</div>
				<div className="col mb-3 me-3">
					<div className="card text-center text-bg-dark">
						<img src="./livechat.jpg" className="card-img-top"/>
						<div className="card-body">
							<p className="card-text">Add friends, <br/>chat and more...</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function HomePageKnown(){
	const myStyle = {
		backgroundImage: `url('/yellow-bg.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return (
		<div className="d-flex justify-content-center align-items-centercover-container d-flex vh-100" style={myStyle}>
			<h1>HELLO THERE ITS A REAL USER</h1>
		</div>
	);
}

export default Home