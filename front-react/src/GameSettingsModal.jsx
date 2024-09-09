import React, { useState } from 'react';

function GameSettingsModal({ onStarTypeChange }) {
    const [starType, setstarType] = useState(0);  // Default size is 1.5

    const handleStarTypeChange = (event) => {
        console.log(event.target.value);
        setstarType(event.target.value);
    };

    return (
        <>
            <div className="modal fade" id="gameSettings" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <h4>What type of star</h4>
                            <select className="form-select" value={starType} onChange={handleStarTypeChange}>
                                <option value="0">The Sun</option>
                                <option value="1">White Dwarf</option>
                                <option value="2">Red Giant</option>
                                <option value="3">Else</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameSettingsModal;
