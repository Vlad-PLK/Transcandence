import React, { useContext, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function FriendRequestModal() {
    const { t } = useTranslation(); // Use i18next for translations
    const [error, setError] = useState('');
    const [friend, setFriend] = useState('');
    const { userData } = useContext(UserDataContext);
    const navigate = useNavigate();

    const sendInvite = async (e) => {
        e.preventDefault();

        try {
            const to_user_username = friend;
            if (to_user_username != userData.username) {
                const response = await api.post('api/friends/create-friend-request/', { to_user_username });
                console.log(response.data);
            }
            else
                setError("Are you lonely?");
        } catch (error) {
            console.log('Error:', error);
            setError('User not found');
        }
    }

    return (
        <>
            <div className="modal fade" id="friendsRequest" tabIndex="-1" aria-labelledby="friendModalLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-4" id="friendModalLabel">{t('userFriends.sendRequest')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            {userData && (
                                <form onSubmit={sendInvite}>
                                    <div className="form-floating mb-2">
                                        <input
                                            type="text"
                                            className="form-control rounded-3"
                                            id="username"
                                            placeholder={t('userFriends.username')}
                                            autoComplete='username'
                                            value={friend}
                                            onChange={(e) => setFriend(e.target.value)}
                                        />
                                        <label htmlFor="username">{t('userFriends.username')}</label>
                                    </div>
                                    <button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal" onClick={sendInvite}>
                                        {t('userFriends.send')}
                                    </button>
                                    {error && <p className="text-danger mt-2">{error}</p>}
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FriendRequestModal;
