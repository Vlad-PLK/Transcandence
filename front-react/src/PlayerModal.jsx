import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GuestDataContext } from "./GuestDataContext";
import api from "./api";
import { useTranslation } from 'react-i18next';

function PlayerModal() {
    const { t } = useTranslation();
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const {setGuestData } = useContext(GuestDataContext);
    const navigate = useNavigate();

    const launchGame = async (e) => {
        e.preventDefault();
        if (!username) {
            setError(t('usernameRequired'));
            return;
        }
        try
        {
            const response = await api.post('/api/get-user-id/', {username});
            setGuestData(prevState => ({
                ...prevState,
                guestNickname: username,
                nickname: username,
                id: response.data.user_id,
                isGuest: false
            }));
            navigate("/userGameWindow/");
            setUsername('');
            setError('');
        }
        catch(error)
        {
            console.log('Error:', error);
            setError(t('userNotFound'));
        }
    };

    return (
        <>
            <div className="modal fade" id="playerModal" tabIndex="-1" aria-labelledby="playerModalLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-5 pt-0">
                            <form onSubmit={launchGame}>
                                <div className="form-floating mb-2">
                                    <input
                                        type="text"
                                        className="form-control rounded-3"
                                        id="guestUsernameLogin"
                                        placeholder={t('usernamePlaceholder')}
                                        autoComplete='username'
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                    <label htmlFor="guestUsernameLogin">{t('username')}</label>
                                </div>
                                <button className="w-90 mt-2 btn btn-lg rounded-3 btn-danger" type="submit" data-bs-dismiss="modal">{t('startTheGame')}</button>
                                {error && <p className="text-danger mt-1">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerModal;
