import React, { useContext, useEffect, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate, useParams } from 'react-router-dom';

function DeleteFriendModal(toggleNotFriend)
{
	const [isClicked, setClicked] = useState(false);
	const [userFriends, setUserFriends] = useState([]);
	const [isDeleted, setDeleted] = useState(false);
	const {userData} = useContext(UserDataContext);

	const toggleList = () => {
		setClicked(!isClicked);
	}

	useEffect(() => {
		if (userData && isClicked || isDeleted)
		{
			try {
				api.get('api/friends/friend-list/')
				.then(response => {
					setUserFriends(response.data)
					setDeleted(false);
				  })
				.catch(error => {
					console.log('Error:', error);
				  });
				// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
			} catch (error) {
				alert(error);
			}
		}
	}, [isClicked, isDeleted])
	
    const deleteFriend = async (id) => {
		const url = `api/friends/friend/${id}/delete/`;
		try {
			const response = await api.delete(url);
			setDeleted(true);
			toggleNotFriend();
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
					<button type="button" className="btn btn-warning btn-sm mb-2" onClick={toggleList}>
						{isClicked ? 'HIDE FRIENDS' : 'SHOW FRIENDS'}
					</button>
					{isClicked ? 
				  		(userFriends.length > 0 ? (
						<ul className="friend-history list-group">
						{userFriends.map((friends, index) => (
							<li key={index} className="list-group-item">
								<div className="d-flex">
									<p className="mt-3">{friends.user2.id == userData.id ? friends.user1.username : friends.user2.username}</p>
									<button type="button" className="btn btn-sm btn-danger ms-3" onClick={() => deleteFriend(friends.id)}>DELETE</button>
								</div>
							</li>
							))}
							</ul>
							) : (
							<ul className="friend-history list-group">
								<li className="list-group-item rounded-0 rounded-bottom">No friends yet...</li>
							</ul>
							))
						:
						<></>
					}
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