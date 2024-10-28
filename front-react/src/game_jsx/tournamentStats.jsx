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
    var matchIndex = 0;
    const {tournamentPairData, setTournamentPairData} = useContext(TournamentPairDataContext);
    const {currentTournament, setCurrentTournament} = useContext(CurrentTournamentContext);
    const [semiFinalists, setSemiFinalists] = useState({nickname: '', index: 0});
    const [Finalists, setFinalists] = useState({nickname: '', index: 0});

    useEffect(() => {
        console.log("tournament id = ", tournamentID);
        api.get('api/tournament/list-tournaments/')
		.then(response => {
			for (let i = 0; i < response.data.length; i++) {
				if (response.data[i].name == tournamentID) {
					setCurrentTournament(prevState => ({
                        ...prevState,
                        creator: response.data[i].creator,
                        name: response.data[i].name,
                    }))
                    api.get(`api/tournament/${tournamentID}/participants/`)
                    .then(response => {
                        setCurrentTournament(prevState => ({
                            ...prevState,
                            playerList: response.data[i],
                        }))
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    })
				}
			}
		})
        .catch(error => {
			console.log('Error:', error);
		});
        api.get(`api/tournament/${tournamentID}/tournament-matches/`)
        .then(response => {
            console.log("All tournament matches : ", response.data);
            setCurrentTournament(prevState => ({
                ...prevState,
                matchList: response.data,
            }));
            return response.data   
        })
        .then(matchList => {
            const setWinner = (winner, match) => {
                if (winner == match.player1)
                    return match.player1_name
                else
                    return match.player2_name
            }
            if (Array.isArray(matchList) && matchList.length >= 4) {
                for (let i = 0; i < 4; i++) {
                    const match = matchList[i];
                    if (match && match.id != null) {
                        api.get(`api/tournament/${match.id}/match-info/`)
                            .then(response => {
                                console.log("info about quarter-finals", response.data);
                                if (response.data.winner != null)
                                    var nick_winner = setWinner(response.data.winner, match);
                                    setSemiFinalists(prevSemiFinalists => ({
                                        ...prevSemiFinalists,
                                        nickname: nick_winner,
                                        index: i,
                                    }));
                                    console.log(nick_winner, i);
                            })
                            .catch(error => {
                                console.log('Error', error);
                            });
                    } else {
                        console.log(`Match or match.id is undefined at index ${i}`);
                    }
                }
            } else {
                console.log('currentTournament.matchList is not defined or does not have enough elements');
            }
            if (Array.isArray(matchList) && matchList.length >= 6) {
                console.log(matchList);
                const match = matchList[5];
                if (match && match.id != null) {
                    const winners = `api/tournament/${match.id}/match-info/`;
                    api.get(winners)
                        .then(response => {
                            console.log("info about semi finals", response.data);
                            if (response.data.winner != null) {
                                var nick_winner = setWinner(response.data.winner, match);
                                setFinalists(prevSemiFinalists => ({
                                    ...prevSemiFinalists,
                                    nickname: nick_winner,
                                    index: i,
                                }));
                                console.log(nick_winner, i);
                            }
                        })
                        .catch(error => {
                            console.log('Error', error);
                        });
                } else {
                    console.log(`Match or match.id is undefined at index 6`);
                }
            } else {
                console.log('currentTournament.matchList is not defined or does not have enough elements');
            }
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
        navigate("../userGameSetup");
    };

    const renderPlayerBox = (nickname, index) => {
        return (
            <div key={index} className="player-box p-3 mb-2 bg-light border rounded text-center">
                <div className="player-name">{nickname}</div>
            </div>
        );
    };

    const renderQuarterfinals = () => {
        if (Array.isArray(currentTournament.matchList)) {
            currentTournament.matchList.sort((a, b) => a.id - b.id);
        }
        return (
            <div className="d-flex justify-content-between w-100">
                {Array.isArray(currentTournament.matchList) && currentTournament.matchList.length > 0 ?
                <>
                <div className="player-column left-column">
                    {currentTournament.matchList[0] &&
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[0].player1_name, 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[0].player2_name, 1)}
                    </div>
                    </>}
                    <div className="quarter-spacer "></div>
                    {currentTournament.matchList[1] &&
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[1].player1_name, 2)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[1].player2_name, 3)}
                    </div>
                    </>}
                </div>
                <div className="player-column right-column">
                    {currentTournament.matchList[2] &&
                    <>
                        <div className="player-group">
                            {renderPlayerBox(currentTournament.matchList[2].player1_name, 4)}
                            <div className="quarter-vs-label">VS.</div>
                            {renderPlayerBox(currentTournament.matchList[2].player2_name, 5)}
                        </div>
                    </>}
                    <div className="quarter-spacer "></div>
                    {currentTournament.matchList[3] &&
                    <>
                    <div className="player-group">
                        {renderPlayerBox(currentTournament.matchList[3].player1_name, 6)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(currentTournament.matchList[3].player2_name, 7)}
                    </div>
                    </>}
                </div>
                </>
                :
                <>
                <div className="player-column left-column">
                    <>
                    {/* a traduire */}
                    <div className="player-group">
                        {renderPlayerBox("player1", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player2", 1)}
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
                    <>
                    <div className="player-group">
                        {renderPlayerBox("player7", 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox("player8", 1)}
                    </div>
                    </>
                </div>
                </>
                }
            </div>
        );
    };

    const renderSemifinals = () => {
        return (
            <div className="d-flex justify-content-between w-100 mt-3">
                {(semiFinalists && Array.isArray(currentTournament.semiFinalists) && semiFinalists.length > 0) ?
                <>
                    <div className="player-column left-column semifinals">
                    <div className="player-group">
                        {renderPlayerBox(semiFinalists[0],0)}
                        <div className="semi-spacer "></div>
                        <div className="semi-vs-label">VS.</div>
                        <div className="semi-spacer "></div>
                        {renderPlayerBox(semiFinalists[1],1)}
                    </div>
                </div>
                <div className="player-column right-column semifinals">
                    <div className="player-group">
                        {renderPlayerBox(semiFinalists[2],2)}
                        <div className="semi-spacer "></div>
                        <div className="semi-vs-label">VS.</div>
                        <div className="semi-spacer "></div>
                        {renderPlayerBox(semiFinalists[3],3)}
                    </div>
                </div>
                </>
                :
                <>
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
                    </>
                }
            </div>
        );
    };

    const renderFinalists = () => {
        return (
            <div className="d-flex justify-content-between w-100 mt-3">
            {(Finalists && Array.isArray(Finalists) && Finalists.length > 0)
            ?
            <>
                <div className="player-column left-column finals">
                    <div className="player-group">
                        {renderPlayerBox(Finalists[0],0)}
                    </div>
                </div>
                <div className="finals-vs-label">VS.</div>
                <div className="player-column right-column finals">
                    <div className="player-group">
                        {renderPlayerBox(Finalists[1],1)}
                    </div>
                </div>
            </>
            :
            <>
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
            </>
            }
            </div>
        );
    };

    const advanceRound = async(tournamentID) => {
        try {
            await api.post(`api/tournament/${tournamentID}/advance-round/`);
        } catch (error) {
            console.log("error advance round : ", error);
        }
    }
    const setMatchIndex = async() => {
        try {
            const response = await api.get(`api/tournament/${tournamentID}/needed-matches/`)
            //console.log("needed matches", response.data);
            //console.log("first match of the list index", response.data[0].id);
            matchIndex = response.data[0].id;
        } catch (error) {
            console.log('Error while searching index', error);
        }
    }
    const playGame = async () => {
	    try {
            const response = await api.get(`api/tournament/${tournamentID}/needed-matches/`);
            console.log("needed matches :", response.data);
            if (response.data == null) {
                advanceRound(tournamentID);
                setMatchIndex();
            }
            else
                matchIndex = response.data[0].id;
            console.log("id of the next match :", matchIndex);
            for (let match of currentTournament.matchList) {
                //console.log(match.id);
                    if (match.id === matchIndex) {
                        setTournamentPairData(prevState => ({
                            ...prevState,
                            tournament_id: tournamentID,
                            match_id: match.id,
                            player1_name: match.player1_name,
                            player2_name: match.player2_name,
                            player1_id: match.player1,
                            player2_id: match.player2
                        }));
                        navigate("../userGameWindow/");
                    }
                }
        } catch (error) {
            console.log('Error:', error);
        }
    }

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
