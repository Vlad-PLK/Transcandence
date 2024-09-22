import { useContext } from "react"
import { GameContext } from "./GameContext"

function GameSettingsModal() {
    const { gameData, setGameData } = useContext(GameContext);

    const handleChange = (event) => {
        console.log(event.target.value);
        setGameData(prevState => ({
            ...prevState,
            starFlag: event.target.value,
        }));
    };

    const handleBlackHoleSizeChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            gargantuaSize: event.target.value,
        }));
    };

    const handleGargantuaColorChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            gargantuaColor: event.target.value,
        }));
    };

    const handleCustomSizeChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            customStarSize: event.target.value,
        }));
    };

    const handleCustomColorChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            customStarColor: event.target.value,
        }));
    };

    const handleCustomIntensityChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            customStarIntensity: event.target.value,
        }));
    };

    const handleBoostChange = (event) => {
        setGameData(prevState => ({
          ...prevState,
          boostsEnabled: event.target.value,
        }));
      };

    const handleBoostFactorChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            boostFactor: event.target.value,
        }));
    };

    const handlePowerChange = (event) => {
        setGameData(prevState => ({
          ...prevState,
          powerEnabled: event.target.value,
        }));
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
                            <h4>Select the type of star you want</h4>
                            <select className="form-select" onChange={handleChange}>
                                <option value="0">The Sun</option>
                                <option value="1">White Dwarf</option>
                                <option value="2">Red Giant</option>
                                <option value="3">Gargantua</option>
                                <option value="4">Custom</option>
                            </select>
                        </div>

                        {gameData.starFlag === "3" && (
                            <>
                                <div className="modal-body p-5 pt-0">
                                <h4>Select the size</h4>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="smallSize"
                                    name="gargantuaSize"
                                    value="0" // Small size
                                    checked={gargantuaSize === 0}
                                    onChange={handleBlackHoleSizeChange}
                                />
                                <label className="form-check-label" htmlFor="smallSize">Small</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="intermediateSize"
                                    name="gargantuaSize"
                                    value="1" // Intermediate size
                                    checked={gargantuaSize === 1}
                                    onChange={handleBlackHoleSizeChange}
                                />
                                <label className="form-check-label" htmlFor="intermediateSize">Intermediate</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="bigSize"
                                    name="gargantuaSize"
                                    value="2" // Big size
                                    checked={gargantuaSize === 2}
                                    onChange={handleBlackHoleSizeChange}
                                />
                                <label className="form-check-label" htmlFor="bigSize">Big</label>
                            </div>
                        </div>

                        <div className="modal-body p-5 pt-0">
                            <h4>Pick the color</h4>
                            <form>
                                <label htmlFor="gargantuaColor" className="form-label">Color picker</label>
                                <input 
                                    type="color" 
                                    className="form-control form-control-color" 
                                    id="gargantuaColor"
                                    value={gargantuaColor} 
                                    onChange={handleGargantuaColorChange}
                                    title="Choose a color"
                                />
                            </form>
                        </div>
                            </>
                        )}

                        {gameData.starFlag === "4" && (
                            <>
                                <div className="modal-body p-5 pt-0">
                                    <label htmlFor="customRange" className="form-label">Select the size</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="8"
                                        step="1"
                                        id="customRange"
                                        value={customStarSize}
                                        onChange={handleCustomSizeChange}
                                    />
                                </div>

                                <div className="modal-body p-5 pt-0">
                                    <h4>Pick the color</h4>
                                    <form>
                                        <label htmlFor="customColor" className="form-label">Color picker</label>
                                        <input
                                            type="color"
                                            className="form-control form-control-color"
                                            id="customColor"
                                            value={customStarColor}
                                            onChange={handleCustomColorChange}
                                            title="Choose a color"
                                        />
                                    </form>
                                </div>

                                <div className="modal-body p-5 pt-0">
                                    <label htmlFor="customRange1" className="form-label">Select the intensity</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="6"
                                        step="1"
                                        id="customRange1"
                                        value={customStarIntensity}
                                        onChange={handleCustomIntensityChange}
                                    />
                                </div>
                            </>
                        )}
                        {gameData.boostsEnabled && (
                        <div className="modal-body p-5 pt-0">
                            <h4>Do you want to add Boosters?</h4>
                            <select 
                                className="form-select" 
                                value={boostsEnabled} 
                                onChange={handleBoostChange}
                            >
                                <option value="1">Enable Boosters</option>
                                <option value="0">Disable Boosters</option>
                            </select>
                        </div>)}

                        {gameData.boostsEnabled === "1" && (
                            <>
                                <div className="modal-body p-5 pt-0">
                                    <label htmlFor="customRange2" className="form-label">Select the booster speed factor</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        id="customRange2"
                                        value={boostFactor}
                                        onChange={handleBoostFactorChange}
                                    />
                                </div>
                            </>
                        )}

                        {gameData.powerEnabled && (
                        <div className="modal-body p-5 pt-0">
                            <h4>Do you want to add the losing streak power?</h4>
                            <select 
                                className="form-select" 
                                value={powerEnabled} 
                                onChange={handlePowerChange}
                            >
                                <option value="1">Enable streak power</option>
                                <option value="0">Enable streak power</option>
                            </select>
                        </div>)}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameSettingsModal