function registerOn(){
	const username = document.getElementById("Username");
	const email = document.getElementById("Email");
	const password = document.getElementById("Password");
	const cpassword = document.getElementById("cPassword");
	console.log(username);
	console.log(email);
	console.log(password);
	console.log(cpassword);
}

function RegisterModal(){
	
	const signupbutton=() => {
		registerOn();
	}
	
	return (
		<>
        	<div className="modal-dialog" role="document">
			<div className="modal modal-sheet position-static d-block bg-warning p-4 py-md-5" tabindex="-1" role="dialog" id="modalLogin">
        	  <div className="modal-content rounded-4 shadow">
        	    <div className="modal-header p-5 pb-4 border-bottom-0">
        	      <h1 className="fw-bold mb-0 fs-2">Create you accout now!</h1>
        	      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        	    </div>
        	    <div className="modal-body p-5 pt-0">
        	      <form className="">
				 	 <div className="form-floating mb-3">
        	          <input type="fname" className="form-control rounded-3" id="Username" placeholder="firstname"/>
        	          <label for="floatingInput">Username</label>
        	        </div>
        	        <div className="form-floating mb-3">
        	          <input type="email" className="form-control rounded-3" id="Email" placeholder="name@example.com"/>
        	          <label for="floatingInput">Email address</label>
        	        </div>
        	        <div className="form-floating mb-3">
        	          <input type="password" className="form-control rounded-3" id="Password" placeholder="Password"/>
        	          <label for="floatingPassword">Password</label>
        	        </div>
					<div className="form-floating mb-3">
        	          <input type="password" className="form-control rounded-3" id="cPassword" placeholder="cPassword"/>
        	          <label for="floatingPassword">Confirm Password</label>
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