import { useContext, useState, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { GuestDataContext } from "./GuestDataContext";
import api from "./api";
import axios from "axios";

function PlayerModal() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const {setGuestData} = useContext(GuestDataContext);
	const navigate = useNavigate();

    const launchGame = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('api/users/user/token/', { username, password });
			const api_invite = axios.create({
				baseURL: import.meta.env.VITE_API_URL
			  });
			api_invite.interceptors.request.use(
			(config) => {
			  const token = response.data.access;
			  if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			  }
			  return config;
			},
			(error) => {
			  return Promise.reject(error);
			}
			);
			api_invite.get('api/player-info/')
			.then(response_get => {
				console.log("guest player login : ", response_get.data)
				const guestResponse = response_get.data;
				setGuestData(prevState => ({
					...prevState,
					guestNickname: guestResponse.username,
					nickname: guestResponse.username,
					id: guestResponse.id
				}));
				navigate("/userGameWindow/");
            	setUsername('');
            	setPassword('');
            	setError('');
			  })
			.catch(error => {
				console.log('Error:', error);
			  });
		} catch (error) {
            alert(error);
        }
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
					  <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="guestPassword" placeholder='guestPass' autoComplete='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="password">Password</label>
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