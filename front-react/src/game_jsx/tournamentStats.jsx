import React, { useEffect, useState, useContext, useRef } from 'react';
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
    const [semiFinalists, setSemiFinalists] = useState(Array.from({ length: 4 }, () => ({ nickname: '', index: 0 })));
    const [Finalists, setFinalists] = useState(Array.from({ length: 2 }, () => ({ nickname: '', index: 0 })));
    const [winnerUser, setWinnerUser] = useState({id: 0, nickname: ''});
    const updatedSemiFinalistsRef = useRef([]);
    const updatedFinalistsRef = useRef([]);

    useEffect(() => {
        console.log("Updated semiFinalists:", semiFinalists);
    }, [semiFinalists]);

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
                matchList: response.data.sort((a, b) => a.id - b.id),
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
            if (updatedSemiFinalistsRef.current)
            {
                for (let i = 0; i != updatedSemiFinalistsRef.current.length; i++)
                {
                    if (updatedSemiFinalistsRef.current[i].nickname != '')
                        break ;
                    updatedSemiFinalistsRef.current.push(undefined);
                }
            }
            
            if (Array.isArray(matchList) && matchList.length >= 0) {
                for (let i = 0; i < 4; i++) {
                    const match = matchList[i];
                    if (match && match.id != null) {
                        api.get(`api/tournament/${match.id}/match-info/`)
                            .then(response => {
                                //console.log("info about quarter-finals", response.data);
                                if (response.data.winner != null)
                                {
                                    var nick_winner = setWinner(response.data.winner, match);
                                    setSemiFinalists(prevSemiFinalists => {
                                        const updatedSemiFinalists = [...prevSemiFinalists];
                                        
                                        // Ensure the array has enough elements
                                        while (updatedSemiFinalists.length <= i) {
                                            updatedSemiFinalists.push(undefined);
                                        }
                                        
                                        // Update the specific index
                                        updatedSemiFinalists[i] = { nickname: nick_winner, index: i };
                                        updatedSemiFinalistsRef.current = updatedSemiFinalists;
                                        return updatedSemiFinalists;
                                    });
                                }
                                    
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
            if (Array.isArray(matchList) && matchList.length > 4) {
                for (let i = 4; i < 6; i++) {
                    const match = matchList[i];
                    if (match && match.id != null) {
                        api.get(`api/tournament/${match.id}/match-info/`)
                            .then(response => {
                                console.log("info about semi-finals", response.data);
                                if (response.data.winner != null)
                                {
                                    var nick_winner = setWinner(response.data.winner, match);
                                    setFinalists(prevFinalists => {
                                        const updatedFinalists = [...prevFinalists];
                                        updatedFinalists[i - 4] = { nickname: nick_winner, index: i - 4};
                                        updatedFinalistsRef.current = updatedFinalists;
                                        return updatedFinalists;
                                    });
                                }
                                    
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
            if (Array.isArray(matchList) && matchList.length == 7) {
                const match = matchList[6];
                api.get(`api/tournament/${match.id}/match-info/`)
                .then(response => {
                    console.log("winner", response.data);
                    if (response.data.winner != null)
                    {
                        var nick_winner = setWinner(response.data.winner, match);
                        var nick_id;
                        if (nick_winner == match.player1_name)
                            nick_id = match.player1;
                        else
                            nick_id = match.player2
                        setWinnerUser(prevState => ({
                            ...prevState,
                            nickname: nick_winner,
                            nick_id: nick_id
                        }));
                    }   
                })
                .catch(error => {
                    console.log('Error', error);
                });
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
        return (
            <div className="d-flex justify-content-between w-100">
                {Array.isArray(currentTournament.matchList) && currentTournament.matchList.length > 0 &&
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
                </>}
            </div>
        );
    };

    const renderSemifinals = () => {
        return (
            <div className="d-flex justify-content-between w-100 mt-3">
            {Array.isArray(updatedSemiFinalistsRef.current) &&
            <>
                <div className="player-column left-column semifinals">
                <div className="player-group">
                    {renderPlayerBox(updatedSemiFinalistsRef.current[0]?.nickname || "Semi Finalist 1", 0)}
                    <div className="semi-spacer "></div>
                    <div className="semi-vs-label">VS.</div>
                    <div className="semi-spacer "></div>
                    {renderPlayerBox(updatedSemiFinalistsRef.current[1]?.nickname || "Semi Finalist 2", 1)}
                </div>
                </div>
                <div className="player-column right-column semifinals">
                <div className="player-group">
                    {renderPlayerBox(updatedSemiFinalistsRef.current[2]?.nickname || "Semi Finalist 3", 2)}
                    <div className="semi-spacer "></div>
                    <div className="semi-vs-label">VS.</div>
                    <div className="semi-spacer "></div>
                    {renderPlayerBox(updatedSemiFinalistsRef.current[3]?.nickname || "Semi Finalist 4", 3)}
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
            {Array.isArray(updatedFinalistsRef.current) &&
            <>
            <div className="player-column left-column finals">
                <div className="player-group">
                {renderPlayerBox(updatedFinalistsRef.current[0]?.nickname || "FINALIST 1", 0)}
                </div>
            </div>
            <div className="finals-vs-label me-2">VS.</div>
            <div className="player-column right-column finals">
                <div className="player-group">
                {renderPlayerBox(updatedFinalistsRef.current[1]?.nickname || "FINALIST 2",1)}
                </div>
            </div>
            </>
            }
            </div>
        );
    };
    
    const setMatchIndex = async() => {
        try {
            const response = await api.get(`api/tournament/${tournamentID}/needed-matches/`)
            matchIndex = response.data[0].id;
        } catch (error) {
            console.log('Error while searching index', error);
        }
    }
    const advanceRound = async(tournamentID) => {
        try {
            await api.post(`api/tournament/${tournamentID}/advance-round/`);
            await setMatchIndex();
        } catch (error) {
            console.log("error advance round : ", error);
        }
    }

    const getMatches = async() => {
        try {
            const response = await api.get(`api/tournament/${tournamentID}/tournament-matches/`)
            setCurrentTournament(prevState => ({
                ...prevState,
                matchList: response.data.sort((a, b) => a.id - b.id),
            }));
            
        } catch (error) {
            console.log('Error while getting matches :', error);
        }
    }

    const createFinalMatch = async(tournamentID) => {
        try {
            const response = await api.post(`api/tournament/${tournamentID}/finalize/`)
            matchIndex = response.data.match_id;
        } catch (error) {
            console.log("error while creating the final :", error);
        }
    }

    const playGame = async () => {
	    try {
            const response = await api.get(`api/tournament/${tournamentID}/needed-matches/`);
            console.log("needed matches :", response.data);
            if (Array.isArray(response.data) && response.data.length === 0) {
                if (currentTournament.matchList.length === 4) {
                    await advanceRound(tournamentID);
                }
                else {
                    await createFinalMatch(tournamentID);
                }
                await getMatches();
            }
            else
                matchIndex = response.data[0].id;
            api.get(`api/tournament/${tournamentID}/tournament-matches/`)
            .then(response => {
                const new_match_list = response.data.sort((a, b) => a.id - b.id);
                return new_match_list ;
            })
            .then(new_match_list => {
                setCurrentTournament(prevState => ({
                    ...prevState,
                    matchList: new_match_list,
                }));
                return new_match_list ;
            })
            .then(matchList => {
                console.log("id of the next match :", matchIndex);
                for (let match of matchList) {
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
                            break;
                        }
                    }
            })
            .catch(error => {
                console.log("error while getting matches : ", error);
            })
        } catch (error) {
            console.log('Error:', error);
        }
    }

    return (
        <div style={containerStyle}>
            <div className="container-fluid">
                <h1 className="text-center text-white mb-4">{t('tournament.scoreboardTitle')}</h1>
                <button className="btn btn-dark mb-4" onClick={handleBack}>{t('tournament.backButton')}</button>
                {!winnerUser.nickname && <button type="button" className="btn btn-primary mb-4 ms-2" onClick={playGame}>{t('tournament.playMatchButton')}</button>}
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
                <div className="text-center position-absolute bottom-50 start-50 translate-middle-x mb-3">
                    {winnerUser.nickname 
                    ? 
                    <>
                        <button className="d-flex flex-column align-items-center btn btn-success btn-lg">
                            {winnerUser.nickname}
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trophy mt-2" viewBox="0 0 16 16">
                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                            </svg>
                        </button>
                    </>
                    : 
                    <>
                    <button className="d-flex flex-column align-items-center btn btn-success btn-lg">
                    {t('tournament.winnerButton')}
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-trophy mt-2" viewBox="0 0 16 16">
                            <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
                        </svg>
                    </button>
                    </>
                    }
                </div>
            </div>
        </div>
    );

}

export default TournamentStats;
