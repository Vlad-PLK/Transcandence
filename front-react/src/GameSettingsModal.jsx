import { useContext } from "react"
import { GameContext } from "./GameContext"

function GameSettingsModal() {
    const { gameData, setGameData } = useContext(GameContext);

    const handleChange = (event) => {
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

    const save_setttings = () => {
        //send request to back to save settings for the user//
        console.log(gameData);
    }
    const cancel_setttings = () => {
        //reset all selector to the previous state//
        console.log(gameData);
    }
    const default_setttings = () => {
        //reset all selector to default value//
        setGameData(prevState => ({
            ...prevState,
            starFlag:0,
            gargantuaSize:0,
            gargantuaColor:"0xc5e0e2",
            customStarSize:4,
            customStarColor:"0x2ec149",
            customStarIntensity:2,
            boostsEnabled:0,
            boostFactor:1,
            powerEnabled:0,
            gameDuration:10,
          }));
        console.log("GSM : 0",gameData);
    }
	return (
        <>
            <div className="modal fade" id="gameSettings" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <div>
                                <h5>Select the type of star you want</h5>
                                <select className="form-select" onChange={handleChange}>
                                    <option value="0">The Sun</option>
                                    <option value="1">White Dwarf</option>
                                    <option value="2">Red Giant</option>
                                    <option value="3">Gargantua</option>
                                    <option value="4">Custom</option>
                                </select>
                                {gameData.starFlag === "3" && (
                                <>
                                    <h5 className="pt-3">Select the size</h5>
                                    <div className="form-check">
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id="smallSize"
                                        name="gargantuaSize"
                                        value="0" // Small size
                                        onChange={handleBlackHoleSizeChange}
                                    />
                                    <label className="form-check-label" htmlFor="smallSize">Small</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="intermediateSize"
                                            name="gargacustomStarSizentuaSize"
                                            value="1" // Intermediate size
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
                                            onChange={handleBlackHoleSizeChange}
                                        />
                                        <label className="form-check-label" htmlFor="bigSize">Big</label>
                                    </div>
                                    <div>
                                        <h5 className="pt-3">Pick the color</h5>
                                        <form>
                                            <label htmlFor="gargantuaColor" className="form-label">Color picker</label>
                                            <input 
                                                type="color" 
                                                className="form-control form-control-color" 
                                                id="gargantuaColor"
                                                onChange={handleGargantuaColorChange}
                                                title="Choose a color"
                                            />
                                        </form>
                                    </div>
                                </>)}

                                {gameData.starFlag === "4" && (
                                    <>
                                        <div className="pt-3">
                                            <label htmlFor="customRange" className="form-label">Select the size</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="8"
                                                step="1"
                                                id="customRange"
                                                onChange={handleCustomSizeChange}
                                            />    
                                        </div>
                                        <div className="pt-3">
                                            <h5>Pick the color</h5>
                                            <form>
                                                <label htmlFor="customColor" className="form-label">Color picker</label>
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color"
                                                    id="customColor"
                                                    onChange={handleCustomColorChange}
                                                    title="Choose a color"
                                                />
                                            </form>
                                        </div>
                                        <div className="pt-3">
                                            <label htmlFor="customRange1" className="form-label">Select the intensity</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="6"
                                                step="1"
                                                id="customRange1"
                                                onChange={handleCustomIntensityChange}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="pt-4">
                                <h5>Do you want to add Boosters?</h5>
                                <select className="form-select" onChange={handleBoostChange}>
                                    <option value="0">Disable Boosters</option>
                                    <option value="1">Enable Boosters</option>
                                </select>
                                {gameData.boostsEnabled === "1" && (
                                <>
                                    <label htmlFor="customRange2" className="form-label">Select the booster speed factor</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        id="customRange2"
                                        onChange={handleBoostFactorChange}
                                    />
                                </>
                                )}
                            </div>
                            <div className="pt-4">
                                <h5>Do you want to add the losing streak power?</h5>
                                <select className="form-select" onChange={handlePowerChange}>
                                    <option value="0">Disable streak power</option>
                                    <option value="1">Enable streak power</option>
                                </select>
                            </div>
                            <div className="d=flex flex-column pt-3">
                                <button className="btn btn-md btn-success me-2" onClick={save_setttings}>SAVE</button>
                                <button className="btn btn-md btn-danger me-2" onClick={cancel_setttings}>CANCEL</button>
                                <button className="btn btn-md btn-warning" onClick={default_setttings}>DEFAULT</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameSettingsModal