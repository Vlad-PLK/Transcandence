import React, { useContext, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import LoginModal from './LoginModal';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import useTranslation

function RegisterModal() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [err, setError] = useState('');
    const {setUserData} = useContext(UserDataContext);
    const [msg, setMsg] = useState('');
    const [modalState, setModalState] = useState(true);
    const clearForm = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setError('');
        setMsg('');
    }
    const closeModal = () => {
        setModalState(!modalState);
    }
    const signupbutton = async (e) => {
        e.preventDefault();
        
        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            setError(t('register.errors.passwords_mismatch')); // Use translation for error
            return;
        }

        try {
            localStorage.clear();
            const response = await api.post('api/users/user/register/', { username, email, password });
            console.log(response.data);
			setUserData(response.data);
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            setMsg(t('register.success')); // Use translation for success message
            closeModal();
        } catch (error) {
            setMsg('');
            setError(error.response.data.username);
        }
    }

    return (
        <>
            <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-4" id="signupModalLabel">{t('register.title')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearForm}></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <form onSubmit={signupbutton}>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control rounded-3" id="paramUsername" placeholder={t('register.username')} autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <label htmlFor="paramUsername">{t('register.username')}</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control rounded-3" id="paramEmail" placeholder={t('register.email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <label htmlFor="paramEmail">{t('register.email')}</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control rounded-3" id="paramPassword" placeholder={t('register.password')} autoComplete='new-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <label htmlFor="paramPassword">{t('register.password')}</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control rounded-3" id="paramcPassword" placeholder={t('register.confirm_password')} autoComplete='new-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    <label htmlFor="paramPassword">{t('register.confirm_password')}</label>
                                </div>
                                <button className="w-70 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">{t('register.sign_up')}</button>
                                {err && <p className="text-danger">{err}</p>}
                                {msg && <p className="text-success">{msg}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <LoginModal/>
        </>
    );
}

export default RegisterModal;
