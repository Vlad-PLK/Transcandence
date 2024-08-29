import {useContext, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {UserDataContext} from './UserDataContext';
import {useState} from 'react';
import api from './api';

function SettingsModal()
{
	const {userData} = useContext(UserDataContext);
	const [userAvatar, setUserAvatar] = useState(null);
	const [message, setMessage] = useState('');
	const {t} = useTranslation();
	const navigate = useNavigate();

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
			setMessage('Avatar uploaded successfully');
		} catch (error) {
			setMessage('Avatar upload failed');
			alert(error);
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
				setMessage('Username updated successfully');
			}).catch(error => {
				setMessage('Username update failed');
				alert(error);
			});
		}
	}
	return (
		<>
			<div className="modal fade" id="settingsModal" tabIndex="-1" style={{fontFamily:'cyber4'}}>
				<div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
					<div className="modal-content rounded-4 shadow">
						<div className="modal-header d-flex flex-column justify-content-center p-5 pb-4 border-bottom-0">
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
							<h1 className="fw-bold mb-0 fs-4">Settings</h1>
						</div>
						{userData && <div className="modal-body p-5 pt-0">
							<p>Change Avatar</p>
							<div className="d-flex mb-4">
								{userData.avatar == null ?
									<div>
										<input type="file" className="filetype" onChange={AvatarState}/>
										<img className="rounded bg-warning" src="/robot.webp" alt="" height="100" widht="100"/>
									</div>
									:
									<div>
										<input type="file" className="filetype" onChange={AvatarState}/>
										<img className="rounded bg-warning" src={userData.avatar} alt="" height="100" widht="100"/>
									</div>
								}
								<div className="d-flex flex-column justify-content-center ms-3 mt-2">
								<button className="btn btn-success btn-sm mb-2" onClick={changeAvatar}>SAVE</button>
								<button className="btn btn-danger btn-sm">CANCEL</button>
								{message && <p className="text-success">{message}</p>}
								</div>
							</div>
							<p className="m-0">Current Nickname : {userData.username}</p>
							<div className="form-floating mb-4">
								<input type="username" className="form-control rounded-3" id="paramUsername-change" placeholder="Username"/>
								<label htmlFor="paramUsername-change">Change Nickname</label>
								<button className="btn btn-success btn-sm mt-2 me-2" onClick={changeUsername}>SAVE</button>
								<button className="btn btn-danger btn-sm mt-2">CANCEL</button>
								{message && <p className="mt-2 text-success">{message}</p>}
							</div>
							<p className="m-0">Change Password</p>
							<div className="form-floating mb-2">
                                <input type="password" className="form-control rounded-3" id="paramPassword" placeholder="Password" autoComplete='new-password'/>
                                <label htmlFor="paramPassword">New Password</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input type="password" className="form-control rounded-3" id="paramcPassword" placeholder="Confirm Password" autoComplete='new-password'/>
                                <label htmlFor="paramcPassword">Confirm New Password</label>
								<button className="btn btn-success btn-sm mt-2 me-2">SAVE</button>
								<button className="btn btn-danger btn-sm mt-2">CANCEL</button>
                            </div>
						</div>}
					</div>
				</div>
			</div>
		</>
	);
}

export default SettingsModal