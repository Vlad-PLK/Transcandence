import { useContext, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { GuestDataContext } from "./GuestDataContext";
import api from "./api";

function PlayerModal() {
    const [username, setUsername] = useState('');
	const [error, setError] = useState('');
	const {guestData, setGuestData} = useContext(GuestDataContext);
	const navigate = useNavigate();

    const launchGame = () => {
        api.get('api/get-user-id/', {username})
		.then(response => {
			console.log(response);
			//setGuestData(prevState => ({
			//	...prevState,
			//	guestNickname: username,
			//	nickname: username,
			//	id: response.id,
			//	isGuest: false
			//}));
			//navigate("/userGameWindow/");
        	setUsername('');
        	setError('');
		})
		.catch(error => {
			console.log('Error:', error);
		});
    }
	return (
	<>
      	<div className="modal fade" id="playerModal" tabIndex="-1" aria-labelledby="playerModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    <form onSubmit={launchGame}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="guestUsernameLogin" placeholder='guestUser' autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="nickname">Username</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-danger" type="submit" data-bs-dismiss="modal">Start the Game</button>
        		      {error && <p className="text-danger">{error}</p>}
        		    </form>
        		    </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default PlayerModal