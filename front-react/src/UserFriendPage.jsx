import { useParams } from "react-router";
import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "./UserDataContext";
import { UserStatsContext } from "./UserStatsContext";
import { GameContext } from "./GameContext";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import SettingsModal from "./SettingsModal";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import api from "./api";
import { ACCESS_TOKEN } from './constants';
import { WebSocketContext } from "./WebSocketContext";
import 'bootstrap/dist/css/bootstrap.min.css';

function UserFriendPage() {
    const location = useLocation();
    const { friend } = location.state || {};
    const { userData, setUserData } = useContext(UserDataContext);
    const { setUserStats } = useContext(UserStatsContext);
    const { setGameData } = useContext(GameContext);
    const [isVisible, setVisible] = useState(false);
    const [friendData, setFriendData] = useState([]);
    const [friendStats, setFriendStats] = useState([]);
    const [friendGames, setFriendGames] = useState([]);
	const { online_status, setOnlineStatus } = useContext(WebSocketContext);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const main_image = {
        backgroundImage: `url('/friends2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
	
    const toggleVisible = () => {
		setVisible(!isVisible);
    };

    useEffect(() => {
        if (friend) {
            api.get('api/friends/friend/' + friend.id + '/get-profile/')
                .then(response => {
                    console.log(response.data);
                    setFriendData(response.data.profile_data);
                    setFriendStats(response.data.profile_stats);
                    setFriendGames(response.data.profile_matches);
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        }
    }, []);

    useEffect(() => {
        if (localStorage.getItem(ACCESS_TOKEN) != null) {
			api.get('api/player-info/')
			.then(response => {
				setUserData(response.data);
                })
                .catch(error => {
                    setUserData(null);
                });
        }
    }, []);

    useEffect(() => {
		if (userData == null) navigate("/");
    }, [userData]);
	
    const disconnect = () => {
		console.log('Disconnected from websocket and closed connection');
        localStorage.clear();
        setUserData(null);
    };

    const stats_page = () => {
        if (userData) {
            api.get('api/player-stats/')
                .then(response => {
                    setUserStats(response.data);
                    navigate('../userSettings');
                })
                .catch(error => {
                    console.log('Error:', error);
                });
        }
    };

    return (
		<>
			<div id="big_container" className="d-flex flex-column vh-100" style={main_image}>
				<header className="p-4 opacity-75" style={{ fontFamily: 'cyber4' }}>
					<div className="container">
						<div className="d-flex flex-wrap align-items-center justify-content-lg-start">
							<TranslationSelect />
							<a href="/userPage/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
								<span className="fs-4">{t('main.title')}</span>
							</a>
							<div className="text-end">
								<div className="btn-group dropstart">
									<button className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<span className="visually-hidden">{t('dropdown.toggle')}</span>
									</button>
									<ul className="dropdown-menu opacity-50" style={{ fontSize: "12px", textAlign: "center", minWidth: "5rem" }}>
										<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</a>
										<Link to={`../userFriends`} className="dropdown-item">{t('dropdown.friends')}</Link>
										<hr className="dropdown-divider" />
										<button className="dropdown-item" onClick={disconnect}>{t('dropdown.disconnect')}</button>
									</ul>
									{userData && 
										<button type="button" className="btn btn-outline-light me-2" onClick={stats_page}>
											{userData.username}
											{userData.avatar != null ?
												<img className="ms-2 rounded" src={"https://" + window.location.host + userData.avatar} alt="" height="40" width="40" />
												:
												<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" width="40" />
											}
										</button>
									}
								</div>
							</div>
						</div>
					</div>
				</header>
				
				{/* Centered Profile and Toggle Button */}
				<div className="d-flex flex-column align-items-center text-white mt-2" style={{ fontFamily: 'cyber4' }}>
					{friendData && (
						<>
							<div className="d-flex flex-column align-items-center mb-2 justify-content-evenly">
								<div className="bg-dark rounded mb-2">
									{friendData.avatar != null ? (
										<img 
											src={"https://" + window.location.host + friendData.avatar} 
											alt="" 
											height={userData && isVisible ? 75 : 250} 
											width={userData && isVisible ? 75 : 250} 
										/>
									) : (
										<img 
											src="/robot.webp" 
											alt="" 
											height={userData && isVisible ? 75 : 250} 
											width={userData && isVisible ? 75 : 250} 
										/>
									)}
								</div>
								<div className="bg-dark text-light rounded p-3 mb-3 text-center opacity-75" style={{ color: '#6B3EB8' }}>
									<h4>
										<i className="bi bi-person-circle"></i>
										{t('playerStats.nickname')} <span style={{ color: '#6B3EB8' }}>{friendData.username}</span>
									</h4>
									<h5>
										<i className="bi bi-envelope-fill"></i>
										Email: <span style={{ color: '#6B3EB8' }}>{friendData.email}</span>
									</h5>
								</div>
							</div>
							<button type="button" className="btn btn-light mb-3" onClick={toggleVisible}>
								{isVisible ? t('playerStats.hide') : t('playerStats.show')}
							</button>
						</>
					)}
		
					<div className="container">
						<div className="row g-3"> {/* Creates spacing between columns */}
							{/* Left column with Email and Stats */}
							<div className="col-md-6">
								<div className="card mb-3 border-0 opacity-75" style={{ color: '#6B3EB8' }}>
									{isVisible && (
										<>
											<div className="card-header bg-dark text-center">
												<h2>{t('playerStats.stats')}</h2>
											</div>
											<div className="bg-white p-3 rounded text-center">
												<ul className="list-group list-group-flush">
													<li className="list-group-item">
														{t('playerStats.wins')}: {friendStats.wins} | {t('playerStats.losses')}: {friendStats.losses} | {t('playerStats.draws')}: {friendStats.draws}
													</li>
													<li className="list-group-item">
														{t('playerStats.totalGoals')}: {friendStats.goals}
													</li>
												</ul>
											</div>
										</>
									)}
								</div>
							</div>
	
							{/* Right column with Match History */}
							{isVisible && (
								<div className="col-md-6">
									<div className="card mb-3 border-0 opacity-75" style={{ color: '#6B3EB8' }}>
										<div className="card-header bg-dark text-center">
											<h2>{t('playerStats.matchHistory')}</h2>
										</div>
										{Array.isArray(friendGames) && friendGames.length > 0 ?
										<ul className="match-history list-group overflow-auto" style={{ maxHeight: '120px' }}>
											{friendGames.map((match, index) => (
												(friendData.username === match.player1_name) ?
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
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<SettingsModal />
		</>
	);
	
}

export default UserFriendPage;
