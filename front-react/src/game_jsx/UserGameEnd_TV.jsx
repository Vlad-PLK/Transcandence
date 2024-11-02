import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext, useEffect} from "react";
import './UserGameEnd_TV.css';
import { useTranslation } from "react-i18next";
import TranslationSelect from "../TranslationSelect.jsx";
import { Link } from "react-router-dom";
import { UserDataContext } from "../UserDataContext.jsx";
import { WebSocketContext } from "../WebSocketContext.jsx";
import SettingsModal from "../SettingsModal.jsx";
import TournamentStats from './tournamentStats.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';


function UserGameEnd()
{
    const navigate = useNavigate();
	const { userData, setUserData } = useContext(UserDataContext);
    const { online_status } = useContext(WebSocketContext);
    const location = useLocation();
	const { t } = useTranslation();

    const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};

    useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])
	const disconnect = () => {
        console.log('Disconnected from websocket and closed connection');
		localStorage.clear();
		setUserData(null);
	}

    const { flag, tournamentID, player1, player1_nick, player2, player2_nick, player1_score, player2_score } = location.state || {};
	const isPlayer1Winner = player1_score > player2_score;
    const isPlayer2Winner = player2_score > player1_score;

    const handleRestart = () =>
	{
        navigate("../userGameWindow");
    };

	const handleNewGame = () =>
	{
		navigate("../userGameSetup/");
	};

	const handleTournamentStats = () => {
        const winner = isPlayer1Winner ? player1_nick : player2_nick;
        navigate("../tournamentStats", { state: { tournamentID } });
    };

	console.log("GAME_END ",flag, player1, player1_score, player2, player2_score);

    return (
        <>
			<div id="big_container" className="d-flex flex-column vh-100" style={main_image}>
            <header className="p-4 opacity-75" style={{ fontFamily: 'cyber4'}}>
                <div className="container">
                    <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
                        <TranslationSelect />
                        <a href="/userPage/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
                            <span className="fs-4">{t('main.title')}</span>
                        </a>
                        <div className="text-end">
                            <div className="btn-group dropstart">
                                <button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                                    <span className="visually-hidden">Toggle Dropstart</span>
                                </button>
                                <ul className="dropdown-menu opacity-50" style={{ fontSize: "12px", textAlign: "center", minWidth: "5rem" }}>
                                    <a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</a>
                                    <Link to={`../userFriends`} className="dropdown-item">{t('dropdown.friends')}</Link>
                                    <hr className="dropdown-divider" />
                                    <button className="dropdown-item" onClick={disconnect}>{t('dropdown.disconnect')}</button>
                                </ul>
                                {userData && <Link to={`../userSettings/`} type="button" className="btn btn-outline-light me-2">{userData.username}
                                    {userData.avatar != null ?
                                        <img className="ms-2 rounded" src={"https://"+window.location.host+userData.avatar} alt="" height="40" widht="40" />
                                        :
                                        <img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40" />
                                    }
                                </Link>}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
                <div className="endgame-content mt-3" style={{ fontFamily: 'cyber4'}}>
                    <h1 className="endgame-title">{t('gameEnd.title')}</h1>
                    <p className="endgame-thanks">{t('gameEnd.thanks')}</p>

                    {/* Scoreboard */}
                    {player1_nick && player2_nick ? (
                        <div className="scoreboard">
                            <table className="score-table">
                                <thead>
                                    <tr>
                                        <th>{t('gameEnd.scoreboard.player')}</th>
                                        <th>{t('gameEnd.scoreboard.score')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className={isPlayer1Winner ? "winner-row" : ""}>
                                        <td>
                                            {isPlayer1Winner && <span className="crown">{t('gameEnd.winnerCrown')}</span>}
                                            {player1_nick}
                                        </td>
                                        <td>{player1_score}</td>
                                    </tr>
                                    <tr className={isPlayer2Winner ? "winner-row" : ""}>
                                        <td>
                                            {isPlayer2Winner && <span className="crown">{t('gameEnd.winnerCrown')}</span>}
                                            {player2_nick}
                                        </td>
                                        <td>{player2_score}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>{t('gameEnd.scoreboard.scoresUnavailable')}</p>
                    )}
                    {flag == 0 && 
                    <>
                        <button className="restart-btn me-2" onClick={handleRestart}>{t('gameEnd.scoreboard.restartButton')}</button>
					    <button className="newgame-btn ms-2" onClick={handleNewGame}>{t('gameEnd.scoreboard.newGameButton')}</button>
                    </>
                    }
                    {flag === 1 && (
                            <button className="tournament-btn" onClick={handleTournamentStats}>{t('gameEnd.scoreboard.tournamentStatsButton')}</button>
                    )}
				</div>
            </div>
            <SettingsModal />
        </>
    );
}

export default UserGameEnd;
