import Typewriter from "./Typewriter";

function HomePage(){
	const myStyle = {
		backgroundImage: `url('../public/yellow-bg.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return (
		<div className="d-flex justify-content-center align-items-centercover-container d-flex vh-100" style={myStyle}>
		</div>
	);
}

export default HomePage