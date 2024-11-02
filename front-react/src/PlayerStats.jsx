import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { UserStatsContext } from './UserStatsContext';
import api from './api';
import { useTranslation } from 'react-i18next';

function PlayerStats(){
	const { t } = useTranslation();
	const [isVisible, setVisible] = useState(false);
	const {userData} = useContext(UserDataContext);
	const {userStats, setUserStats} = useContext(UserStatsContext);
	const [userTournamentStats, setUserTournamentStats] = useState([]);
	const [userMatch, setUserMatch] = useState([]);
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
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
						console.log(response.data);
						setUserTournamentStats(response.data)
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
					<ul className="match-history list-group overflow-auto" style={{ maxHeight: '120px' }}>
						{userMatch.map((match, index) => (
							(userData.username === match.player1_name) ?
							<li key={index} className="list-group-item">
								{t('playerStats.opponent')} : {match.player2_name} | {t('playerStats.winner')} : {match.match_winner != null ? match.match_winner_name : t('draw_result')} <br/> 
								{t('playerStats.finalScore')} : {match.player1_score} - {match.player2_score}
							</li>
							:
							<li key={index} className="list-group-item">
								{t('playerStats.opponent')} : {match.player1_name} | {t('playerStats.winner')} : {match.match_winner != null ? match.match_winner_name : t('draw_result')} <br/> 
								{t('playerStats.finalScore')} : {match.player1_score} - {match.player2_score}
							</li>
						))}
					</ul>
					:
					<p className="card-text text-muted">{t('playerStats.noHistory')}</p>}
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
