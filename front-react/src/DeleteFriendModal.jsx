import React, { useContext, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import takeData from './takeData';

function DeleteFriendModal()
{
	const [error, setError] = useState('');
	const [friend, setFriend] = useState('');
	const [userFriends, setUserFriends] = useState([]);
	const {userData} = useContext(UserDataContext);
	if (userData)
	{
		try {
			api.get('friends/friend-list/')
			.then(response => {
				console.log(response.data)
				setUserFriends(response.data)
			  })
			.catch(error => {
				console.log('Error:', error);
			  });
			// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
		} catch (error) {
			alert(error);
		}
	}
    const deleteFriend = async (id) => {
		const url = `friends/${id}/delete/`;
		try {
			const response = await api.put(url);
			console.log(response.data)
		}catch(error) {
				console.log('Error:', error);
			  };
	}
	return (
	<>
      	<div className="modal fade" id="deleteFriendRequest" tabIndex="-1" aria-labelledby="friendModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Delete Friend</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
				  	{userFriends.length > 0 ? (
						<ul className="friend-history list-group">
						{userFriends.map((friends, index) => (
							<li key={index} className="list-group-item">
								<div className="d-flex">
									<p className="">{friends.user1.id == userData.id ? friends.user2.username : friends.user1.username}</p>
									<button type="button" className="btn btn-sm btn-danger me-3" onClick={() => deleteFriend(friends.user2.id)}>DELETE</button>
								</div>
							</li>
							))}
							</ul>
							) : (
							<ul className="friend-history list-group">
								<li className="list-group-item rounded-0 rounded-bottom">No friends yet...</li>
							</ul>
							)} 
        		    {/* {userData && <form onSubmit={deleteFriend}> */}
        		      {/* <div className="form-floating mb-2"> */}
        		        {/* <input type="text" className="form-control rounded-3" id="username" placeholder='Username' autoComplete='username' value={friend} onChange={(e) => setFriend(e.target.value)}/> */}
        		        {/* <label htmlFor="username">Username</label> */}
        		      {/* </div> */}
        		      {/* <button className="w-90 mt-2 btn btn-lg rounded-3 btn-danger" type="submit" data-bs-dismiss="modal">We're not friends anymore !</button> */}
        		      {/* {error && <p className="text-danger">{error}</p>} */}
        		      {/* </form>} */}
        		    </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default DeleteFriendModal