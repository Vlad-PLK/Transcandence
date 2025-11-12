import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "./UserDataContext";
import SettingsModal from "./SettingsModal";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import { Link } from "react-router-dom";
import './customFonts.css';
import UserSettings from "./UserSettings";
import { useNavigate } from "react-router-dom";
import GameSettingsModal from "./GameSettingsModal";
import LocalGameModal from "./LocalGameModal";
import MultiplayerModal from "./MultiplayerModal";
import { WebSocketContext } from "./WebSocketContext";
import { GuestDataContext } from "./GuestDataContext";
import { createContext } from "react";
import { color } from "three/examples/jsm/nodes/Nodes.js";
import WatchTournamentModal from "./WatchTournamentModal";
import CreateTournamentModal from "./CreateTournamentModal";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import api from "./api";

function TypingEffect({ text, speed = 100, fontFamily = 'cyber4' }) {
	const [displayedText, setDisplayedText] = useState('');
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		setDisplayedText('');
		setCurrentIndex(0);
	}, [text]);

	useEffect(() => {
		if (currentIndex < text.length) {
			const timeout = setTimeout(() => {
				setDisplayedText(prev => prev + text[currentIndex]);
				setCurrentIndex(prev => prev + 1);
			}, speed);
			return () => clearTimeout(timeout);
		}
	}, [currentIndex, text, speed]);

	return (
		<h1 className="display-3 fw-bold mb-4" style={{ fontFamily, minHeight: '80px' }}>
			{displayedText}
			<span className="typing-cursor">|</span>
		</h1>
	);
}

function ScrollIndicator() {
	return (
		<div className="scroll-indicator">
			<div className="mouse">
				<div className="wheel"></div>
			</div>
			<div className="arrow-down">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
	);
}

