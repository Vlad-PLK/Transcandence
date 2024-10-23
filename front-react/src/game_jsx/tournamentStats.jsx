import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './tournamentStats.css';
import api from '../api';
import { TournamentPairDataContext } from '../TournamentPairDataContext';

function TournamentStats() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const [matchIndex, setMatchIndex] = useState(0);
    const { tournamentID } = location.state || {};
    const [tournamentArray, setTournamentArray] = useState();
	const [playerList, setPlayerList] = useState([]);
	const [tournamentName, setTournamentName] = useState('');
	const [matchList, setMatchList] = useState([]);
    const {tournamentPairData, setTournamentPairData} = useContext(TournamentPairDataContext);


    useEffect(() => {
        try{
        console.log(tournamentID);
		api.get('api/tournament/list-tournaments/')
		.then(response => {
			for (let i = 0; i < response.data.length; i++) {
				if (response.data[i].id == tournamentID) {
					setTournamentArray(response.data[i]);
					setTournamentName(response.data[i].name);
					const url = `api/tournament/${tournamentID}/participants/`;
					api.get(url)
					.then(response => {
                        //console.log(response.data);
						setPlayerList(response.data);
					  })
					.catch(error => {
						console.log('Error:', error);
						// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
					});
                    const url2 = `api/tournament/${tournamentID}/needed-matches/`;
					api.get(url2)
                    .then(response => {
                        console.log(response.data);
						setMatchList(response.data);
					  })
					.catch(error => {
						console.log('Error:', error);
						// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
					});
				}
			}
		})
		.catch(error => {
			console.log('Error:', error);
		})
        }catch(error)
        {
            console.log(error);
        }
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
                {Array.isArray(matchList) && matchList.length > 0 ?
                <>
                <div className="player-column left-column">
                    <div className="player-group">
                        {renderPlayerBox(matchList[0].player1_name, 0)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(matchList[0].player2_name, 1)}
                    </div>
                    <div className="quarter-spacer "></div>
                    <div className="player-group">
                        {renderPlayerBox(matchList[1].player1_name, 2)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(matchList[1].player2_name, 3)}
                    </div>
                </div>
                <div className="player-column right-column">
                    <div className="player-group">
                        {renderPlayerBox(matchList[2].player1_name, 4)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(matchList[2].player2_name, 5)}
                    </div>
                    <div className="quarter-spacer "></div>
                    <div className="player-group">
                        {renderPlayerBox(matchList[3].player1_name, 6)}
                        <div className="quarter-vs-label">VS.</div>
                        {renderPlayerBox(matchList[3].player2_name, 7)}
                    </div>
                </div>
                </>
                :
                <></>
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
            match_id: matchList[0].id,
            player1_name: matchList[0].player1_name,
            player2_name: matchList[0].player2_name,
            player1_id: matchList[0].player1,
            player2_id: matchList[0].player2
        }));
        console.log(tournamentPairData);
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
