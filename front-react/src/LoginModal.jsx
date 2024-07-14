import React, { useState } from 'react';
import axios from 'axios'; // импортируем axios

function LoginModal()
{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
	const [error, setError] = useState('');

    const loginbutton = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login/', {
                email: email,
                password: password
            });
            console.log(response.data);
            // Очистить форму после успешной регистрации
            setEmail('');
            setPassword('');
            setError('');
            alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data); // Ошибка валидации с сервера
            } else {
                setError('Login failed'); // Общая ошибка
            }
            console.error(err);
        }
    }
	return (
	<>
      	<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Welcome back !</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    <form onSubmit={loginbutton}>
        		      <div className="form-floating mb-2">
        		        <input type="email" className="form-control rounded-3" id="paramEmail-log" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}/>
        		        <label htmlFor="paramEmail-log">Email address</label>
        		      </div>
        		      <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="paramPassword-log" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="paramPassword-log">Password</label>
        		      </div>
        		      <button className="w-90 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">Login</button>
        		      {error && <p className="text-danger">{error}</p>}
					  <hr className="my-4"/>
        		      </form>
        		    </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default LoginModal