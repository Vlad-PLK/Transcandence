import RequestAPI from "./requestAPI";

function login(){
	const email = document.getElementById(paramEmail-log);
	const password = document.getElementById(paramPassword-log);
	RequestAPI('auth/login', {"email":email, "password":password});
}

function LoginModal()
{
	const loginAttempt = () => {
		login();
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
        		    <form className="">
        		      <div className="form-floating mb-2">
        		        <input type="email" className="form-control rounded-3" id="paramEmail-log" placeholder="name@example.com"/>
        		        <label htmlFor="paramEmail-log">Email address</label>
        		      </div>
        		      <div className="form-floating mb-2">
        		        <input type="password" className="form-control rounded-3" id="paramPassword-log" placeholder="Password"/>
        		        <label htmlFor="paramPassword-log">Password</label>
        		      </div>
        		      <button className="w-90 mb-2 btn btn-lg rounded-3 btn-primary" type="submit" onClick={loginAttempt}>Login</button>
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