import { useContext, useEffect, useState, useRef } from "react";
import React from "react";
import { UserDataContext } from "./UserDataContext";
import { UserStatsContext } from "./UserStatsContext";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import { Link } from "react-router-dom";
import './customFonts.css';
import SettingsModal from "./SettingsModal";
import { useNavigate } from "react-router-dom";
import api from "./api";
import { GameContext } from "./GameContext";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { WebSocketContext } from "./WebSocketContext";
import 'bootstrap/dist/css/bootstrap.min.css';

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

function UserHomePage() {
	const { userData, setUserData } = useContext(UserDataContext);
	const { setUserStats } = useContext(UserStatsContext);
	const { setGameData } = useContext(GameContext);
	const { online_status, setOnlineStatus } = useContext(WebSocketContext);
	const navigate = useNavigate();
	const { t } = useTranslation();
	
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundAttachment: 'fixed',
	};

	useEffect(() => {
		if (localStorage.getItem(ACCESS_TOKEN) != null) {
			api.get('api/player-info/')
				.then(response => {
					setUserData(response.data)
				})
				.catch(error => {
					setUserData(null);
				});
		}
	}, [])

	useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])

	const disconnect = () => {
		console.log('Disconnected from websocket and closed connection');
		localStorage.clear();
		setUserData(null);
	}

	const stats_page = () => {
		if (userData) {
			api.get('api/player-stats/')
				.then(response => {
					setUserStats(response.data)
					navigate('../userSettings');
				})
				.catch(error => {
					console.log('Error:', error);
				});
		}
	}

	const game_setup = async () => {
		try {
			const response = await api.get('api/update-game-settings/')
			setGameData(response.data);
			navigate('../userGameSetup/')
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<>
			<div className="user-home-container" style={main_image}>
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
									<button className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<span className="visually-hidden">{t('dropdown.toggle')}</span>
									</button>
									<ul className="dropdown-menu" style={{ fontSize: "12px", textAlign: "center", minWidth: "5rem", backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
										<a className="dropdown-item text-white" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</a>
										<Link to={`../userFriends`} className="dropdown-item text-white">{t('dropdown.friends')}</Link>
										<hr className="dropdown-divider" />
										<button className="dropdown-item text-white" onClick={disconnect}>{t('dropdown.disconnect')}</button>
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

				{/* Section 1: Hero - Welcome Dashboard */}
				<section id="hero" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-8 mx-auto text-center text-white">
								<div className="hero-content p-5 rounded-4 shadow-lg">
									{userData && (
										<>
											<TypingEffect text={`${t('userHome.hero.welcome')} ${userData.username}!`} speed={80} fontFamily="cyber4" />

											<div className="user-avatar-section mb-4">
												{userData.avatar != null ?
													<img className="rounded-circle border border-3 border-info" src={"https://" + window.location.host + userData.avatar} alt="" height="150" width="150" />
													:
													<img className="rounded-circle border border-3 border-info" src="/robot.webp" alt="" height="150" width="150" />
												}
											</div>

											<p className="lead mb-4 paragraph-text" style={{ fontSize: '1.2rem' }}>
												{t('userHome.hero.subtitle')}
											</p>

											<div className="hero-description mt-4">
												<h4 className="mb-3" style={{ fontFamily: 'cyber4', color: '#61DAFB', fontSize: '1.5rem' }}>
													{t('userHome.hero.readyTitle')}
												</h4>
												<p className="paragraph-text">
													{t('userHome.hero.description1')}
												</p>
												<p className="paragraph-text mt-3">
													{t('userHome.hero.description2')}
												</p>
											</div>

											<div className="mt-5">
												<button type="button" className="btn btn-lg btn-primary rounded-3 px-5 py-3 shadow"
													onClick={game_setup}
													style={{ fontFamily: 'cyber4', fontSize: '1.1rem' }}>
													{t('userHome.hero.startPlaying')}
												</button>
											</div>
										</>
									)}
								</div>
							</div>
						</div>
					</div>
					<ScrollIndicator />
				</section>

				{/* Section 2: Quick Actions */}
				<section id="quick-actions" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-10 mx-auto text-white">
								<div className="section-content p-5 rounded-4 shadow-lg">
									<h2 className="text-center mb-5" style={{ fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem' }}>
										{t('userHome.actions.title')}
									</h2>

									<div className="row mt-4">
										<div className="col-md-4 mb-4">
											<div className="action-card p-4 rounded-3 h-100" onClick={game_setup} style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="action-icon mb-3" style={{ fontSize: '3rem' }}>🎮</div>
												</div>
												<h5 className="action-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem' }}>
													{t('userHome.actions.playGame.title')}
												</h5>
												<p className="paragraph-text text-center">
													{t('userHome.actions.playGame.description')}
												</p>
											</div>
										</div>

										<div className="col-md-4 mb-4">
											<div className="action-card p-4 rounded-3 h-100" onClick={stats_page} style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="action-icon mb-3" style={{ fontSize: '3rem' }}>📊</div>
												</div>
												<h5 className="action-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem' }}>
													{t('userHome.actions.viewStats.title')}
												</h5>
												<p className="paragraph-text text-center">
													{t('userHome.actions.viewStats.description')}
												</p>
											</div>
										</div>

										<div className="col-md-4 mb-4">
											<Link to="../userFriends" className="text-decoration-none">
												<div className="action-card p-4 rounded-3 h-100" style={{ cursor: 'pointer' }}>
													<div className="text-center mb-3">
														<div className="action-icon mb-3" style={{ fontSize: '3rem' }}>👥</div>
													</div>
													<h5 className="action-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem' }}>
														{t('userHome.actions.manageFriends.title')}
													</h5>
													<p className="paragraph-text text-center">
														{t('userHome.actions.manageFriends.description')}
													</p>
												</div>
											</Link>
										</div>
									</div>

									<div className="row mt-4">
										<div className="col-md-6 mb-4">
											<div className="action-card p-4 rounded-3 h-100" data-bs-toggle="modal" data-bs-target="#UserSettingsModal" style={{ cursor: 'pointer' }}>
												<div className="text-center mb-3">
													<div className="action-icon mb-3" style={{ fontSize: '3rem' }}>⚙️</div>
												</div>
												<h5 className="action-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem' }}>
													{t('userHome.actions.settings.title')}
												</h5>
												<p className="paragraph-text text-center">
													{t('userHome.actions.settings.description')}
												</p>
											</div>
										</div>

										<div className="col-md-6 mb-4">
											<div className="action-card p-4 rounded-3 h-100">
												<div className="text-center mb-3">
													<div className="action-icon mb-3" style={{ fontSize: '3rem' }}>🌐</div>
												</div>
												<h5 className="action-title text-center" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.3rem' }}>
													{t('userHome.actions.online.title')}
												</h5>
												<p className="paragraph-text text-center">
													{online_status ? t('userHome.actions.online.connected') : t('userHome.actions.online.disconnected')}
												</p>
												<div className="text-center">
													<span className={`badge ${online_status ? 'bg-success' : 'bg-danger'}`}>
														{online_status ? '● Online' : '● Offline'}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<ScrollIndicator />
				</section>

				{/* Section 3: Game Modes Overview */}
				<section id="game-modes" className="section-full">
					<div className="container h-100 d-flex align-items-center justify-content-center">
						<div className="row w-100">
							<div className="col-lg-10 mx-auto text-white">
								<div className="section-content p-5 rounded-4 shadow-lg">
									<h2 className="text-center mb-5" style={{ fontFamily: 'cyber4', color: '#61DAFB', fontSize: '2.5rem' }}>
										{t('userHome.gameModes.title')}
									</h2>

									<div className="row mt-4">
										<div className="col-md-6 mb-4">
											<div className="mode-card p-4 rounded-3">
												<h5 className="mode-title" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem' }}>
													{t('userHome.gameModes.local.title')}
												</h5>
												<p className="paragraph-text">
													{t('userHome.gameModes.local.description')}
												</p>
												<ul className="mode-list paragraph-text">
													<li>{t('userHome.gameModes.local.feature1')}</li>
													<li>{t('userHome.gameModes.local.feature2')}</li>
													<li>{t('userHome.gameModes.local.feature3')}</li>
												</ul>
											</div>
										</div>

										<div className="col-md-6 mb-4">
											<div className="mode-card p-4 rounded-3">
												<h5 className="mode-title" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem' }}>
													{t('userHome.gameModes.multiplayer.title')}
												</h5>
												<p className="paragraph-text">
													{t('userHome.gameModes.multiplayer.description')}
												</p>
												<ul className="mode-list paragraph-text">
													<li>{t('userHome.gameModes.multiplayer.feature1')}</li>
													<li>{t('userHome.gameModes.multiplayer.feature2')}</li>
													<li>{t('userHome.gameModes.multiplayer.feature3')}</li>
												</ul>
											</div>
										</div>

										<div className="col-md-12 mb-4">
											<div className="mode-card p-4 rounded-3">
												<h5 className="mode-title" style={{ fontFamily: 'cyber4', color: '#FFD700', fontSize: '1.4rem' }}>
													{t('userHome.gameModes.tournament.title')}
												</h5>
												<p className="paragraph-text">
													{t('userHome.gameModes.tournament.description')}
												</p>
												<ul className="mode-list paragraph-text">
													<li>{t('userHome.gameModes.tournament.feature1')}</li>
													<li>{t('userHome.gameModes.tournament.feature2')}</li>
													<li>{t('userHome.gameModes.tournament.feature3')}</li>
													<li>{t('userHome.gameModes.tournament.feature4')}</li>
												</ul>
											</div>
										</div>
									</div>

									<div className="text-center mt-4">
										<button type="button" className="btn btn-lg btn-primary rounded-3 px-5 py-3 shadow"
											onClick={game_setup}
											style={{ fontFamily: 'cyber4', fontSize: '1.1rem' }}>
											{t('userHome.gameModes.exploreNow')}
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			<SettingsModal />

			{/* Styles */}
			<style>{`
				/* Global Styles */
				.user-home-container {
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

				/* Action Cards */
				.action-card {
					background-color: rgba(255, 255, 255, 0.05);
					border: 1px solid rgba(255, 215, 0, 0.2);
					transition: all 0.3s ease;
				}

				.action-card:hover {
					background-color: rgba(255, 255, 255, 0.1);
					border-color: rgba(255, 215, 0, 0.5);
					transform: translateY(-10px);
					box-shadow: 0 15px 40px rgba(255, 215, 0, 0.3);
				}

				.action-icon {
					transition: transform 0.3s ease;
				}

				.action-card:hover .action-icon {
					transform: scale(1.2) rotate(5deg);
				}

				/* Mode Cards */
				.mode-card {
					background-color: rgba(255, 255, 255, 0.05);
					border: 1px solid rgba(97, 218, 251, 0.3);
					transition: all 0.3s ease;
					height: 100%;
				}

				.mode-card:hover {
					background-color: rgba(255, 255, 255, 0.1);
					border-color: rgba(97, 218, 251, 0.6);
					transform: translateY(-5px);
					box-shadow: 0 10px 30px rgba(97, 218, 251, 0.3);
				}

				.mode-list {
					list-style-type: none;
					padding-left: 0;
				}

				.mode-list li {
					padding: 0.5rem 0;
					padding-left: 1.5rem;
					position: relative;
				}

				.mode-list li:before {
					content: "▸";
					position: absolute;
					left: 0;
					color: #61DAFB;
				}

				/* User Avatar Section */
				.user-avatar-section img {
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}

				.user-avatar-section img:hover {
					transform: scale(1.1);
					box-shadow: 0 0 30px rgba(97, 218, 251, 0.6);
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

				/* Button Styles */
				.btn-primary {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					border: none;
					transition: transform 0.3s ease, box-shadow 0.3s ease;
				}

				.btn-primary:hover {
					transform: translateY(-3px);
					box-shadow: 0 10px 25px rgba(102, 126, 234, 0.5);
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

					.action-icon,
					.mode-icon {
						font-size: 2rem !important;
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
			`}</style>
		</>
	);
}

export default UserHomePage;
