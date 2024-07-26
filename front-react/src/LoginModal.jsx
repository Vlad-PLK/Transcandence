import React, { useContext, useState } from 'react';
import api from "./api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { UserDataContext } from './UserDataContext';
import { useNavigate, useParams } from 'react-router-dom';

function LoginModal()
{
	const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const {userData} = useContext(UserDataContext);
	const navigate = useNavigate();

    const loginbutton = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('users/token/', { username, password });
			localStorage.setItem(ACCESS_TOKEN, response.data.access);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            console.log(response.data);
			console.log(userData.username);
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
        		        <input type="nickname" className="form-control rounded-3" id="paramUsername-log" placeholder="name" value={username} onChange={(e) => setUsername(e.target.value)}/>
        		        <label htmlFor="paramUsername-log">Username</label>
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