import React, { useContext, useState } from 'react';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { UserDataContext } from './UserDataContext';
import { useNavigate, useParams } from 'react-router-dom';
import takeData from './takeData';

function LoginModal()
{
	const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const {setUserData} = useContext(UserDataContext);
	const navigate = useNavigate();

    const loginbutton = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('users/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
			console.log(response.data);
			takeData(setUserData);
			navigate("userPage/");
            // Очистить форму после успешной регистрации
            setUsername('');
            setPassword('');
            setError('');
            // alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
		} catch (error) {
            alert(error);
        }
    }
	return (
	<>
      	<div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Welcome back !</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
        		  <div className="modal-body p-5 pt-0">
        		    <form onSubmit={loginbutton}>
        		      <div className="form-floating mb-2">
        		        <input type="text" className="form-control rounded-3" id="username" placeholder='Username' autoComplete='username' value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="username">Username</label>
        		      </div>
        		      <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="password" placeholder='Password' autoComplete='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
        		        <label htmlFor="password">Password</label>
        		      </div>
        		      <button className="w-90 mt-2 btn btn-lg rounded-3 btn-primary" type="submit" data-bs-dismiss="modal">Login</button>
        		      {error && <p className="text-danger">{error}</p>}
        		      </form>
        		    </div>
        		</div>
        	</div>
		</div>
	</>
	);
};

export default LoginModal