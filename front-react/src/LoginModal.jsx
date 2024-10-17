import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { UserDataContext } from './UserDataContext';
import { TwoFaContext } from './TwoFaContext';
import { useNavigate } from 'react-router-dom';
import TwoFAModal from './TwoFAModal';
import takeData from './takeData';
import { GameContext } from './GameContext';

function LoginModal()
{
	const { t } = useTranslation();
	const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [errorLog, setLogError] = useState('');
	const { TwoFA, setTwoFA } = useContext(TwoFaContext);
	const { setUserData } = useContext(UserDataContext);
	const { gameData, setGameData } = useContext(GameContext);
	const navigate = useNavigate();

	const cleanForm = () => {
		document.getElementById('usernameLogin').value = '';
		document.getElementById('passwordLogin').value = '';
	}

    const loginbutton = async (e) => {
        e.preventDefault();
		cleanForm();
        try {
			console.log(TwoFA);
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            const response = await api.post('api/users/user/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			takeData(setUserData);
			api.get('api/update-game-settings/')
			.then(response => {
				setGameData(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
			});
			navigate("userPage/");
            setUsername('');
            setPassword('');
		} catch (error) {
			console.log(error);
			setUsername('');
            setPassword('');
			setLogError(t('login_error'));
        }
    }

	const send_otp = () => {
		api.post('api/users/user/token/', {username, password});
	}
	return (
	<>
      	<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">{t('welcomeBack')}</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="usernameLogin" placeholder={t('username')} autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="usernameLogin">{t('username')}</label>
        		      </div>
        		      <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="passwordLogin" placeholder={t('password')} autoComplete='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="passwordLogin">{t('password')}</label>
        		      </div>
					  	{TwoFA == 1 ?
        		      		<button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" data-bs-toggle="modal" data-bs-target="#twofaModal" onClick={send_otp}>{t('login_login')}</button>
						:
						<>
        		      		<button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" data-bs-dismiss="modal" onClick={loginbutton}>{t('login_login')}</button>
        		      		{errorLog && <p className="mt-2 text-danger">{errorLog}</p>}
						</>
						}
        		  	 </div>
        		</div>
        	</div>
		</div>
		<TwoFAModal username={username} password={password}/>
	</>
	);
};

export default LoginModal;
