import Typewriter from "./Typewriter";

function HomePage(){
	const myStyle = {
		backgroundImage: `url('../public/homepage.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	return (
		<div className="fs-1 fst-italic text-black d-flex justify-content-center align-items-center vh-100" style={myStyle}>
			<Typewriter text="Sometimes it's more about the journey than the destination."/>
		</div>
	);
}

export default HomePage