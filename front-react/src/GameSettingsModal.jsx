import { useContext } from "react"
import { GameContext } from "./GameContext"

function GameSettingsModal() {
	const {gameData, setGameData} = useContext(GameContext);
	console.log("GameData STARFLAG", gameData.starFlag);
	const handleChange = (event) => {
		setGameData(prevState => ({
				...prevState,
				starFlag:event.target.value,
		}))
		console.log("GameData STARFLAG", gameData.starFlag);
	}
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
                            <select className="form-select" onChange={handleChange}>
                                <option value="0">The Sun</option>
                                <option value="1">White Dwarf</option>
                                <option value="2">Red Giant</option>
                                <option value="3">Else</option>
                            </select>
                        </div>
						<div className="modal-body p-5 pt-0">
                            <h4>What type of star</h4>
                            <select className="form-select" onChange={handleChange}>
                                <option value="0">The Sun</option>
                                <option value="1">White Dwarf</option>
                                <option value="2">Red Giant</option>
                                <option value="3">Else</option>
                            </select>
                        </div>
						<div className="modal-body p-5 pt-0">
                            <h4>What type of star</h4>
                            <select className="form-select" onChange={handleChange}>
                                <option value="0">The Sun</option>
                                <option value="1">White Dwarf</option>
                                <option value="2">Red Giant</option>
                                <option value="3">Else</option>
                            </select>
                        </div>
						<div className="modal-body p-5 pt-0">
                            <h4>What type of star</h4>
                            <select className="form-select" onChange={handleChange}>
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
    )
}

export default GameSettingsModal