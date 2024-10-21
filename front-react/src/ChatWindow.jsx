import React, { useContext, useEffect, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function ChatWindow(){
	const { t } = useTranslation();
    const [userFriends, setUserFriends] = useState([]);
    const { userData } = useContext(UserDataContext);

    useEffect(() => {
		if (userData) {
        api.get('api/friends/friend-list/')
            .then(response => {
                setUserFriends(response.data);
            })
            .catch(error => {
                console.log('Error:', error);
				// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
            });
		}
    }, [userData]);
	return (
		<>
			<div className="collapse" id="chat" style={{width:'400px', fontFamily: 'cyber4'}}>
  				<div className="card card-body">
   					Here's the chat ChatWindow
                        <div className="pt-0">
                            {Array.isArray(userFriends) && userFriends.length > 0 && userData ? (
                                    <ul className="friend-history list-group">
                                        {userFriends.map((friends, index) => (
                                            <li key={index} className="list-group-item">
                                                    <p className="mt-3">{friends.user2.id === userData.id ? friends.user1.username : friends.user2.username}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <ul className="friend-history list-group">
                                        <li className="list-group-item rounded-0 rounded-bottom">{t('userFriends.no_Friends')}</li>
                                    </ul>
                                )}
                        </div>
  				</div>
			</div>
		</>
	)
}

export default ChatWindow