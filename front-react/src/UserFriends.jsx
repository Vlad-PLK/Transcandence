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
import { WebSocketContext } from "./WebSocketContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function UserFriends() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isVisible, setVisible] = useState(false);
    const [isDeleted, setDeleted] = useState(false);
    const [isNotFriend, setNotFriend] = useState(false);
    const {userData, setUserData} = useContext(UserDataContext);
    const [isFr, setFr] = useState(false);
    const [isAccepted, setAccepted] = useState(false);
    const [userFriends, setUserFriends] = useState([]);
    const [userFriendRequest, setUserFriendRequest] = useState([]);
    const [userFriendRequestSent, setUserFriendRequestSent] = useState([]);
    const [playerInfo, setPlayerInfo] = useState([]);
    const { online_status } = useContext(WebSocketContext);
    const main_image = {
        backgroundImage: `url('/friends2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'cyber4'
    };

    useEffect(() => {
        api.get('api/friends/friend/' + 1 + '/get-profile/')
        .then(response => {
            console.log(response.data);
        })
    }, [])
    useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])
	const disconnect = () => {
		console.log('Disconnected from websocket and closed connection');
		localStorage.clear();
		setUserData(null);
	}

    const toggleVisible = () => {
        setVisible(!isVisible);
    };

    const toggleVisibleF = () => {
        setFr(!isFr);
    };

    useEffect(() => {
        if (userData && (isVisible || isAccepted || isNotFriend)) {
            try {
                api.get('api/friends/friend-list/')
                    .then(response => {
                        console.log(response.data);
                        setUserFriends(response.data);
                        setAccepted(false);
                        setNotFriend(false);
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            } catch (error) {
                alert(error);
            }
        }
    }, [isVisible, isAccepted, isNotFriend]);

    useEffect(() => {
        if (userData && (isFr || isAccepted || isDeleted)) {
            try {
                api.get('api/friends/friends-requests-list/')
                    .then(response => {
                        setUserFriendRequest(response.data);
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });

                api.get('api/friends/from-user-request-list')
                    .then(response => {
                        setAccepted(false);
                        setDeleted(false);
                        setUserFriendRequestSent(response.data);
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });
            } catch (error) {
                alert(error);
            }
        }
    }, [isFr, isAccepted, isDeleted]);

    const accept_friendship = async (id) => {
        const url = `api/friends/frient-request/${id}/accept/`;
        try {
            await api.put(url);
            setAccepted(true);
            id = -1;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const reject_friendship = async (id) => {
        const url = `api/friends/friend-requests/${id}/reject/`;
        try {
            await api.delete(url);
            setDeleted(true);
            id = -1;
        } catch (error) {
            console.log('Error:', error);
        }
    }

    const visit_friend_page = (friend) => {
        navigate("/userFriendPage/", { state: { friend: friend } });
    }

    return (
        <>
            <div className="d-flex flex-column vh-100" style={main_image}>
                <header className="p-4">
                    <div className="container">
                        <div className="d-flex flex-wrap align-items-center">
                            <TranslationSelect />
                            <a href="/userPage/" className="d-flex align-items-center ms-3 me-3 text-decoration-none text-white">
                                <span className="fs-4">{t('main.title')}</span>
                            </a>
                            <button type="button" className="btn btn-lg btn-primary ms-md-auto mb-md-0 me-5" data-bs-toggle="modal" data-bs-target="#friendsRequest">{t('userFriends.addFriend')}</button>
                            <button type="button" className="btn btn-lg btn-danger mb-md-0 me-md-auto" data-bs-toggle="modal" data-bs-target="#deleteFriendRequest">{t('userFriends.deleteFriend')}</button>
                            <div className="btn-group dropstart">
                                <button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropstart</span>
                                </button>
                                <ul className="dropdown-menu opacity-50" style={{ fontSize: "12px", textAlign: "center", minWidth: "5rem" }}>
                                    <a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('userFriends.settings')}</a>
                                    <Link to={`../userFriends`} className="dropdown-item">{t('userFriends.friends')}</Link>
                                    <hr className="dropdown-divider" />
                                    <button className="dropdown-item" onClick={disconnect}>{t('userFriends.disconnect')}</button>
                                </ul>
                                {userData && <Link to={`../userSettings`} type="button" className="btn btn-outline-light me-2">{userData.username}
                                    {userData.avatar == null ?
                                        <img className="ms-2 rounded" src="/robot.webp" alt="" height="40" width="40" />
                                        :
                                        <img className="ms-2 rounded" src={"https://"+window.location.host+userData.avatar} alt="" height="40" width="40" />
                                    }
                                </Link>}
                            </div>
                        </div>
                    </div>
                </header>
                <div className="d-flex justify-content-center opacity-75">
                    <div className="d-flex align-items-center flex-column mt-5" style={{ width: "60%" }}>
                        <div className="text-center container">
                            <div className="card-header rounded-2 bg-dark pt-2 pb-2 ps-5 pe-5">
                                <h3 className="text-light">{t('userFriends.friendsList')}</h3>
                                <button type="button" className="btn btn-dark float-right" onClick={toggleVisible}>
                                    {isVisible ? t('userFriends.hide') : t('userFriends.show')}
                                </button>
                            </div>
                            {userData && isVisible && (userFriends.length > 0 ? (
                                <ul className="friend-history list-group overflow-auto" style={{ maxHeight: '170px' }}>
                                    {Array.isArray(userFriends) && userFriends.map((friends, index) => (
                                        <li key={index} className="list-group-item">
                                            {friends.user1.id == userData.id ?
                                            <>
                                             <button href="" type="button" className="btn btn-outline-dark" onClick={() => visit_friend_page(friends.user2)}>{friends.user2.username}</button> 
                                                <span className="ms-3 me-3">
                                                Status : 
                                                    {friends.user2.online_status == true ?
                                                    <span className="text-success ms-3">{t('online')}</span>
                                                    :
                                                    <span className="text-danger ms-3">{t('offline')}</span>
                                                    }
                                                </span>
                                            </>
                                             :
                                            <>
                                             <button href="" type="button" className="btn btn-outline-dark" onClick={() => visit_friend_page(friends.user1)}>{friends.user1.username}</button>
                                                <span className="ms-3 me-3">
                                                Status : 
                                                    {friends.user1.online_status == true ?
                                                    <span className="text-success ms-3">{t('online')}</span>
                                                    :
                                                    <span className="text-danger ms-3">{t('offline')}</span>
                                                    }
                                                </span>
                                            </> 
                                            }
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="friend-history list-group">
                                    <li className="list-group-item rounded-0 rounded-bottom">{t('userFriends.noFriends')}</li>
                                </ul>
                            ))}
                        </div>
                        <div className="text-center container mt-5 ">
                            <div className="card-header rounded-2 bg-dark pt-2 pb-2 ps-5 pe-5">
                                <h3 className="text-light">{t('userFriends.friendRequests')}</h3>
                                <button type="button" className="btn btn-dark float-right" onClick={toggleVisibleF}>
                                    {isFr ? t('userFriends.hide') : t('userFriends.show')}
                                </button>
                            </div>
                            {isFr && ((Array.isArray(userFriendRequest) && userFriendRequest.length > 0 || Array.isArray(userFriendRequestSent) && userFriendRequestSent.length > 0) ? (
                                <ul className="friend-request-history list-group overflow-auto" style={{ maxHeight: '170px' }}>
                                    {userFriendRequest.map((friendsRequest, index) => (
                                        <li key={index} className="list-group-item">
                                            <div>
                                                <p className="rounded-0 rounded-bottom">{t('userFriends.requestFrom')} {friendsRequest.from_user.username}</p>
                                                <div className="d-flex justify-content-center">
                                                    <button type="button" className="btn btn-sm btn-success me-3" onClick={() => accept_friendship(friendsRequest.id)}>{t('userFriends.accept')}</button>
                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => reject_friendship(friendsRequest.id)}>{t('userFriends.reject')}</button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                    {userFriendRequestSent.map((friendsRequestSent, index) => (
                                        <li key={index} className="list-group-item">
                                            <div>
                                                <p className="rounded-0 rounded-bottom">{t('userFriends.requestSentTo')} {friendsRequestSent.to_user.username}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <ul className="friend-request-history list-group">
                                    <li className="list-group-item rounded-0 rounded-bottom">{t('userFriends.noRequests')}</li>
                                </ul>
                            ))}
                        </div>
                    </div>
                </div>
                <SettingsModal isVisible={isVisible} toggleVisible={toggleVisible} />
                <FriendRequestModal isVisible={isFr} toggleVisible={toggleVisibleF} />
                <DeleteFriendModal />
            </div>
        </>
    );
}

export default UserFriends;
