function SettingsModal()
{
	return (
		<>
			<div className="modal fade" id="settingsModal" tabIndex="-1">
				<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
					<div className="modal-content rounded-4 shadow">
						<div className="modal-header p-5 pb-4 border-bottom-0">
							<h1 className="fw-bold mb-0 fs-4">Settings</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal"></button>
						</div>
						<div className="modal-body p-5 pt-0">
							<form action="">
								<div className="form-floating mb-2">
									<input type="username" className="form-control rounded-3" id="paramUsername-change" placeholder="Username"/>
									<label htmlFor="paramUsername-change">New Username</label>
								</div>
								<div className="form-floating mb-2">
									<input type="email" className="form-control rounded-3" id="paramEmail-change" placeholder="email@email.com"/>
									<label htmlFor="paramEmail-change">New Email</label>
								</div>
								<div className="form-floating mb-3">
									<input type="password" className="form-control rounded-3" id="paramPassword-change" placeholder="Password"/>
									<label htmlFor="paramPassword-change">New Password</label>
								</div>
								<button className="w-90 mb-2 btn btn-lg rounded-3 btn-primary me-2" type="submit">Save Changes</button>
								<button className="w-90 mb-2 btn btn-lg rounded-3 btn-danger" type="cancel">Cancel Changes</button>
        		      			<hr className="my-4"/>
							</form>
						</div>
					</div>
				</div>
			</div>
		</>
	);
	{/* <div> */}
      {/* <button data-bs-toggle="modal" data-bs-target="#settingsModal" > */}
        {/* <img src="./guychill.jpg" alt="" width="50" height="50"/> */}
      {/* </button> */}
    {/* </div> */}
    {/* <div class="dropdown"> */}
      {/* <a href="" data-bs-toggle="dropdown" data-bs-dismiss="false"> */}
        {/* <img src="./guychill.jpg" alt="" width="45" height="45" className="rounded-circle"/> */}
      {/* </a> */}
      {/* <ul class="dropdown-WelcomePage"> */}
        {/* <li><Link to={"/user/" + userData.id} className="dropdown-item ms-1">{userData.username}</Link></li> */}
        {/* <li><button className="dropdown-item ms-1" style={{background: 'none'}}  data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button></li> */}
        {/* <li><button className="dropdown-item ms-1" style={{background: 'none'}}>Disconnect</button></li> */}
      {/* </ul> */}
    {/* </div> */}
}

export default SettingsModal