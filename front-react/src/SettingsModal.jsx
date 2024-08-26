import {useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import {UserDataContext} from './UserDataContext';

function SettingsModal()
{
	const {userData} = useContext(UserDataContext);
	const {t} = useTranslation();
	const navigate = useNavigate();
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
									<img className="rounded bg-warning" src="/robot.webp" alt="" height="100" widht="100"/>
									:
									<img className="rounded bg-warning" src="/guychill.jpg" alt="" height="100" widht="100"/>
								}
								<div className="d-flex flex-column justify-content-center ms-3 mt-2">
								<button className="btn btn-success btn-sm mb-2">SAVE</button>
								<button className="btn btn-danger btn-sm">CANCEL</button>
								</div>
							</div>
							<p className="m-0">Current Nickname : {userData.username}</p>
							<div className="form-floating mb-4">
								<input type="username" className="form-control rounded-3" id="paramUsername-change" placeholder="Username"/>
								<label htmlFor="paramUsername-change">Change Nickname</label>
								<button className="btn btn-success btn-sm mt-2 me-2">SAVE</button>
								<button className="btn btn-danger btn-sm mt-2">CANCEL</button>
							</div>
							<p className="m-0">Current Email : {userData.email}</p>
							<div className="form-floating mb-4">
								<input type="email" className="form-control rounded-3" id="paramEmail-change" placeholder="Email"/>
								<label htmlFor="paramEmail-change">Change Email</label>
								<button className="btn btn-success btn-sm mt-2 me-2">SAVE</button>
								<button className="btn btn-danger btn-sm mt-2">CANCEL</button>
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