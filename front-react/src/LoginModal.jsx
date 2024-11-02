import React, { useContext, useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { UserDataContext } from './UserDataContext';
import { TwoFaContext } from './TwoFaContext';
import { useNavigate } from 'react-router-dom';
import TwoFAModal from './TwoFAModal';
import takeData from './takeData';
import { GameContext } from './GameContext';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function LoginModal()
{
	const { t } = useTranslation();
	const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [errorLog, setLogError] = useState('');
	const { setUserData } = useContext(UserDataContext);
	const { gameData, setGameData } = useContext(GameContext);
	const [show2FA, setShow2FA] = useState(false);
	const {TwoFA, setTwoFA} = useContext(TwoFaContext);
	const [otp_code, setCode] = useState('');
    const inputRefs = useRef([]);
	const navigate = useNavigate();

	const cleanForm = () => {
		document.getElementById('usernameLogin').value = '';
		document.getElementById('passwordLogin').value = '';
	}
	const handleChange = (event, index) => {
        const newCode = otp_code.split('');
        newCode[index] = event.target.value;
        setCode(newCode.join(''));

        if (event.target.value && index < 5){
            inputRefs.current[index + 1].focus();
        }
    };

	const send_otp_again = async(e) => {
		e.preventDefault();
        try {
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            const response = await api.post('api/users/user/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			send_otp(e);
		} catch (error) {
			console.log(error);
			if (error.response.data.non_field_errors != null && error.response.data.non_field_errors[0] === 'You need one time code.') {
				setShow2FA(true);
				setLogError(t('2FA_code_required'));
			}
			else
			{
				setLogError(t('login_error'));
				setUsername('');
            	setPassword('');
			}
			console.log(show2FA);
        }
	}

	const send_otp = async(e) => {
        e.preventDefault();
        try {
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            const response = await api.post('api/users/user/token/', { username, password, otp_code });
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
			setTwoFA(true);
            navigate("userPage/");
		} catch (error) {
			console.log(error);
			setLogError(t('2FA.invalid_2fa'));
        }
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
			takeData(setUserData);
			navigate("userPage/");
            setUsername('');
            setPassword('');
		} catch (error) {
			console.log(error);
			if (error.response.data.non_field_errors != null && error.response.data.non_field_errors[0] === 'You need one time code.') {
				setShow2FA(true);
				setLogError(t('needed_2fa'));
			}
			else
			{
				setLogError(t('login_error'));
				setUsername('');
            	setPassword('');
			}
			console.log(show2FA);
        }
    }

	const loginbutton42 = async () => {
		try {
			// the path in back should be in public so i can access api key witoout token //
			const response = await api.get('api/get-env/');
			const api_client_uid = response.data.client_id;
			const api_client_callback = response.data.callback_url;
			window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id='
			+ encodeURIComponent(api_client_uid) + '&redirect_uri=' +
			encodeURIComponent(api_client_callback) + '&response_type=code'
		} catch (error) {
			console.log("error while getting api42 credentials : ", error);
		}
		
	}

	return (
	<>
      	<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header d-flex flex-column align-content-center p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">{t('welcomeBack')}</h1>
        		    <button type="button" className="btn-close" aria-label="Close" data-bs-dismiss="modal"></button>
					<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
  						<path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1"/>
  						<path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z"/>
					</svg>
				  </div>
        		  <div className="modal-body p-5 pt-0 pb-3">
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="usernameLogin" placeholder={t('username')} autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="usernameLogin">{t('username')}</label>
        		      </div>
        		      <div className="form-floating">
        		        <input type="password" className="form-control rounded-3" id="passwordLogin" placeholder={t('password')} autoComplete='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="passwordLogin">{t('password')}</label>
        		      </div>
					  {errorLog ? <p className="mt-2 text-danger">{errorLog}</p> : null}
        		  	 </div>
					 {show2FA == true ?
					 <>
					 <div className="d-flex flex-column align-items-center ms-3 me-3 ps-4 pt-3 pe-4 pb-4 border-bottom-0">
					 <svg className="mb-3 bi bi-file-lock" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 5a1 1 0 0 1 1 1v1H7V6a1 1 0 0 1 1-1m2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224M6.105 8.125A.64.64 0 0 1 6.5 8h3a.64.64 0 0 1 .395.125c.085.068.105.133.105.175v2.4c0 .042-.02.107-.105.175A.64.64 0 0 1 9.5 11h-3a.64.64 0 0 1-.395-.125C6.02 10.807 6 10.742 6 10.7V8.3c0-.042.02-.107.105-.175"/>
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                     </svg>
					 <h1 className="fw-bold mb-2 mt-2 fs-4" id="loginModalLabel">{t('2FA.two_step_verification')}</h1>
					 <p className="mt-2">{t('2FA.verification_message')}</p>
					 <div className="row pt-2">
					 {[...Array(6)].map((_, index) => (
						 <div className="col" key={index}>
							 <input
								 type="text"
								 className="form-control text-center py-3"
								 maxLength="1"
								 autoFocus={index === 0}
								 value={otp_code.charAt(index)}
								 onChange={(event) => handleChange(event, index)}
								 ref={(el) => inputRefs.current[index] = el}
							 />
						 </div>
					 ))}
					 </div>
				 	 </div>
					 <div className="d-flex flex-column align-items-center">
					 <button className="btn btn-success btn-lg mt-3 mb-3 align-items-center" data-bs-dismiss="modal" onClick={send_otp}>{t('verify')}</button>
					 <button className="btn btn-danger btn-lg mb-3 align-items-center" data-bs-dismiss="modal" onClick={send_otp_again}>{t('again')}</button>
				 	 </div>
					</>
					:
					<>
					<div className="d-flex flex-row justify-content-center mb-4">
					 	<button onClick={loginbutton42} className="me-4" style={{ border: 'none', background: 'none', padding: 0 }}>
  							<img src="/42.png" alt="" height="100" width="100"/>
					 	</button>
						<p className="fs-4 mt-4 ms-3 me-4">{t('localGame.OR')}</p>
						<div className="d-flex flex-column ms-2 mt-2">
					 		<button className="btn btn-lg rounded-3 btn-primary" data-bs-dismiss="modal" onClick={loginbutton}>{t('login_login')}</button>
						</div>
					</div>
					</>
					}
        		</div>
        	</div>
		</div>
	</>
	);
}

export default LoginModal;
