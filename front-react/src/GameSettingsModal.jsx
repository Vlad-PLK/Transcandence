import { useContext, useState, useEffect } from "react";
import { GameContext } from "./GameContext";
import { useTranslation } from 'react-i18next';
import api from "./api";

function GameSettingsModal() {
    const { gameData, setGameData } = useContext(GameContext);
    const { t } = useTranslation();

    const [selectedStar, setSelectedStar] = useState(gameData.startFlag);
    const [selectedSize, setSelectedSize] = useState(gameData.customStarSize);
    const [selectedColor, setSelectedColor] = useState(gameData.customStarColor);
    const [selectedIntensity, setSelectedIntensity] = useState(gameData.customStarIntensity);
    const [selectedCorona, setSelectedCorona] = useState(gameData.customCoronaType);
    const [selectedBHSize, setSelectedBHSize] = useState(gameData.gargantuaSize);
    const [selectedBHIntensity, setSelectedBHIntensity] = useState(gameData.gargantuaIntensity);
    const [selectedBHColor, setSelectedBHColor] = useState(gameData.gargantuaColor);
    const [selectedBoost, setSelectedBoost] = useState(gameData.boostsEnabled);
    const [selectedBoostFactor, setSelectedBoostFactor] = useState(gameData.boostFactor);
    const [selectedPower, setSelectedPower] = useState(gameData.powerEnabled);

    const handleChange = (event) => {
        const star = event.target.value;
        setSelectedStar(star);
        setGameData(prevState => ({
            ...prevState,
            startFlag: star,
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

    const save_setttings = async() => {
        //send request to back to save settings for the user//
        await api.patch('api/update-game-settings/', 
            {
                startFlag: selectedStar,
                gargantuaSize: selectedBHSize,
                gargantuaColor: selectedBHColor,
                customStarSize: selectedSize,
                gargantuaIntensity: selectedBHIntensity,
                customStarColor: selectedColor,
                customCoronaType: selectedCorona,
                customStarIntensity: selectedIntensity,
                boostsEnabled: selectedBoost,
                boostFactor: selectedBoostFactor,
                powerEnabled: selectedPower,
                gameDuration: 20,
            }
        ).then(response => {
            console.log(response);
        }).catch(error => {
            console.log(error);
        })
    }
    const default_setttings = async() => {
        //reset all selector to default value//
        try
        {
            await api.put('api/update-game-settings/')
            .then(response => {
                setGameData(response.data);
            })
            .catch(error => {
                console.log('Error:', error);
            });
        }
        catch(error)
        {
            console.log(error);
        }
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
                                <h5>{t('gameSettings.selectStar')}</h5>
                                <select className="form-select" value={gameData.startFlag} onChange={handleChange}>
                                    <option value="0">{t('gameSettings.sun')}</option>
                                    <option value="1">{t('gameSettings.whiteDwarf')}</option>
                                    <option value="2">{t('gameSettings.redGiant')}</option>
                                    <option value="3">{t('gameSettings.gargantua')}</option>
                                    <option value="4">{t('gameSettings.custom')}</option>
                                </select>

                                {gameData.startFlag === "3" && (
                                    <>
                                        <h5 className="pt-3">{t('gameSettings.selectSize')}</h5>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="smallSize"
                                                name="gargantuaSize"
                                                value="1"
                                                onChange={handleBlackHoleSizeChange}
                                                checked={selectedBHSize === "1"}
                                            />
                                            <label className="form-check-label" htmlFor="smallSize">{t('gameSettings.small')}</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="intermediateSize"
                                                name="gargantuaSize"
                                                value="2"
                                                onChange={handleBlackHoleSizeChange}
                                                checked={selectedBHSize === "2"}
                                            />
                                            <label className="form-check-label" htmlFor="intermediateSize">{t('gameSettings.intermediate')}</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                id="bigSize"
                                                name="gargantuaSize"
                                                value="3"
                                                onChange={handleBlackHoleSizeChange}
                                                checked={selectedBHSize === "3"}
                                            />
                                            <label className="form-check-label" htmlFor="bigSize">{t('gameSettings.big')}</label>
                                        </div>

                                        <h5 className="pt-3">{t('gameSettings.pickColor')}</h5>
                                        <form>
                                            <label htmlFor="gargantuaColor" className="form-label">{t('gameSettings.colorPicker')}</label>
                                            <input
                                                type="color"
                                                className="form-control form-control-color"
                                                id="gargantuaColor"
                                                value={selectedBHColor}
                                                onChange={handleGargantuaColorChange}
                                                title={t('gameSettings.pickColor')}
                                            />
                                        </form>

                                        <div className="pt-3">
                                            <label htmlFor="customRange2" className="form-label">{t('gameSettings.intensity')} {selectedBHIntensity}</label>
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
                                    </>
                                )}

                                {gameData.startFlag === "4" && (
                                    <>
                                        <div className="pt-3">
                                            <label htmlFor="customRange" className="form-label">{t('gameSettings.selectSize')} {selectedSize}</label>
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
                                            <h5>{t('gameSettings.pickColor')}</h5>
                                            <form>
                                                <label htmlFor="customColor" className="form-label">{t('gameSettings.colorPicker')}</label>
                                                <input
                                                    type="color"
                                                    className="form-control form-control-color"
                                                    id="customColor"
                                                    value={selectedColor}
                                                    onChange={handleCustomColorChange}
                                                    title={t('gameSettings.pickColor')}
                                                />
                                            </form>
                                        </div>

                                        <div className="pt-3">
                                            <label htmlFor="customRange1" className="form-label">{t('gameSettings.intensity')} {selectedIntensity}</label>
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

                                        <h5>{t('gameSettings.corona')}</h5>
                                        <select className="form-select" value={selectedCorona} onChange={handleCustomCoronaType}>
                                            <option value="0">{t('gameSettings.noCorona')}</option>
                                            <option value="1">{t('gameSettings.corona1')}</option>
                                            <option value="2">{t('gameSettings.corona2')}</option>
                                        </select>
                                    </>
                                )}
                            </div>

                            <div className="pt-4">
                                <h5>{t('gameSettings.addBoosters')}</h5>
                                <select className="form-select" value={gameData.boostsEnabled.toString()} onChange={handleBoostChange}>
                                    <option value="0">{t('gameSettings.disableBoosters')}</option>
                                    <option value="1">{t('gameSettings.enableBoosters')}</option>
                                </select>
                                {gameData.boostsEnabled === "1" && (
                                    <>
                                        <label htmlFor="customRange2" className="form-label">{t('gameSettings.boosterSpeed')} {selectedBoostFactor}</label>
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
                                <h5>{t('gameSettings.addStreakPower')}</h5>
                                <select className="form-select" value={gameData.powerEnabled} onChange={handlePowerChange}>
                                    <option value="0">{t('gameSettings.disableStreakPower')}</option>
                                    <option value="1">{t('gameSettings.enableStreakPower')}</option>
                                </select>
                            </div>

                            <div className="d-flex flex-row pt-3">
                                <button className="btn btn-md btn-success me-2" onClick={save_setttings}>{t('gameSettings.save')}</button>
                                <button className="btn btn-md btn-warning" onClick={default_setttings}>{t('gameSettings.default')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameSettingsModal;
