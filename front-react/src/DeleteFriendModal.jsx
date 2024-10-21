import React, { useContext, useEffect, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function DeleteFriendModal({ toggleNotFriend }) {
    const { t } = useTranslation();
    const [isClicked, setClicked] = useState(false);
    const [userFriends, setUserFriends] = useState([]);
    const [isDeleted, setDeleted] = useState(false);
    const { userData } = useContext(UserDataContext);

    const toggleList = () => {
        setClicked(!isClicked);
    };

    useEffect(() => {
        if (userData && (isClicked || isDeleted)) {
            api.get('api/friends/friend-list/')
                .then(response => {
                    setUserFriends(response.data);
                    setDeleted(false);
                })
                .catch(error => {
                    console.log('Error:', error);
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
                });
        }
    }, [isClicked, isDeleted, userData]);

    const deleteFriend = async (id) => {
        const url = `api/friends/friend/${id}/delete/`;
        try {
            const response = await api.delete(url);
            setDeleted(true);
            toggleNotFriend();
            console.log(response.data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    return (
        <>
            <div className="modal fade" id="deleteFriendRequest" tabIndex="-1" aria-labelledby="friendModalLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-4" id="friendModalLabel">{t('userFriends.deleteFriend')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <button type="button" className="btn btn-warning btn-sm mb-2" onClick={toggleList}>
                                {isClicked ? t('userFriends.hideFriends') : t('userFriends.showFriends')}
                            </button>
                            {isClicked ? (
                                Array.isArray(userFriends) && userFriends.length > 0 ? (
                                    <ul className="friend-history list-group">
                                        {userFriends.map((friends, index) => (
                                            <li key={index} className="list-group-item">
                                                <div className="d-flex">
                                                    <p className="mt-3">{friends.user2.id === userData.id ? friends.user1.username : friends.user2.username}</p>
                                                    <button type="button" className="btn btn-sm btn-danger ms-3" onClick={() => deleteFriend(friends.id)}>{t('userFriends.delete')}</button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="friend-history list-group">
                                        <li className="list-group-item rounded-0 rounded-bottom">{t('userFriends.no_Friends')}</li>
                                    </ul>
                                )
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DeleteFriendModal;
