import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";

function Home(){
	return (	
		<HomePageUnknown/>
	);

}

function HomePageUnknown(){
	const myStyle = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return(
		<h1>hi</h1>
	);
			{/* <div className="row row-cols-1 row-cols-md-4 g-4 justify-content-between"> */}
				{/* <div className="col mb-3 ms-3"> */}
					{/* <div className="card text-center text-bg-dark"> */}
						{/* <img src="./Pong.png" className="card-img-top"/> */}
						{/* <div className="card-body"> */}
							{/* <p className="card-text">Experience Pong with your friends, <br/>localy or online !</p> */}
						{/* </div> */}
					{/* </div> */}
				{/* </div> */}
				{/* <div className="col mb-3 me-3"> */}
					{/* <div className="card text-center text-bg-dark"> */}
						{/* <img src="./livechat.jpg" className="card-img-top"/> */}
						{/* <div className="card-body"> */}
							{/* <p className="card-text">Add friends, <br/>chat and more...</p> */}
						{/* </div> */}
					{/* </div> */}
				{/* </div> */}
			{/* </div> */}
		{/*<div className="d-flex flex-column vh-100 justify-content-center" style={myStyle}>*/}
		{/* </div> */}
}

export default Home