function MultiplayerModal() {
    return (
        <>
            <div className="modal fade" id="multiplayerModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        	<div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        		<div className="modal-content rounded-4 shadow">
        		  <div className="modal-header p-5 pb-4 border-bottom-0">
        		    <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">Multiplayer Coming Soon !</h1>
        		    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        		  </div>
				  <div className="modal-body ps-4 ms-4 mt-2 mb-4 border-bottom-0">
						<a className="text-decoration-none text-dark fs-4" href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">For more details, click here</a>
				  </div>
        		</div>
        	</div>
		</div>
        </>
    )
}

export default MultiplayerModal