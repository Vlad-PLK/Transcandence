import { useContext, useState, useEffect } from "react";
import { GameContext } from "./GameContext";
import { useTranslation } from 'react-i18next';
import api from "./api";

function GameSettingsModal() {
    const { gameData, setGameData } = useContext(GameContext);
    const [msg, setMsg] = useState(null);
    const { t } = useTranslation();

    const handleChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            startFlag: event.target.value,
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

    const handleGargantuaIntensityChange = (event) => {
        setGameData(prevState => ({
            ...prevState,
            gargantuaIntensity: event.target.value,
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

    const handleCustomCoronaType = (event) => {
        setGameData(prevState => ({
            ...prevState,
            customCoronaType: event.target.value,
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

    const save_setttings = async() => {
        //send request to back to save settings for the user//
        await api.patch('api/update-game-settings/', 
            {
                startFlag: gameData.startFlag,
                gargantuaSize: gameData.gargantuaSize,
                gargantuaColor: gameData.gargantuaColor,
                customStarSize: gameData.customStarSize,
                gargantuaIntensity: gameData.gargantuaIntensity,
                customStarColor: gameData.customStarColor,
                customCoronaType: gameData.customCoronaType,
                customStarIntensity: gameData.customStarIntensity,
                boostsEnabled: gameData.boostsEnabled,
                boostFactor: gameData.boostFactor,
                powerEnabled: gameData.powerEnabled,
                gameDuration: 3,
            }
        ).then(response => {
            setMsg('');
            setMsg(t('gameSettings.save_msg'));
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
                setMsg('');
                setMsg(t('gameSettings.default_msg'));
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

    const reset_msg = () => {
        setMsg('');
    }
    return (
        <>
            <div className="modal fade" id="gameSettings" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={reset_msg}></button>
                        </div>
                        {gameData &&
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
                                                checked={gameData.gargantuaSize === "1"}
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
                                                checked={gameData.gargantuaSize === "2"}
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
                                                checked={gameData.gargantuaSize === "3"}
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
                                                value={gameData.gargantuaColor}
                                                onChange={handleGargantuaColorChange}
                                                title={t('gameSettings.pickColor')}
                                            />
                                        </form>

                                        <div className="pt-3">
                                            <label htmlFor="customRange2" className="form-label">{t('gameSettings.intensity')} {gameData.gargantuaIntensity}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="3"
                                                step="1"
                                                id="customRange2"
                                                value={gameData.gargantuaIntensity}
                                                onChange={handleGargantuaIntensityChange}
                                            />
                                        </div>
                                    </>
                                )}

                                {gameData.startFlag === "4" && (
                                    <>
                                        <div className="pt-3">
                                            <label htmlFor="customRange" className="form-label">{t('gameSettings.selectSize')} {gameData.customStarSize}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="8"
                                                step="1"
                                                id="customRange"
                                                value={gameData.customStarSize}
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
                                                    value={gameData.customStarColor}
                                                    onChange={handleCustomColorChange}
                                                    title={t('gameSettings.pickColor')}
                                                />
                                            </form>
                                        </div>

                                        <div className="pt-3">
                                            <label htmlFor="customRange1" className="form-label">{t('gameSettings.intensity')} {gameData.customStarIntensity}</label>
                                            <input
                                                type="range"
                                                className="form-range"
                                                min="1"
                                                max="8"
                                                step="1"
                                                id="customRange1"
                                                value={gameData.customStarIntensity}
                                                onChange={handleCustomIntensityChange}
                                            />
                                        </div>

                                        <h5>{t('gameSettings.corona')}</h5>
                                        <select className="form-select" value={gameData.customCoronaType} onChange={handleCustomCoronaType}>
                                            <option value="0">{t('gameSettings.noCorona')}</option>
                                            <option value="1">{t('gameSettings.corona1')}</option>
                                            <option value="2">{t('gameSettings.corona2')}</option>
                                        </select>
                                    </>
                                )}
                            </div>

                            <div className="pt-4">
                                <h5>{t('gameSettings.addBoosters')}</h5>
                                <select className="form-select" value={gameData.boostsEnabled} onChange={handleBoostChange}>
                                    <option value="0">{t('gameSettings.disableBoosters')}</option>
                                    <option value="1">{t('gameSettings.enableBoosters')}</option>
                                </select>
                                {gameData.boostsEnabled === "1" && (
                                    <>
                                        <label htmlFor="customRange2" className="form-label">{t('gameSettings.boosterSpeed')} {gameData.boostFactor}</label>
                                        <input
                                            type="range"
                                            className="form-range"
                                            min="1"
                                            max="3"
                                            step="1"
                                            id="customRange2"
                                            value={gameData.boostFactor}
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
                            {msg && <p className="mt-2 text-success">{msg}</p>}
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameSettingsModal;
