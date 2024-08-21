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
    const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
		fontFamily: 'cyber4'
	};
    const disconnect=() => {
		localStorage.clear();
		navigate("/");
	}
	const [isVisible, setVisible] = useState(false);
	const [userFriends, setUserFriends] = useState([]);
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	useEffect(() => {
		if (userData && isVisible)
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
	}, [isVisible])
    return (
        <>
            <>
            <div className="d-flex flex-column vh-100" style={main_image}>
                <header className="p-4 opacity-75">
      			  <div className="container">
      			    <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
      			      <TranslationSelect/>
      			      <a href="/userPage/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
      			        <span className="fs-4">{t('main.title')}</span>
      			      </a>
                    <div className="text-end">
      			          <div className="btn-group dropstart">
							<button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
								<span className="visually-hidden">Toggle Dropstart</span>
							</button>
							<ul className="dropdown-menu opacity-50" style={{fontSize:"12px",textAlign:"center", minWidth:"5rem"}}>
								<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</a>
								<Link to={`../userFriends`} className="dropdown-item">Friends</Link>
								<hr className="dropdown-divider"/>
								<button className="dropdown-item" onClick={disconnect}>Disconnect</button>
							</ul>
							{userData && <Link to={`.`} type="button" className="btn btn-outline-light me-2">{userData.username}
								<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40"/>
							</Link>}
      			          </div>
      			    </div>
      			    </div>
      			  </div>
      			</header>
				<div className="d-flex justify-content-evenly mt-5 pt-2 ms-2">
                    <div className="col-sm-4 text-center">
						<div className="card-header d-flex flex-column rounded-2  bg-dark">
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
						<p className="card-text text-light mt-3">No friends yet !</p>
						))} 
                    </div>
					<div className="">
						<button type="button" className="btn btn-lg btn-primary" data-bs-toggle="modal" data-bs-target="#friendsRequest">Add Friend</button>
					</div>
					<div className="">
						<button type="button" className="btn btn-lg btn-danger" data-bs-toggle="modal" data-bs-target="#deleteFriendRequest">Delete Friend</button>
					</div>
                </div>
            </div>
			<SettingsModal/>
			<FriendRequestModal/>
			<DeleteFriendModal/>
            </>
        </>
    ); 
};
export default UserFriends