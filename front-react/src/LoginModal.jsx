import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { UserDataContext } from './UserDataContext';
import { useNavigate } from 'react-router-dom';
import takeData from './takeData';

function LoginModal()
{
	const { t } = useTranslation();
	const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [errorLog, setLogError] = useState('');
	const modalRef = useRef(null);
	const { setUserData } = useContext(UserDataContext);
	const navigate = useNavigate();

	const cleanForm = () => {
		document.getElementById('usernameLogin').value = '';
		document.getElementById('passwordLogin').value = '';
	}

    const loginbutton = async (e) => {
        e.preventDefault();
		cleanForm();
        try {
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            const response = await api.post('api/users/user/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			console.log(response.data);
			takeData(setUserData);
			navigate("userPage/");
            
            setUsername('');
            setPassword('');
		} catch (error) {
			setUsername('');
            setPassword('');
			setLogError(error.response.data.detail);
        }
    }
	return (
	<>
      	<div ref={modalRef} className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">{t('welcomeBack')}</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
					<form action="" onSubmit={loginbutton}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="usernameLogin" placeholder={t('username')} autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="usernameLogin">{t('username')}</label>
        		      </div>
        		      <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="passwordLogin" placeholder={t('password')} autoComplete='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="passwordLogin">{t('password')}</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">{t('login_login')}</button>
        		      {errorLog && <p className="mt-2 text-danger">{errorLog}</p>}
					</form>
        		  	 </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default LoginModal;
