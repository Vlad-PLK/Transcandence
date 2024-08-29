import React, { useContext, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import takeData from './takeData';

function FriendRequestModal()
{
	const [error, setError] = useState('');
	const [friend, setFriend] = useState('');
	const {userData} = useContext(UserDataContext);
	const navigate = useNavigate();
    const sendInvite = async (e) => {
        e.preventDefault();

        try {
			const to_user_username = friend;
            const response = await api.post('friend-requests/', {to_user_username});
			console.log(response.data);
		} catch (error) {
            alert(error);
        }
    }
	return (
	<>
      	<div className="modal fade" id="friendsRequest" tabIndex="-1" aria-labelledby="friendModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Send a friend request now !</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    {userData && <form onSubmit={sendInvite}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="username" placeholder='Username' autoComplete='username' value={friend} onChange={(e) => setFriend(e.target.value)}/>
        		        <label htmlFor="username">Username</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal" onClick={sendInvite}>Send</button>
        		      {error && <p className="text-danger">{error}</p>}
        		      </form>}
        		    </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default FriendRequestModal