import { useContext, useState } from "react";
import { GameContext } from "./GameContext"

function GameSettingsModal() {
    const { gameData, setGameData } = useContext(GameContext);

    const [selectedStar, setSelectedStar] = useState(gameData.starFlag || 0);
    const [selectedSize, setSelectedSize] = useState(gameData.customStarSize || 1);
    const [selectedColor, setSelectedColor] = useState(gameData.customStarColor || "#DC1010");
    const [selectedIntensity, setSelectedIntensity] = useState(gameData.customStarIntensity || 1);
    const [selectedCorona, setSelectedCorona] = useState(gameData.customCoronaType || 0);
    const [selectedBHSize, setSelectedBHSize] = useState(gameData.gargantuaSize || 2);
    const [selectedBHIntensity, setSelectedBHIntensity] = useState(gameData.gargantuaIntensity || 1);
    const [selectedBHColor, setSelectedBHColor] = useState(gameData.gargantuaColor || "#c5e0e2");
    const [selectedBoost, setSelectedBoost] = useState(gameData.boostsEnabled || 0);
    const [selectedBoostFactor, setSelectedBoostFactor] = useState(gameData.boostFactor || 1);
    const [selectedPower, setSelectedPower] = useState(gameData.powerEnabled || 0);

    const handleChange = (event) => {
        const star = event.target.value;
        console.log(star);
        setSelectedStar(star);
        setGameData(prevState => ({
            ...prevState,
            starFlag: star,
        }));
    };

    const handleBlackHoleSizeChange = (event) => {
        const newBHSize = event.target.value;
        setSelectedBHSize(newBHSize);
        setGameData(prevState => ({
            ...prevState,
            gargantuaSize: newBHSize,
        }));
    };

    const handleGargantuaColorChange = (event) => {
        const newBHColor = event.target.value;
        setSelectedBHColor(newBHColor);
        setGameData(prevState => ({
            ...prevState,
            gargantuaColor: newBHColor,
        }));
    };

    const handleGargantuaIntensityChange = (event) => {
        const newBHIntensity = event.target.value;
        setSelectedBHIntensity(newBHIntensity);
        setGameData(prevState => ({
            ...prevState,
            gargantuaIntensity: newBHIntensity,
        }));
    };

    const handleCustomSizeChange = (event) => {
        const newSize = event.target.value;
        setSelectedSize(newSize);
        setGameData(prevState => ({
            ...prevState,
            customStarSize: newSize,
        }));
    };

    const handleCustomColorChange = (event) => {
        const newColor = event.target.value;
        setSelectedColor(newColor);
        setGameData(prevState => ({
            ...prevState,
            customStarColor: newColor,
        }));
    };

    const handleCustomCoronaType = (event) => {
        const newCorona = event.target.value;
        setSelectedCorona(newCorona);
        setGameData(prevState => ({
            ...prevState,
            customCoronaType: newCorona,
        }));
    };

    const handleCustomIntensityChange = (event) => {
        const newIntensity = event.target.value;
        setSelectedIntensity(newIntensity);
        setGameData(prevState => ({
            ...prevState,
            customStarIntensity: newIntensity,
        }));
    };

    const handleBoostChange = (event) => {
        const newBoost = event.target.value;
        setSelectedBoost(newBoost);
        setGameData(prevState => ({
          ...prevState,
          boostsEnabled: newBoost,
        }));
      };

    const handleBoostFactorChange = (event) => {
        const newBoostFactor = event.target.value;
        setSelectedBoostFactor(newBoostFactor);
        setGameData(prevState => ({
            ...prevState,
            boostFactor: newBoostFactor,
        }));
    };

    const handlePowerChange = (event) => {
        const newPower = event.target.value;
        setSelectedPower(newPower);
        setGameData(prevState => ({
          ...prevState,
          powerEnabled: newPower,
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
        setSelectedStar(0);
        setSelectedBHSize(2.0);
        setSelectedBHColor("#c5e0e2");
        setSelectedBHIntensity(1.0);
        setSelectedSize(4);
        setSelectedColor("#DC1010");
        setSelectedCorona(0);
        setSelectedIntensity(4);
        setSelectedBoost(0);
        setSelectedBoostFactor(1);
        setSelectedPower(0);
        setGameData(prevState => ({
            ...prevState,
            starFlag:0,
            gargantuaSize:2.0,
            gargantuaColor:"#c5e0e2",
            gargantuaIntensity:1.0,
            customStarSize:4,
            customStarColor:"#DC1010",
            customCoronaType:0,
            customStarIntensity:4,
            boostsEnabled:0,
            boostFactor:1,
            powerEnabled:0,
            gameDuration:10,
          }));
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
                                <select className="form-select" value={selectedStar} onChange={handleChange}>
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
                                        value="1.0" // Small size
                                        onChange={handleBlackHoleSizeChange}
                                        checked={selectedBHSize === "1.0"}
                                    />
                                    <label className="form-check-label" htmlFor="smallSize">Small</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="intermediateSize"
                                            name="gargacustomStarSizentuaSize"
                                            value="2.0" // Intermediate size
                                            onChange={handleBlackHoleSizeChange}
                                            checked={selectedBHSize === "2.0"}
                                        />
                                        <label className="form-check-label" htmlFor="intermediateSize">Intermediate</label>
                                    </div>
                                    <div className="form-check">
                                        <input
                                            type="radio"
                                            className="form-check-input"
                                            id="bigSize"
                                            name="gargantuaSize"
                                            value="3.0" // Big size
                                            onChange={handleBlackHoleSizeChange}
                                            checked={selectedBHSize === "3.0"}
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
                                                value={selectedBHColor}
                                                onChange={handleGargantuaColorChange}
                                                title="Choose a color"
                                            />
                                        </form>
                                    </div>
                                    <div className="pt-3">
                                            <label htmlFor="customRange2" className="form-label">Select the intensity: {selectedBHIntensity}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="3"
                                                step="1"
                                                id="customRange2"
                                                value={selectedBHIntensity}
                                                onChange={handleGargantuaIntensityChange}
                                            />
                                        </div>
                                </>)}

                                {gameData.starFlag === "4" && (
                                    <>
                                        <div className="pt-3">
                                            <label htmlFor="customRange" className="form-label">Select the size: {selectedSize}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="8"
                                                step="1"
                                                id="customRange"
                                                value={selectedSize}
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
                                                    value={selectedColor}
                                                    onChange={handleCustomColorChange}
                                                    title="Choose a color"
                                                />
                                            </form>
                                        </div>
                                        <div className="pt-3">
                                            <label htmlFor="customRange1" className="form-label">Select the intensity: {selectedIntensity}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="8"
                                                step="1"
                                                id="customRange1"
                                                value={selectedIntensity}
                                                onChange={handleCustomIntensityChange}
                                            />
                                        </div>
                                        <div>
                                            <h5>Select the type of corona you want</h5>
                                            <select className="form-select" value={selectedCorona} onChange={handleCustomCoronaType}>
                                                <option value="0">No corona</option>
                                                <option value="1">Corona type 1</option>
                                                <option value="2">Corona type 2</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="pt-4">
                                <h5>Do you want to add Boosters?</h5>
                                <select className="form-select" value={selectedBoost} onChange={handleBoostChange}>
                                    <option value="0">Disable Boosters</option>
                                    <option value="1">Enable Boosters</option>
                                </select>
                                {gameData.boostsEnabled === "1" && (
                                <>
                                    <label htmlFor="customRange2" className="form-label">Select the booster speed factor: {selectedBoostFactor}</label>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1"
                                        max="3"
                                        step="1"
                                        id="customRange2"
                                        value={selectedBoostFactor}
                                        onChange={handleBoostFactorChange}
                                    />
                                </>
                                )}
                            </div>
                            <div className="pt-4">
                                <h5>Do you want to add the losing streak power?</h5>
                                <select className="form-select" value={selectedPower} onChange={handlePowerChange}>
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