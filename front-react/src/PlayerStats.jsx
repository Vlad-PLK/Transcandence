import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { UserStatsContext } from './UserStatsContext';
import api from './api';
import { useTranslation } from 'react-i18next';

function PlayerStats(){
	const { t } = useTranslation();
	const [isVisible, setVisible] = useState(false);
	const [isSet, setIsSet] = useState(false);
	const {userData} = useContext(UserDataContext);
	const {userStats, setUserStats} = useContext(UserStatsContext);
	const [userTournamentStats, setUserTournamentStats] = useState([]);
	const [tournamentMatches, setTournamentMatches] = useState([]);
	const [userMatch, setUserMatch] = useState([]);
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	const toggleSet = () => {
		setIsSet(!isSet);
	}
	useEffect(() => {
		if (userData)
		{
			api.get('api/tournaments/get-tournaments-stats/')
			.then(response => {
				console.log(response.data);
				setUserTournamentStats(response.data)
			})
			.catch(error => {
				console.log('Error:', error);
			});
		}
	}, []);
	useEffect(() => {
		if (userData && isVisible)
			{
				try {
					api.get('api/player-stats/')
					.then(response => {
						setUserStats(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
						// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
					  });
				} catch (error) {
					alert(error);
				}
				try {
					api.get('api/get-matches/')
					.then(response => {
						setUserMatch(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
						// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
					  });
				} catch (error) {
					alert(error);
				}
				try {
					api.get('api/tournaments/get-tournaments-stats/')
  					.then(response => {
  					  setUserTournamentStats(response.data);
  					})
  					.catch(error => {
  					  console.log('Error:', error);
  					});
				}
				catch (error) {
					alert(error);
				}
			}
	}, [isVisible])
	
	return (
	<>
		<div className="player-stats card mb-3 border-0" style={{color: '#6B3EB8'}}>
			<div className="card-header bg-dark">
				<h2>{t('playerStats.stats')}</h2>
			</div>
			{isVisible ?
				<>
					{userStats ? 
					<div className="">
						<ul className="list-group list-group-flush">
							<li className="list-group-item">
								{t('playerStats.wins')} : {userStats.wins} | {t('playerStats.losses')} : {userStats.losses} | {t('playerStats.draws')} : {userStats.draws}
							</li>
							<li className="list-group-item">
								{t('playerStats.totalGoals')} : {userStats.goals}
							</li>
						</ul>
					</div>
					: 
					<p className="card-text text-dark mt-3">{t('playerStats.noStats')}</p>}
					<div className="card-header bg-dark">
						<h2>{t('playerStats.matchHistory')}</h2>
					</div>
					{Array.isArray(userMatch) && userData && userMatch.length > 0 ?
					<ul className="match-history list-group overflow-auto" style={{ maxHeight: '130px' }}>
						{userMatch.map((match, index) => (
							(userData.username === match.player1_name) ?
							<li key={index} className="list-group-item">
								{t('playerStats.opponent')} : <span style={{color: 'red'}}>{match.player2_name}</span> | {t('playerStats.winner')} : {match.match_winner != null ? match.match_winner_name : t('draw_result')}<br/>{t('playerStats.finalScore')} : <span className="text-primary">{match.player1_score} - {match.player2_score}</span>
							</li>
							:
							<li key={index} className="list-group-item">
								{t('playerStats.opponent')} : <span style={{color: 'red'}}>{match.player2_name}</span> | {t('playerStats.winner')} : {match.match_winner != null ? match.match_winner_name : t('draw_result')}<br/>{t('playerStats.finalScore')} : <span className="text-primary">{match.player1_score} - {match.player2_score}</span>
							</li>
						))}
					</ul>
					:
					<p className="card-text text-muted">{t('playerStats.noHistory')}</p>}
					<div className="card-header bg-dark">
						<h2>{t('playerStats.tournamentHistory')}</h2>
					</div>
					{userTournamentStats && Array.isArray(userTournamentStats) && userTournamentStats.length > 0 ?
						<>
							<ul className="list-group list-group-flush overflow-auto" style={{ maxHeight: '230px' }}>
								{userTournamentStats.map((tournament, index) => (
									<li key={index} className="list-group-item">
										<div>{t('playerStats.tournament_name')} {tournament.tournament_name} | {t('playerStats.rank')} {tournament.matches.length === 1 ? "5-8" : (tournament.matches.length === 2 ? "3-4" : (tournament.matches[2].goals_scored > tournament.matches[2].goals_conceded ? "1ST" : "2ND"))} | {t('playerStats.goals')} {tournament.goals}
											<button className="border-0 bg-transparent" type="button" onClick={toggleSet}>
              									<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="ms-1 bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
              									  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
              									</svg>
            								</button>
										</div>
										{isSet &&
										<>
											{Array.isArray(tournament.matches) && tournament.matches.length > 0 && userData ?
												<ul className="match-history list-group overflow-auto" style={{ maxHeight: '120px' }}>
												{tournament.matches.map((match, index) => (
													<li key={index} className="list-group-item">
														{t('playerStats.match_rank')} {match.round === 1 ? "1/4" : (match.round === 2 ? "1/2" : "FINAL")} | {t('playerStats.opponent')} <span style={{color: 'red'}}>{match.opponent_name}</span> | {t('playerStats.winner')} : {match.goals_scored > match.goals_conceded ? userData.username : match.opponent_name} <br/> 
													</li>
												))}
												</ul>
												:
												<p className="card-text text-muted">{t('playerStats.noHistory')}</p>
											}
										</>
										}
									</li>
								))}
							</ul>
						</>
					: 
						<p className="card-text text-dark mt-3">{t('playerStats.no_tournament')}</p>
					}
				</>
				:
				<></>
			}
			<div className="card-header d-flex flex-column justify-content-center bg-dark">
				<button type="button" className="btn btn-dark float-right" onClick={toggleVisible}>
					{isVisible ? t('playerStats.hide') : t('playerStats.show')}
				</button>
			</div>
		</div>
	</>
	);
};

export default PlayerStats;
