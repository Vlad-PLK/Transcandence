import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";
import GuestModal from "./GuestModal";
import PlayerModal from "./PlayerModal";
import { useTranslation } from 'react-i18next';

function LocalGameModal() {
    const { t } = useTranslation();
    
    const { userData } = useContext(UserDataContext);

    return (
        <>
            <div className="modal fade" id="localGame" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header d-flex flex-column justify-content-center">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h1 className="fw-bold mb-0 fs-4" id="loginModalLabel">{t('localGame.setLocalGame')}</h1> 
                        </div>
                        <div className="modal-body mt-3 p-5 pt-0">
                            <div className="">
                                {userData && <p className="" style={{ color: 'blue' }}>{t('localGame.player1')}: {userData.username}</p>} 
                                <div className="row g-3 align-items-center" style={{ color: 'red' }}>
                                    <div className="col-auto">
                                        <label className="col-form-label">{t('localGame.player2')}:</label> 
                                    </div>
                                    <div className="col-auto d-flex flex-row">
                                        <button className="btn btn-sm btn-warning" data-bs-toggle="modal" data-bs-target="#guestModal">{t('localGame.playAsAGuest')}</button> 
                                        <p className="m-2" style={{ color: "#000" }}>{t('localGame.OR')}</p>
                                        <button className="ms-2 btn btn-sm btn-danger" style={{ color: "#000" }} data-bs-toggle="modal" data-bs-target="#playerModal">{t('login')}</button> 
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GuestModal />
            <PlayerModal />
        </>
    );
}

export default LocalGameModal;
