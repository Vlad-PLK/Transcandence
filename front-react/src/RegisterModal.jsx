import RequestAPI from "./requestAPI";

function registerOn(){
	const username = document.getElementById("paramUsername");
	const email = document.getElementById("paramEmail");
	const password = document.getElementById("paramPassword");
	const cpassword = document.getElementById("paramcPassword");

	if (password != cpassword)
		return (
			<>
				<div className="alert alert-danger">Passwords didn't match !</div>
			</>
		);
	else
		RequestAPI('auth/register', 
			{"username": username, 
				"email": email, 
				"password": password},
			);
}

function RegisterModal(){
	
	const signupbutton=() => {
		registerOn();
	}
	return (
		<>
      		<div className="modal fade" id="signupModal" tabIndex="-1" aria-labelledby="signupModalLabel" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
        	  		<div className="modal-content rounded-4 shadow">
        	  		  <div className="modal-header p-5 pb-4 border-bottom-0">
        	  		    <h1 className="fw-bold mb-0 fs-4" id="signupModalLabel">Create you accout now!</h1>
        	  		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        	  		  </div>
        	  		  <div className="modal-body p-5 pt-0">
        	  		    <form>
						  <div className="form-floating mb-3">
        	  		        <input type="username" className="form-control rounded-3" id="paramUsername" placeholder="username"/>
        	  		        <label htmlFor="paramUsername">Username</label>
        	  		      </div>
        	  		      <div className="form-floating mb-3">
        	  		        <input type="email" className="form-control rounded-3" id="paramEmail" placeholder="name@example.com"/>
        	  		        <label htmlFor="paramEmail">Email address</label>
        	  		      </div>
        	  		      <div className="form-floating mb-3">
        	  		        <input type="password" className="form-control rounded-3" id="paramPassword" placeholder="Password"/>
        	  		        <label htmlFor="paramPassword">Password</label>
        	  		      </div>
							<div className="form-floating mb-3">
        	  		        <input type="password" className="form-control rounded-3" id="paramcPassword" placeholder="cPassword"/>
        	  		        <label htmlFor="paramcPassword">Confirm Password</label>
        	  		      </div>
        	  		      <button className="w-70 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" onClick={signupbutton}>Sign-up</button>
        	  		      <hr className="my-4"/>
        	  		      </form>
        	  		    </div>
        	  		</div>
        		</div>
			</div>
		</>
	);
};

export default RegisterModal