function UserGameSetup() {
	const { userData, setUserData } = useContext(UserDataContext);
	const [tournamentList, setTournamentList] = useState([]);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { online_status } = useContext(WebSocketContext);
	
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundAttachment: 'fixed',
	};

	useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])

	const disconnect = () => {
		console.log('Disconnected from websocket and closed connection');
		localStorage.clear();
		setUserData(null);
	}

	const search_tournament = () => {
		api.get('api/tournament/list-tournaments/')
			.then(response => {
				setTournamentList(response.data);
			})
			.catch(error => {
				console.log('Error:', error);
			});
	}

	return (
		<>
			<div className="game-setup-container" style={main_image}>
				{/* Fixed Header Navigation */}
				<header className="fixed-header" style={{ fontFamily: 'cyber4' }}>
					<div className="container">
						<div className="d-flex flex-wrap align-items-center justify-content-lg-start">
							<TranslationSelect />
							<a href="/userPage/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
								<span className="fs-5">{t('main.title')}</span>
							</a>
							<div className="text-end">
								<div className="btn-group dropstart">
									<button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
										<span className="visually-hidden">Toggle Dropstart</span>
									</button>
									<ul className="dropdown-menu" style={{ fontSize: "12px", textAlign: "center", minWidth: "5rem", backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
										<a className="dropdown-item text-white" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</a>
										<Link to={`../userFriends`} className="dropdown-item text-white">{t('dropdown.friends')}</Link>
										<hr className="dropdown-divider" />
										<button className="dropdown-item text-white" onClick={disconnect}>{t('dropdown.disconnect')}</button>
									</ul>
									{userData && <Link to={`../userSettings/`} type="button" className="btn btn-outline-light me-2">{userData.username}
										{userData.avatar != null ?
											<img className="ms-2 rounded" src={"https://" + window.location.host + userData.avatar} alt="" height="40" width="40" />
											:
											<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" width="40" />
										}
									</Link>}
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Section 1: Hero - Game Mode Selection */}
				<section id="hero" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-10 mx-auto text-center text-white">
								<div className="hero-content p-5 rounded-4 shadow-lg">
									<TypingEffect text={t('gameSetup.hero.title')} speed={80} fontFamily="cyber4" />

									<p className="lead mb-4 paragraph-text" style={{ fontSize: '1.2rem' }}>
										{t('gameSetup.hero.subtitle')}
									</p>

									<div className="hero-description mt-4 mb-5">
										<p className="paragraph-text">
											{t('gameSetup.hero.description')}
										</p>
									</div>

									<div className="row mt-4">
										<div className="col-md-4 mb-3">
											<button type="button" className="game-mode-btn btn btn-lg w-100 rounded-3 shadow" 
												data-bs-toggle="modal" data-bs-target="#gameSettings"
												style={{ fontFamily: 'cyber4', fontSize: '1.1rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', color: 'white', padding: '1.5rem' }}>
												⚙️ {t('gameSetup.hero.configureSettings')}
											</button>
										</div>
										<div className="col-md-4 mb-3">
											<Link to="../userSettings" className="game-mode-btn btn btn-lg w-100 rounded-3 shadow text-white text-decoration-none d-flex align-items-center justify-content-center" 
												style={{ fontFamily: 'cyber4', fontSize: '1.1rem', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', border: 'none', padding: '1.5rem' }}>
												📊 {t('gameSetup.hero.viewProfile')}
											</Link>
										</div>
										<div className="col-md-4 mb-3">
											<Link to="../userPage" className="game-mode-btn btn btn-lg w-100 rounded-3 shadow text-white text-decoration-none d-flex align-items-center justify-content-center" 
												style={{ fontFamily: 'cyber4', fontSize: '1.1rem', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', border: 'none', padding: '1.5rem' }}>
												🏠 {t('gameSetup.hero.backHome')}
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ScrollIndicator />
				</section>

				{/* Section 2: Game Modes */}
				<section id="game-modes" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-10 mx-auto text-white">
								<div className="section-content p-5 rounded-4 shadow-lg">
									<h2 className="text-center mb-5" style={{ fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem' }}>
										{t('gameSetup.modes.title')}
									</h2>

									<div className="row mt-4">
										<div className="col-md-6 mb-4">
											<div className="game-mode-card p-4 rounded-3 h-100" data-bs-toggle="modal" data-bs-target="#localGame" style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="mode-icon mb-3" style={{ fontSize: '3.5rem' }}>🎮</div>
												</div>
												<h5 className="mode-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.5rem' }}>
													{t('gameSetup.modes.local.title')}
												</h5>
												<p className="paragraph-text text-center mb-3">
													{t('gameSetup.modes.local.description')}
												</p>
												<div className="mode-features">
													<p className="paragraph-text small">
														<strong>{t('gameSetup.modes.local.featuresTitle')}</strong>
													</p>
													<ul className="mode-list paragraph-text small">
														<li>{t('gameSetup.modes.local.feature1')}</li>
														<li>{t('gameSetup.modes.local.feature2')}</li>
														<li>{t('gameSetup.modes.local.feature3')}</li>
														<li>{t('gameSetup.modes.local.feature4')}</li>
													</ul>
												</div>
											</div>
										</div>

										<div className="col-md-6 mb-4">
											<div className="game-mode-card p-4 rounded-3 h-100" data-bs-toggle="modal" data-bs-target="#multiplayerModal" style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="mode-icon mb-3" style={{ fontSize: '3.5rem' }}>🌐</div>
												</div>
												<h5 className="mode-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.5rem' }}>
													{t('gameSetup.modes.multiplayer.title')}
												</h5>
												<p className="paragraph-text text-center mb-3">
													{t('gameSetup.modes.multiplayer.description')}
												</p>
												<div className="mode-features">
													<p className="paragraph-text small">
														<strong>{t('gameSetup.modes.multiplayer.featuresTitle')}</strong>
													</p>
													<ul className="mode-list paragraph-text small">
														<li>{t('gameSetup.modes.multiplayer.feature1')}</li>
														<li>{t('gameSetup.modes.multiplayer.feature2')}</li>
														<li>{t('gameSetup.modes.multiplayer.feature3')}</li>
														<li>{t('gameSetup.modes.multiplayer.feature4')}</li>
													</ul>
												</div>
												{online_status && (
													<div className="text-center mt-3">
														<span className="badge bg-success">● {t('gameSetup.modes.multiplayer.online')}</span>
													</div>
												)}
												{!online_status && (
													<div className="text-center mt-3">
														<span className="badge bg-danger">● {t('gameSetup.modes.multiplayer.offline')}</span>
													</div>
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ScrollIndicator />
				</section>

				{/* Section 3: Tournament Options */}
				<section id="tournaments" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-10 mx-auto text-white">
								<div className="section-content p-5 rounded-4 shadow-lg">
									<h2 className="text-center mb-5" style={{ fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem' }}>
										{t('gameSetup.tournaments.title')}
									</h2>

									<div className="text-center mb-5">
										<p className="paragraph-text lead">
											{t('gameSetup.tournaments.description')}
										</p>
									</div>

									<div className="row mt-4">
										<div className="col-md-6 mb-4">
											<div className="tournament-card p-4 rounded-3 h-100" data-bs-toggle="modal" data-bs-target="#tournamentWModal" onClick={search_tournament} style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="tournament-icon mb-3" style={{ fontSize: '3.5rem' }}>🏆</div>
												</div>
												<h5 className="tournament-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.5rem' }}>
													{t('gameSetup.tournaments.join.title')}
												</h5>
												<p className="paragraph-text text-center mb-3">
													{t('gameSetup.tournaments.join.description')}
												</p>
												<div className="tournament-features">
													<p className="paragraph-text small">
														<strong>{t('gameSetup.tournaments.join.whatYouCanDo')}</strong>
													</p>
													<ul className="tournament-list paragraph-text small">
														<li>{t('gameSetup.tournaments.join.feature1')}</li>
														<li>{t('gameSetup.tournaments.join.feature2')}</li>
														<li>{t('gameSetup.tournaments.join.feature3')}</li>
														<li>{t('gameSetup.tournaments.join.feature4')}</li>
													</ul>
												</div>
											</div>
										</div>

										<div className="col-md-6 mb-4">
											<div className="tournament-card p-4 rounded-3 h-100" data-bs-toggle="modal" data-bs-target="#tournamentCModal" style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="tournament-icon mb-3" style={{ fontSize: '3.5rem' }}>✨</div>
												</div>
												<h5 className="tournament-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.5rem' }}>
													{t('gameSetup.tournaments.create.title')}
												</h5>
												<p className="paragraph-text text-center mb-3">
													{t('gameSetup.tournaments.create.description')}
												</p>
												<div className="tournament-features">
													<p className="paragraph-text small">
														<strong>{t('gameSetup.tournaments.create.whatYouCanDo')}</strong>
													</p>
													<ul className="tournament-list paragraph-text small">
														<li>{t('gameSetup.tournaments.create.feature1')}</li>
														<li>{t('gameSetup.tournaments.create.feature2')}</li>
														<li>{t('gameSetup.tournaments.create.feature3')}</li>
														<li>{t('gameSetup.tournaments.create.feature4')}</li>
													</ul>
												</div>
											</div>
										</div>
									</div>

									<div className="text-center mt-5">
										<div className="info-box p-4 rounded-3" style={{ backgroundColor: 'rgba(97, 218, 251, 0.1)', border: '1px solid rgba(97, 218, 251, 0.3)' }}>
											<h6 style={{ fontFamily: 'cyber4', color: '#61DAFB' }}>
												💡 {t('gameSetup.tournaments.infoBox.title')}
											</h6>
											<p className="paragraph-text small mb-0">
												{t('gameSetup.tournaments.infoBox.description')}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Modals */}
			<LocalGameModal />
			<MultiplayerModal />
			<GameSettingsModal />
			<SettingsModal />
			<CreateTournamentModal />
			<WatchTournamentModal tournamentList={tournamentList} />

			{/* Styles */}
			<style>{`
				/* Global Styles */
				.game-setup-container {
					scroll-snap-type: y mandatory;
					overflow-y: scroll;
					height: 100vh;
					scroll-behavior: smooth;
				}

				/* Fixed Header */
				.fixed-header {
					position: fixed;
					top: 0;
					left: 0;
					right: 0;
					z-index: 1000;
					background-color: rgba(0, 0, 0, 0.75);
					backdrop-filter: blur(10px);
					padding: 1rem 0;
					box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
				}

				/* Section Styles */
				.section-full {
					min-height: 100vh;
					display: flex;
					align-items: center;
					justify-content: center;
					scroll-snap-align: start;
					position: relative;
					padding: 100px 20px 80px 20px;
				}

				/* Content Boxes */
				.hero-content,
				.section-content {
					background-color: rgba(0, 0, 0, 0.85);
					backdrop-filter: blur(15px);
					border: 1px solid rgba(97, 218, 251, 0.2);
					transition: transform 0.3s ease;
				}

				.hero-content:hover,
				.section-content:hover {
					transform: translateY(-5px);
					box-shadow: 0 15px 40px rgba(97, 218, 251, 0.2);
				}

				/* Typography */
				.paragraph-text {
					font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
					font-size: 1rem;
					line-height: 1.7;
					color: #e0e0e0;
				}

				/* Game Mode Cards */
				.game-mode-card {
					background-color: rgba(255, 255, 255, 0.05);
					border: 2px solid rgba(255, 215, 0, 0.3);
					transition: all 0.4s ease;
				}

				.game-mode-card:hover {
					background-color: rgba(255, 255, 255, 0.1);
					border-color: rgba(255, 215, 0, 0.7);
					transform: translateY(-15px) scale(1.02);
					box-shadow: 0 20px 50px rgba(255, 215, 0, 0.4);
				}

				.mode-icon,
				.tournament-icon {
					transition: transform 0.4s ease;
					display: inline-block;
				}

				.game-mode-card:hover .mode-icon,
				.tournament-card:hover .tournament-icon {
					transform: scale(1.3) rotate(10deg);
				}

				/* Tournament Cards */
				.tournament-card {
					background-color: rgba(255, 255, 255, 0.05);
					border: 2px solid rgba(255, 105, 180, 0.3);
					transition: all 0.4s ease;
				}

				.tournament-card:hover {
					background-color: rgba(255, 255, 255, 0.1);
					border-color: rgba(255, 105, 180, 0.7);
					transform: translateY(-15px) scale(1.02);
					box-shadow: 0 20px 50px rgba(255, 105, 180, 0.4);
				}

				/* Lists */
				.mode-list,
				.tournament-list {
					list-style-type: none;
					padding-left: 0;
					text-align: left;
				}

				.mode-list li,
				.tournament-list li {
					padding: 0.4rem 0;
					padding-left: 1.5rem;
					position: relative;
				}

				.mode-list li:before {
					content: "▸";
					position: absolute;
					left: 0;
					color: #FFD700;
				}

				.tournament-list li:before {
					content: "★";
					position: absolute;
					left: 0;
					color: #FF69B4;
				}

				/* Game Mode Buttons */
				.game-mode-btn {
					transition: all 0.3s ease;
				}

				.game-mode-btn:hover {
					transform: translateY(-5px);
					box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
				}

				/* Scroll Indicator */
				.scroll-indicator {
					position: absolute;
					bottom: 30px;
					left: 50%;
					transform: translateX(-50%);
					text-align: center;
					z-index: 10;
				}

				.mouse {
					width: 25px;
					height: 40px;
					border: 2px solid #61DAFB;
					border-radius: 20px;
					display: inline-block;
					position: relative;
					margin-bottom: 10px;
				}

				.wheel {
					width: 3px;
					height: 8px;
					background-color: #61DAFB;
					border-radius: 2px;
					position: absolute;
					top: 8px;
					left: 50%;
					transform: translateX(-50%);
					animation: scroll-wheel 1.5s infinite;
				}

				@keyframes scroll-wheel {
					0% {
						opacity: 1;
						transform: translateX(-50%) translateY(0);
					}
					100% {
						opacity: 0;
						transform: translateX(-50%) translateY(15px);
					}
				}

				.arrow-down {
					display: flex;
					flex-direction: column;
					align-items: center;
				}

				.arrow-down span {
					display: block;
					width: 15px;
					height: 15px;
					border-bottom: 2px solid #61DAFB;
					border-right: 2px solid #61DAFB;
					transform: rotate(45deg);
					margin: -5px;
					animation: scroll-arrow 1.5s infinite;
				}

				.arrow-down span:nth-child(2) {
					animation-delay: 0.15s;
				}

				.arrow-down span:nth-child(3) {
					animation-delay: 0.3s;
				}

				@keyframes scroll-arrow {
					0% {
						opacity: 0;
					}
					50% {
						opacity: 1;
					}
					100% {
						opacity: 0;
					}
				}

				/* Typing Effect */
				.typing-cursor {
					animation: blink 1s infinite;
					font-weight: 100;
					opacity: 1;
				}

				@keyframes blink {
					0%, 49% {
						opacity: 1;
					}
					50%, 100% {
						opacity: 0;
					}
				}

				/* Responsive adjustments */
				@media (max-width: 768px) {
					.section-full {
						padding: 80px 15px 60px 15px;
					}

					.hero-content,
					.section-content {
						padding: 2rem !important;
					}

					h1.display-3 {
						font-size: 2rem !important;
					}

					h2 {
						font-size: 1.8rem !important;
					}

					.scroll-indicator {
						bottom: 15px;
					}

					.mode-icon,
					.tournament-icon {
						font-size: 2.5rem !important;
					}

					.game-mode-btn {
						padding: 1rem !important;
						font-size: 0.9rem !important;
					}
				}

				/* Smooth scroll behavior */
				html {
					scroll-behavior: smooth;
				}

				/* Dropdown menu improvements */
				.dropdown-menu .dropdown-item:hover {
					background-color: rgba(97, 218, 251, 0.2);
				}

				/* Info Box */
				.info-box {
					transition: all 0.3s ease;
				}

				.info-box:hover {
					transform: translateY(-3px);
					box-shadow: 0 10px 25px rgba(97, 218, 251, 0.2);
				}
			`}</style>
		</>
	)
}
export default UserGameSetup