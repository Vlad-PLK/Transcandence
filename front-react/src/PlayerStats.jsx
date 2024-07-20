import React, { useState } from 'react';

const PlayerStats = ({name, wins, losses, draws, goals, matchHistory }) => {
	const [isVisible, setVisible] = useState(false);

	const toggleVisible = () => {
		setVisible(!isVisible);
	};
	return (
    <div className="player-stats card border-primary mb-3">
      <div className="card-header bg-primary text-white">
        <h2>{name}'s Stats</h2>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Wins: </li>
        <li className="list-group-item">Losses: </li>
        <li className="list-group-item">Draws: </li>
        <li className="list-group-item">Goals: </li>
      </ul>
      <div className="card-header d-flex justify-content-between bg-primary text-white">
        <h3>Match History</h3>
		<button type="button" className="btn btn-light float-right" onClick={toggleVisible}>
          {isVisible ? 'Hide' : 'Show'}
    	</button>
      </div>
	{isVisible && (
		matchHistory.length > 0 ? (
			<ul className="match-history list-group">
			  {matchHistory.map((match, index) => (
				<li key={index} className="list-group-item">
				  Opponent :  - Result :  - Final Score : 
				</li>
			  ))}
			</ul>
		  ) : (
			<p className="card-text text-muted">No match history available.</p>
		  )
	)}
      
    </div>
  );
};

export default PlayerStats;
