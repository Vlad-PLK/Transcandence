import { useContext } from "react"
import { UserDataContext } from "./UserDataContext"
import { useNavigate } from "react-router-dom";

function LocalGameModal() {
    const {userData} = useContext(UserDataContext);
    const navigate = useNavigate();
    const startGame=()=>{
        navigate("/userGame/")
    }
    return (
        <>
            <div className="modal fade" id="localGame" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header d-flex flex-column justify-content-center">
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">SET LOCAL GAME : </h1>
        		  </div>
        		  <div className="modal-body mt-3 p-5 pt-0">
                    <div className="">
                        <p className="" style={{color:'blue'}}>Player 1 : {userData.username}</p>
                        <p className="" style={{color:'red'}}>Player 2 : GUEST</p>
                    </div>
                    <div className="d-flex justify-content-center">
        		        <button className="btn btn-sm rounded-3 btn-dark" type="submit" data-bs-dismiss="modal" onClick={startGame}>START THE GAME</button>
                    </div>
                  </div>
        		</div>
        	</div>
		    </div>
        </>
    )
}

export default LocalGameModal