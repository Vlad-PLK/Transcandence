import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tournamentStats.css';

function TournamentStats() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { winner } = location.state || {};

    const containerStyle = {
        backgroundImage: `url(../../public/scoreBackground.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        margin: 0,
        padding: 0,
        position: 'relative',
    };

    const players = [
        { name: 'Player 1', winner: false },
        { name: 'Player 2', winner: true },
        { name: 'Player 3', winner: false },
        { name: 'Player 4', winner: true },
        { name: 'Player 5', winner: false },
        { name: 'Player 6', winner: true },
        { name: 'Player 7', winner: false },
        { name: 'Player 8', winner: true },
    ];

    const handleBack = () => {
        navigate("/userGameSetup");
    };

    const renderPlayerBox = (player, index) => {
        return (
            <div key={index} className="player-box p-3 mb-2 bg-light border rounded text-center">
                <div className="player-name">{player.name}</div>
            </div>
        );
    };

    const renderQuarterfinals = () => {
        const leftSidePlayers = players.slice(0, 4);
        const rightSidePlayers = players.slice(4, 8);
    
        return (
            <div className="d-flex justify-content-between w-100">
                <div className="player-column left-column">
                    <div className="player-group">
                        {renderPlayerBox(leftSidePlayers[0], 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(leftSidePlayers[1], 1)}
                    </div>
                    <div className="quarter-spacer "></div>
                    <div className="player-group">
                        {renderPlayerBox(leftSidePlayers[2], 2)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(leftSidePlayers[3], 3)}
                    </div>
                </div>
                <div className="player-column right-column">
                    <div className="player-group">
                        {renderPlayerBox(rightSidePlayers[0], 4)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(rightSidePlayers[1], 5)}
                    </div>
                    <div className="quarter-spacer "></div>
                    <div className="player-group">
                        {renderPlayerBox(rightSidePlayers[2], 6)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(rightSidePlayers[3], 7)}
                    </div>
                </div>
            </div>
        );
    };
    
    

    const renderSemifinals = () => {
        return (
            <div className="d-flex justify-content-between w-100 mt-3">
                <div className="player-column left-column semifinals">
                    <div className="player-group">
                        <div className="player-box semi-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Semifinalist 1</div>
                        </div>
                        <div className="semi-spacer "></div>
                        <div className="semi-vs-label">VS.</div>
                        <div className="semi-spacer "></div>
                        <div className="player-box semi-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Semifinalist 2</div>
                        </div>
                    </div>
                </div>
                <div className="player-column right-column semifinals">
                    <div className="player-group">
                        <div className="player-box semi-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Semifinalist 3</div>
                        </div>
                        <div className="semi-spacer "></div>
                        <div className="semi-vs-label">VS.</div>
                        <div className="semi-spacer "></div>
                        <div className="player-box semi-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Semifinalist 4</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    

    const renderFinalists = () => {
        return (
            <div className="d-flex justify-content-between w-100 mt-3">
                <div className="player-column left-column finals">
                    <div className="player-group">
                        <div className="player-box finals-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Finalist 1</div>
                        </div>
                    </div>
                </div>
                <div className="finals-vs-label">VS.</div>
                <div className="player-column right-column finals">
                    <div className="player-group">
                        <div className="player-box finals-player-box p-3 mb-2 bg-light border rounded text-center">
                            <div className="player-name">Finalist 2</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    
    

    return (
        <div style={containerStyle}>
            <div className="container-fluid mt-4">
                <h1 className="text-center text-white mb-4">{t('tournament.scoreboardTitle')}</h1>
                <button className="btn btn-dark mb-4" onClick={handleBack}>{t('tournament.backButton')}</button>
                <div className="flex-container">
                    <div className="col-12 d-flex justify-content-start">
                        <div className="players-container">
                            {renderQuarterfinals()}
                        </div>
                    </div>
                    <div className="col-12 d-flex justify-content-start">
                        {renderSemifinals()}
                    </div>
                    <div className="col-12 d-flex justify-content-start">
                        {renderFinalists()}
                    </div>
                </div>
                <div className="text-center position-absolute bottom-0 start-50 translate-middle-x mb-3">
                    <img 
                        src="../../public/trophy.png"
                        alt="Description"
                        className="img-fluid"
                        style={{ maxWidth: '150px', height: 'auto' }}
                    />
                </div>
            </div>
        </div>
    );
    
}

export default TournamentStats;
