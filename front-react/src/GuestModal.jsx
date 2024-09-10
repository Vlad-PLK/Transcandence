import React, { useState } from 'react';

function GuestModal(){
	const [nickname, setNickname] = useState('');

	const handleNicknameChange = (e) => {
		setNickname(e.target.value);
	};

	const handleStartGame = () => {
		// Add your logic for starting the game here
		console.log(`Starting game with nickname: ${nickname}`);
	};

	return (
		<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Welcome back !</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    <form onSubmit={handleStartGame}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="username" placeholder='Choose a nick for the game' autoComplete='username' value={nickname} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="username">Nickname</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Login</button>
        		      {error && <p className="text-danger">{error}</p>}
        		      </form>
        		    </div>
        		</div>
        	</div>
		</div>
	);
};

export default GuestModal;