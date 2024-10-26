import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tournamentStats.css';
import api from '../api';
import { TournamentPairDataContext } from '../TournamentPairDataContext';
import { CurrentTournamentContext } from '../CurrentTournamentContext';

function TournamentStats() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const {tournamentID} = location.state || {};
    const [matchIndex, setMatchIndex] = useState(0);
    const {tournamentPairData, setTournamentPairData} = useContext(TournamentPairDataContext);
    const {currentTournament, setCurrentTournament} = useContext(CurrentTournamentContext);

    useEffect(() => {
        api.get('api/tournament/list-tournaments/')
			.then(response => {
				let i = 0;
                console.log(response.data);
				for (i; i < response.data.length; i++) {
					if (response.data[i].name == tournamentID) {
						setCurrentTournament(prevState => ({
                            ...prevState,
                            creator: response.data[i].creator,
                            name: response.data[i].name,
                        }))
						const url = `api/tournament/${tournamentID}/participants/`;
						api.get(url)
						.then(response => {
							setCurrentTournament(prevState => ({
                                ...prevState,
                                playerList: response.data[i],
                            }))
						  })
						.catch(error => {
							console.log('Error:', error);
						  });
					}
				}
			})
			.catch(error => {
				console.log('Error:', error);
			});
        const url2 = `api/tournament/${tournamentID}/needed-matches/`;
			api.get(url2)
        	.then(response => {
				setCurrentTournament(prevState => ({
        	        ...prevState,
        	        matchList: response.data,
        	    }));
			  })
			.catch(error => {
				console.log('Error:', error);
			});
    }, [])

    const containerStyle = {
        backgroundImage: `url(../../public/game_stats.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        margin: 0,
        padding: 0,
        position: 'relative',
        fontFamily: 'cyber4',
    };

    const handleBack = () => {
        navigate("/userGameSetup");
    };

    const renderPlayerBox = (nickname, index) => {
        return (
            <div key={index} className="player-box p-3 mb-2 bg-light border rounded text-center">
                <div className="player-name">{nickname}</div>
            </div>
        );
    };

    const renderQuarterfinals = () => {
    
        return (
            <div className="d-flex justify-content-between w-100">
                {Array.isArray(currentTournament.matchList) && currentTournament.matchList.length > 0 ?
                <>
                <div className="player-column left-column">
                    {currentTournament.matchList[0] ?
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[0].player1_name, 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[0].player2_name, 1)}
                    </div>
                    </>
                    :
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player 1", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player 2", 1)}
                    </div>
                    </>
                    }
                    <div className="quarter-spacer "></div>
                    {currentTournament.matchList[1] ?
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[1].player1_name, 2)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[1].player2_name, 3)}
                    </div>
                    </>
                    :
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player3", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player4", 1)}
                    </div>
                    </>}
                </div>
                <div className="player-column right-column">
                    {currentTournament.matchList[2] ?
                    <>
                        <div className="player-group">
                            {renderPlayerBox(currentTournament.matchList[2].player1_name, 4)}
                            <div className="quarter-vs-label">VS.</div>
                            {renderPlayerBox(currentTournament.matchList[2].player2_name, 5)}
                        </div>
                    </>
                    :
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player5", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player6", 1)}
                    </div>
                    </>
                    }
                    <div className="quarter-spacer "></div>
                    {currentTournament.matchList[3] ?
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[3].player1_name, 6)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[3].player2_name, 7)}
                    </div>
                    </>
                    :    
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player7", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player8", 1)}
                    </div>
                    </>}
                </div>
                </>
                :
                <>
                <div className="player-column left-column">
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player 1", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player 2", 1)}
                    </div>
                    </>
                    <div className="quarter-spacer "></div>
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player3", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player4", 1)}
                    </div>
                    </>
                </div>
                <div className="player-column right-column">
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player5", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player6", 1)}
                    </div>
                    </>
                    <div className="quarter-spacer "></div>
                    {currentTournament.matchList[3] ?
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[3].player1_name, 6)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[3].player2_name, 7)}
                    </div>
                    </>
                    :    
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player7", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player8", 1)}
                    </div>
                    </>}
                </div>
                </>
                }
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
    
    const playGame = () => {
        setTournamentPairData(prevState => ({
            ...prevState,
            match_id: currentTournament.matchList[matchIndex].id,
            player1_name: currentTournament.matchList[matchIndex].player1_name,
            player2_name: currentTournament.matchList[matchIndex].player2_name,
            player1_id: currentTournament.matchList[matchIndex].player1,
            player2_id: currentTournament.matchList[matchIndex].player2
        }));
        console.log(tournamentPairData);
        setMatchIndex(prevState => prevState + 1);
        navigate("../userGameWindow/");
    };

    return (
        <div style={containerStyle}>
            <div className="container-fluid">
                <h1 className="text-center text-white mb-4">{t('tournament.scoreboardTitle')}</h1>
                <button className="btn btn-dark mb-4" onClick={handleBack}>{t('tournament.backButton')}</button>
                <button type="button" className="btn btn-primary mb-4 ms-2" onClick={playGame}>Play Match</button>
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
                {/* <div className="text-center position-absolute bottom-0 start-50 translate-middle-x mb-3"> */}
                    {/* <img  */}
                        {/* src="../../public/trophy.png" */}
                        {/* alt="Description" */}
                        {/* className="img-fluid" */}
                        {/* style={{ maxWidth: '150px', height: 'auto' }} */}
                    {/* /> */}
                {/* </div> */}
            </div>
        </div>
    );
    
}

export default TournamentStats;
