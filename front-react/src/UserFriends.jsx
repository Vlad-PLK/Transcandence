import { useParams } from "react-router";
import PlayerStats from "./PlayerStats";
import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "./UserDataContext";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import api from "./api";
import FriendRequestModal from "./FriendRequestModal";
import DeleteFriendModal from "./DeleteFriendModal";

function UserFriends()
{
    const {userData} = useContext(UserDataContext);
    const {t} = useTranslation();
	const navigate = useNavigate();
	const [isVisible, setVisible] = useState(false);
	const [isDeleted, setDeleted] = useState(false);
	const [isNotFriend, setNotFriend] = useState(false);
	const [isFr, setFr] = useState(false);
	const [isAccepted, setAccepted] = useState(false);
	const [userFriends, setUserFriends] = useState([]);
	const [userFriendRequest, setUserFriendRequest] = useState([]);
	const [userFriendRequestSent, setUserFriendRequestSent] = useState([]);
    const main_image = {
		backgroundImage: `url('/friends2.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
		fontFamily: 'cyber4'
	};
	const toggleNotFriend = () => {
		setNotFriend(!isNotFriend);
	}
    const disconnect=() => {
		localStorage.clear();
		navigate("/");
	}
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	const toggleVisibleF = () => {
		setFr(!isFr);
	};
	useEffect(() => {
		if (userData && isVisible || isAccepted || isNotFriend)
			{
				try {
					api.get('api/friends/friend-list/')
					.then(response => {
						setUserFriends(response.data)
						setAccepted(false);
						setNotFriend(false);
					  })
					.catch(error => {
						console.log('Error:', error);
					  });
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				} catch (error) {
					alert(error);
				}
		}
	}, [isVisible, isAccepted, isNotFriend])
	useEffect(() => {
		if (userData && isFr || isAccepted || isDeleted)
			{
				try {
					api.get('api/friends/friends-requests-list/')
					.then(response => {
						setUserFriendRequest(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
					  });
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				} catch (error) {
					alert(error);
				}
				try {
					api.get('api/friends/from-user-request-list')
					.then(response => {
						setAccepted(false);
						setDeleted(false);
						setUserFriendRequestSent(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
					  });
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				} catch (error) {
					alert(error);
				}
		}
	}, [isFr, isAccepted, isDeleted])
	const accept_friendship = async (id) => {
		const url = `api/friends/frient-request/${id}/accept/`;
		try {
			await api.put(url);
			setAccepted(true);
			id = -1;
		}catch(error) {
				console.log('Error:', error);
			  };
	}
	const reject_friendship = async (id) => {
		const url = `api/friends/friend-requests/${id}/reject/`;
		try {
			await api.delete(url);
			setDeleted(true);
			id = -1;
		}catch(error) {
				console.log('Error:', error);
			  };
	}
    return (
        <>
            <>
            <div className="d-flex flex-column vh-100" style={main_image}>
                <header className="p-4">
      			  <div className="container">
      			    <div className="d-flex flex-wrap align-items-center">
      			      <TranslationSelect/>
      			      <a href="/userPage/" className="d-flex align-items-center ms-3 me-3 text-decoration-none text-white">
      			        <span className="fs-4">{t('main.title')}</span>
      			      </a>
					  <button type="button" className="btn btn-lg btn-primary ms-md-auto mb-md-0 me-5" data-bs-toggle="modal" data-bs-target="#friendsRequest">Add Friend</button>
					  <button type="button" className="btn btn-lg btn-danger mb-md-0 me-md-auto" data-bs-toggle="modal" data-bs-target="#deleteFriendRequest">Delete Friend</button>
      			        <div className="btn-group dropstart">
						<button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
							<span className="visually-hidden">Toggle Dropstart</span>
						</button>
						<ul className="dropdown-menu opacity-50" style={{fontSize:"12px",textAlign:"center", minWidth:"5rem"}}>
							<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">Settings</a>
							<Link to={`../userFriends`} className="dropdown-item">Friends</Link>
							<hr className="dropdown-divider"/>
							<button className="dropdown-item" onClick={disconnect}>Disconnect</button>
						</ul>
						{userData && <Link to={`../userSettings`} type="button" className="btn btn-outline-light me-2">{userData.username}
							{userData.avatar == null ? 
								<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40"/>
								:
								<img className="ms-2 rounded" src={'http://localhost:8000' + userData.avatar} alt="" height="40" widht="40"/>
							}
						</Link>}
      			        </div>
      			    </div>
      			  </div>
      			</header>
				<div className="d-flex justify-content-center opacity-75">
					<div className="d-flex align-items-center flex-column mt-5" style={{width:"60%"}}>
						<div className="text-center container">
							<div className="card-header rounded-2 bg-dark pt-2 pb-2 ps-5 pe-5">
								<h3 className="text-light">Friends List</h3>
								<button type="button" className="btn btn-dark float-right" onClick={toggleVisible}>
								{isVisible ? 'Hide' : 'Show'}
								</button>
							</div>
							{isVisible && (userFriends.length > 0 ? (
							<ul className="friend-history list-group">
							{userFriends.map((friends, index) => (
							<li key={index} className="list-group-item">
								{friends.user1.id == userData.id ? friends.user2.username : friends.user1.username}
							</li>
							))}
							</ul>
							) : (
							<ul className="friend-history list-group">
								<li className="list-group-item rounded-0 rounded-bottom">No friends yet...</li>
							</ul>
							))} 
						</div>
						<div className="text-center container mt-5 ">
							<div className="card-header rounded-2 bg-dark pt-2 pb-2 ps-5 pe-5">
								<h3 className="text-light">Friends Requests</h3>
								<button type="button" className="btn btn-dark float-right" onClick={toggleVisibleF}>
								{isFr ? 'Hide' : 'Show'}
								</button>
							</div>
							{isFr && ((userFriendRequest.length > 0 || userFriendRequestSent.length > 0) ? (
							<ul className="friend-request-history list-group">
							{userFriendRequest.map((friendsRequest, index) => (
							<li key={index} className="list-group-item">
									<div>
										<p className="rounded-0 rounded-bottom">Request from {friendsRequest.from_user.username}</p> 
										<div className="d-flex justify-content-center">
											<button type="button" className="btn btn-sm btn-success me-3" onClick={() => accept_friendship(friendsRequest.id)}>ACCEPT</button>
											<button type="button" className="btn btn-sm btn-danger" onClick={() => reject_friendship(friendsRequest.id)}>REJECT</button>
										</div>
									</div>
							</li>
							))}
							{userFriendRequestSent.map((friendsRequestSent, index) => (
								<li key={index} className="list-group-item">
										<div>
											<p className="rounded-0 rounded-bottom">Request sent to {friendsRequestSent.to_user.username}</p>
										</div>
								</li>
								))}
							</ul>
							) : (
							<ul className="friend-history list-group">
								<li className="list-group-item rounded-0 rounded-bottom">No request made yet...</li>
							</ul>
							))} 
						</div>
					</div>
				</div>
            </div>
			<SettingsModal/>
			<FriendRequestModal/>
			<DeleteFriendModal setDeleteFriend={toggleNotFriend}/>
            </>
        </>
    ); 
};
export default UserFriends