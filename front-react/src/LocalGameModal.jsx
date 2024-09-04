import { useContext, useRef } from "react"
import { UserDataContext } from "./UserDataContext"
import { useNavigate } from "react-router-dom";
import { GuestDataContext } from "./GuestDataContext";

function LocalGameModal() {
    const inputRef = useRef();
    const {userData} = useContext(UserDataContext);
    const {guestData, setGuestData} = useContext(GuestDataContext);
    const navigate = useNavigate();
    const clearInput=(inputRef)=>{
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
    const startGame=()=>{
        setGuestData(inputRef.current.value);
        clearInput(inputRef);
        navigate("/userGameWindow/")
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
                        {userData && <p className="" style={{color:'blue'}}>Player 1 : {userData.username}</p>}
                        <div className="row g-3 align-items-center" style={{color:'red'}}>
                            <div className="col-auto">
                              <label className="col-form-label">Player 2 :</label>
                            </div>
                            <div className="col-auto">
                              <input type="text" className="form-control" ref={inputRef}/>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex justify-content-center mt-3">
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