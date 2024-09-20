import React, { useState, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { GuestDataContext } from "./GuestDataContext";

function GuestModal(){
	const [nickname, setNickname] = useState('');
	const {setGuestData} = useContext(GuestDataContext);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleStartGame = () => {
		setGuestData(prevState => ({...prevState, 
			guestNickname: nickname}));
		document.getElementById("guestUsernameNoLogin").value = "";
		navigate("/userGameWindow/");
	};

	return (
		<div className="modal fade" id="guestModal" tabIndex="-1" aria-labelledby="guestModal" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    <form onSubmit={handleStartGame}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="guestUsernameNoLogin" placeholder='Choose a nick for the game !' autoComplete='nickname' value={nickname} onChange={(e) => setNickname(e.target.value)}/>
        		        <label htmlFor="nickname">Nickname</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-warning" type="submit" data-bs-dismiss="modal">Start the Game</button>
        		      {error && <p className="text-danger">{error}</p>}
        		    </form>
        		    </div>
        		</div>
        	</div>
		</div>
	);
};

export default GuestModal;