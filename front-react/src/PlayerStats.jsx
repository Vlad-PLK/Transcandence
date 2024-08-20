import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import api from './api';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function PlayerStats(){
	const [isVisible, setVisible] = useState(false);
	const {userData} = useContext(UserDataContext);
	const [userStats, setUserStats] = useState(null);
	const [userMatch, setUserMatch] = useState([]);
	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	useEffect(() => {
		if (userData)
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
	}, [])
	return (
	<>
			<div className="player-stats card mb-3 border-0" style={{color: '#6B3EB8'}}>
      			<div className="card-header bg-dark">
      			  {userData && <h2>{userData.username} Stats</h2>}
      			</div>
				{userStats && <div className="">
					<ul className="list-group list-group-flush">
      				  <li className="list-group-item">Wins: {userStats.wins}</li>
      				  <li className="list-group-item">Losses: {userStats.losses}</li>
      				  <li className="list-group-item">Draws: {userStats.draws}</li>
      				  <li className="list-group-item">Goals: {userStats.goals}</li>
      				</ul>
				</div> }
      			<div className="card-header d-flex flex-column justify-content-center bg-dark">
      			  <h3 className="">Match History</h3>
					<button type="button" className="btn btn-dark float-right" onClick={toggleVisible}>
      			    {isVisible ? 'Hide' : 'Show'}
    				</button>
      			</div>
				{isVisible && (userMatch.length > 0 ? (
					<ul className="match-history list-group">
			  		{userMatch.map((match, index) => (
					<li key={index} className="list-group-item">
				  		Opponent : {match.player2} | Winner : {match.match_winner} <br/> Final Score : {match.player1_score} - {match.player2_score}
					</li>
			  		))}
					</ul>
		  			) : (
					<p className="card-text text-muted">No match history available.</p>
				))} 		
    		</div>
	</>
    
  );
};

export default PlayerStats;
