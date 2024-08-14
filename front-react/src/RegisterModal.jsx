import React, { useContext, useState } from 'react';
import api from "./api";
import { UserDataContext } from './UserDataContext';
import LoginModal from './LoginModal';
import { useNavigate } from "react-router-dom";

function RegisterModal() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const {setUserData} = useContext(UserDataContext);

    const signupbutton = async (e) => {
        e.preventDefault();
        
        // Проверка на совпадение паролей
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            localStorage.clear();
            const response = await api.post('users/user/register/', { username, email, password });
            console.log(response.data);
			setUserData(response.data);
            // Очистить форму после успешной регистрации
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');
            // alert('Registration successful'); // Всплывающее уведомление или другой способ уведомления пользователя
        } catch (error) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data); // Ошибка валидации с сервера
            } else {
                setError('Registration failed'); // Общая ошибка
            }
            console.error(error);
        }
    }

    return (
        <>
            <div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-4" id="signupModalLabel">Create your account now!</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <form onSubmit={signupbutton}>
                                <div className="form-floating mb-3">
                                    <input type="text" className="form-control rounded-3" id="paramUsername" placeholder="username" autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <label htmlFor="paramUsername">Username</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="email" className="form-control rounded-3" id="paramEmail" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <label htmlFor="paramEmail">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control rounded-3" id="paramPassword" placeholder="Password" autoComplete='new-password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <label htmlFor="paramPassword">Password</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input type="password" className="form-control rounded-3" id="paramcPassword" placeholder="Confirm Password" autoComplete='new-password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                    <label htmlFor="paramcPassword">Confirm Password</label>
                                </div>
                                <button className="w-70 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Sign-up</button>
                                {error && <p className="text-danger">{error}</p>}
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