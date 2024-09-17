import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { UserStatsContext } from './UserStatsContext';
import api from './api';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PlayerStats(){
	const [isVisible, setVisible] = useState(false);
	const {userData} = useContext(UserDataContext);
	const {userStats, setUserStats} = useContext(UserStatsContext);
	const [userMatch, setUserMatch] = useState([]);
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	useEffect(() => {
		if (userData && isVisible)
			{
				try {
					api.get('api/player-stats/')
					.then(response => {
						console.log(response.data)
						setUserStats(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
					  });
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				} catch (error) {
					alert(error);
				}
				try {
					api.get('api/get-matches/')
					.then(response => {
						console.log(response.data)
						setUserMatch(response.data)
					  })
					.catch(error => {
						console.log('Error:', error);
					  });
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				} catch (error) {
					alert(error);
				}
		}
	}, [isVisible])
	return (
	<>
			<div className="player-stats card mb-3 border-0" style={{color: '#6B3EB8'}}>
      			<div className="card-header bg-dark">
      			  <h2>Stats</h2>
      			</div>
				{isVisible ?
					<>
						{userStats ? 
						<div className="">
						<ul className="list-group list-group-flush">
							<li className="list-group-item">Wins : {userStats.wins} | Losses : {userStats.losses} | Draws : {userStats.draws}</li>
							<li className="list-group-item">Total Goals : {userStats.goals}</li>
						</ul> 
						</div>
						: 
						<p className="card-text text-dark mt-3">No game stats yet !</p>}
						<div className="card-header bg-dark">
							<h2 className="">Match History</h2>
      					</div>
						{userMatch.length > 0 ?
						<ul className="match-history list-group">
			  			{userMatch.map((match, index) => (
							(userData.username == match.player1_name) ?
							<li key={index} className="list-group-item">
				  				Opponent : {match.player2_name} | Winner : {match.match_winner_name} <br/> Final Score : {match.player1_score} - {match.player2_score}
							</li>
							:
							<li key={index} className="list-group-item">
				  				Opponent : {match.player1_name} | Winner : {match.match_winner_name} <br/> Final Score : {match.player1_score} - {match.player2_score}
							</li>
			  			))}
						</ul>
						:
						<p className="card-text text-muted">No match history available.</p>}
					</>
		  			:
					<>
					</>
				} 		
				<div className="card-header d-flex flex-column justify-content-center bg-dark">
					<button type="button" className="btn btn-dark float-right" onClick={toggleVisible}>
      			    {isVisible ? 'Hide' : 'Show'}
    				</button>
      			</div>
    		</div>
	</>
    
  );
};

export default PlayerStats;
