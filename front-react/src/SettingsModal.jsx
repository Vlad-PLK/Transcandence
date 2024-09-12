import {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {UserDataContext} from './UserDataContext';
import {useState} from 'react';
import api from './api';

function SettingsModal()
{
	const {userData} = useContext(UserDataContext);
	const [error, setError] = useState('');
	const [errorAvatar, setErrorAvatar] = useState('');
	const [errorNick, setErrorNick] = useState('');
	const [errorPass, setErrorPass] = useState('');
	const [messageAvatar, setMessageAvatar] = useState('');
	const [messageNick, setMessageNick] = useState('');
	const [messagePass, setMessagePass] = useState('');
	const [userAvatar, setUserAvatar] = useState(null);
	const [message, setMessage] = useState('');
	const {t} = useTranslation();
	const navigate = useNavigate();

	const clearNick = () => {
		document.getElementById('paramUsername-change').value = '';
		setErrorNick('');
	}
	const clearAvatar = () => {
		document.getElementById('avatar0').value = '';
		document.getElementById('avatar1').value = '';
		setErrorAvatar('');
	}
	const clearPass = () => {
		document.getElementById('oldPassword').value = '';
		document.getElementById('paramNewPassword').value = '';
		document.getElementById('paramNewConfirmPassword').value = '';
		setErrorPass('');
	}
	const clearAll = () => {
		clearAvatar();
		clearNick();
		clearPass();
		setMessageAvatar('');
		setMessageNick('');
		setMessagePass('');
	}
	const AvatarState = (event) => {
		if (event.target.files && event.target.files[0]) {
			console.log(event.target.files[0]);
			setUserAvatar(URL.createObjectURL(event.target.files[0]));
		}
	}
	const changeAvatar = async (e) => {
		e.preventDefault();
		try {
			const formData = new FormData();
			formData.append('avatar', userAvatar);
			const response = await api.post('users/avatar_upload/', formData, {
				headers: {
				  'Content-Type': 'multipart/form-data',
				},
			  });
			console.log(response.data);
			setMessageAvatar('Avatar uploaded successfully');
		} catch (error) {
			setErrorAvatar('Avatar upload failed');
		}
	}
	// clear form after submit //
	// rerender the page after submit //
	const changeUsername = () => {
		const newUsername = document.getElementById('paramUsername-change').value;
		if (newUsername.length > 0) {
			api.patch('users/user/update-username/', {
				username: newUsername
			}).then(response => {
				console.log(response.data);
				document.getElementById('paramUsername-change').value = '';
				setMessageNick('Username updated successfully');
			}).catch(error => {
				setErrorNick('Username update failed');
			});
		}
		//check for existing usernames or if its the same//
	}
	const changePassword = () => {
		const oldPass = document.getElementById('oldPassword').value;
		const newPass = document.getElementById('paramNewPassword').value;
		const newConfirmPass = document.getElementById('paramNewConfirmPassword').value;
		if (newPass.length > 0 && newConfirmPass.length > 0) {
			setErrorPass("");
			if (newPass != newConfirmPass)
				setErrorPass("New Passwords are different");
			else
			{
				api.post('change-password/', {
					old_password: oldPass,
					new_password: newPass,
					confirm_new_password: newConfirmPass
				}).then(response => {
					console.log(response);
					console.log(response.data);
					document.getElementById('oldPassword').value = '';
					document.getElementById('paramNewPassword').value = '';
					document.getElementById('paramNewConfirmPassword').value = '';
					setMessagePass('Password updated successfully');
				}).catch(error => {
					console.log(error.response.data);
					setErrorPass('Password update failed : ' + error.response.data.old_password);
				});
			}
		}
	}
	return (
		<>
			<div className="modal fade" id="settingsModal" tabIndex="-1" style={{fontFamily:'cyber4'}}>
				<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
					<div className="modal-content rounded-4 shadow">
						<div className="modal-header d-flex flex-column justify-content-center p-5 pb-4 border-bottom-0">
							<button type="button" className="btn-close" data-bs-dismiss="modal" onClick={clearAll}></button>
							<h1 className="fw-bold mb-0 fs-4">Settings</h1>
						</div>
						{userData && <div className="modal-body p-5 pt-0">
							<p>Change Avatar</p>
							<div className="d-flex mb-4">
								{userData.avatar == null ?
									<div>
										<input type="file" id="avatar0" className="filetype" onChange={AvatarState}/>
										<img className="rounded bg-warning" src="/robot.webp" alt="" height="100" widht="100"/>
									</div>
									:
									<div>
										<input type="file" id="avatar1" className="filetype" onChange={AvatarState}/>
										<img className="rounded bg-warning" src={userData.avatar} alt="" height="100" widht="100"/>
									</div>
								}
								<div className="d-flex flex-column justify-content-center ms-3 mt-2">
								<button className="btn btn-success btn-sm mb-2" onClick={changeAvatar}>SAVE</button>
								<button className="btn btn-danger btn-sm" onClick={clearAvatar}>CANCEL</button>
								{messageAvatar && <p className="text-success">{messageAvatar}</p>}
								{errorAvatar && <p className="mt-2 text-danger">{errorAvatar}</p>}
								</div>
							</div>
							<p className="m-0">Current Nickname : {userData.username}</p>
							<div className="form-floating mb-4">
								<input type="username" className="form-control rounded-3" id="paramUsername-change" placeholder="Username"/>
								<label htmlFor="paramUsername-change">Change Nickname</label>
								<button className="btn btn-success btn-sm mt-2 me-2" onClick={changeUsername}>SAVE</button>
								<button className="btn btn-danger btn-sm mt-2" onClick={clearNick}>CANCEL</button>
								{messageNick && <p className="mt-2 text-success">{messageNick}</p>}
								{errorNick && <p className="mt-2 text-danger">{errorNick}</p>}
							</div>
							<p className="m-0">Change Password</p>
							<div className="form-floating mb-2">
                                <input type="password" className="form-control rounded-3" id="oldPassword" placeholder="Password" autoComplete='new-password'/>
                                <label htmlFor="paramPassword">Old Password</label>
                            </div>
							<div className="form-floating mb-2">
                                <input type="password" className="form-control rounded-3" id="paramNewPassword" placeholder="Password" autoComplete='new-password'/>
                                <label htmlFor="paramPassword">New Password</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input type="password" className="form-control rounded-3" id="paramNewConfirmPassword" placeholder="Confirm Password" autoComplete='new-password'/>
                                <label htmlFor="paramcPassword">Confirm New Password</label>
								<button className="btn btn-success btn-sm mt-2 me-2" onClick={changePassword}>SAVE</button>
								<button className="btn btn-danger btn-sm mt-2" onClick={clearPass}>CANCEL</button>
								{errorPass && <p className="mt-2 text-danger">{errorPass}</p>}
								{messagePass && <p className="mt-2 text-success">{messagePass}</p>}
                            </div>
						</div>}
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsModal