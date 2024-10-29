import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { useNavigate } from 'react-router-dom';
import takeData from './takeData';
import { UserDataContext } from './UserDataContext';
import { TwoFaContext } from './TwoFaContext';

function TwoFAModal({username, password}) 
{
    const { t } = useTranslation();
	const [errorLog, setLogError] = useState('');
	const navigate = useNavigate();
    const [otp_code, setCode] = useState('');
    const {TwoFA, setTwoFA} = useContext(TwoFaContext);
    const inputRefs = useRef([]);
	const { setUserData } = useContext(UserDataContext);

    const check_2FA = () => {
      api.get('api/users/user/status-2fa/')
      .then(response => {
          setTwoFA(response.data.is_2fa_enabled);
          console.log(response.data);
      })
      .catch(error => {
          console.log('Error:', error);
        // alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
      });
    }

    const handleChange = (event, index) => {
        const newCode = otp_code.split('');
        newCode[index] = event.target.value;
        setCode(newCode.join(''));

        if (event.target.value && index < 5){
            inputRefs.current[index + 1].focus();
        }
    };

    const send_otp = async(e) => {
        e.preventDefault();
        try {
            console.log(TwoFA)
			localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            const response = await api.post('api/users/user/token/', { username, password, otp_code });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			takeData(setUserData);
            //check_2FA();
            navigate("userPage/");
		} catch (error) {
			setLogError("Invalid 2FA code please try again");
        }
    }

    return (
        <>
        <div className="modal show" id="twofaModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
            <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header d-flex flex-column p-5 pb-4 border-bottom-0">
        		        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        <svg className="mb-3 bi bi-file-lock" xmlns="http://www.w3.org/2000/svg" width="60" height="60" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 5a1 1 0 0 1 1 1v1H7V6a1 1 0 0 1 1-1m2 2.076V6a2 2 0 1 0-4 0v1.076c-.54.166-1 .597-1 1.224v2.4c0 .816.781 1.3 1.5 1.3h3c.719 0 1.5-.484 1.5-1.3V8.3c0-.627-.46-1.058-1-1.224M6.105 8.125A.64.64 0 0 1 6.5 8h3a.64.64 0 0 1 .395.125c.085.068.105.133.105.175v2.4c0 .042-.02.107-.105.175A.64.64 0 0 1 9.5 11h-3a.64.64 0 0 1-.395-.125C6.02 10.807 6 10.742 6 10.7V8.3c0-.042.02-.107.105-.175"/>
                            <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/>
                        </svg>
                        <h1 className="fw-bold mb-2 mt-2 fs-4" id="loginModalLabel">{t("2FA.two_step_verification")}</h1>
                        <p className="mt-2">{t("2FA.verification_message")}</p>
                    </div>
                    <div className="modal-body p-5 pt-0">
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
                    <div className="d-flex flex-column align-items-center">
                    <button className="btn btn-success btn-lg mt-4 align-items-center" data-bs-dismiss="modal" onClick={send_otp}>{t("2FA.verify")}</button>
                        {errorLog && <p className="mt-2 text-danger">{errorLog}</p>}
                    </div>
        		  	</div>
        		</div>
            </div>
        </div>
        </>
        
    );
};

export default TwoFAModal;