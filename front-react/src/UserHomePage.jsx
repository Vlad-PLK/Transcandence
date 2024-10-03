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

function UserHomePage() {
	const { userData, setUserData } = useContext(UserDataContext);
	const { userStats, setUserStats } = useContext(UserStatsContext);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [parent, setParent] = useState(null);
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};
	const boxRef = useRef(null);
	const containerRef = useRef(null);
	const isClicked = useRef(false);
	const coords = useRef({
		startX: 0,
		startY: 0,
		lastX: 0,
		lastY: 0
	});
	useEffect(() => {
		if (!boxRef.current || !containerRef.current) return;

		const box = boxRef.current;
		const container = containerRef.current;
		const onMouseDown = (e) => {
			isClicked.current = true;
			coords.current.startX = e.clientX;
			coords.current.startY = e.clientY;
		}
		const onMouseUp = (e) => {
			isClicked.current = false;
			coords.current.lastX = box.offsetLeft;
			coords.current.lastY = box.offsetTop;
		}
		const onMouseMove = (e) => {
			if (!isClicked.current) return;

			const nextX = e.clientX - coords.current.startX + coords.current.lastX;
			const nextY = e.clientY - coords.current.startY + coords.current.lastY;

			box.style.top = `${nextY}px`;
			box.style.left = `${nextX}px`;
		}
		box.addEventListener('mousedown', onMouseDown);
		box.addEventListener('mouseup', onMouseUp);
		container.addEventListener("mousemove", onMouseMove);
		container.addEventListener("mouseleave", onMouseUp);

		const cleanup = () => {
			box.removeEventListener('mousedown', onMouseDown);
			box.removeEventListener('mouseup', onMouseUp);
			container.removeEventListener('mousemove', onMouseMove);
			container.removeEventListener('mouseleave', onMouseUp);
		}
		return cleanup;

	}, [])
	useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])
	const disconnect = () => {
		localStorage.clear();
		setUserData(null);
	}
	const stats_page = () => {
		if (userData) {
			try {
				api.get('api/player-stats/')
					.then(response => {
						setUserStats(response.data)
					})
					.catch(error => {
						console.log('Error:', error);
					});
			} catch (error) {
				alert(error);
			}
		}
		navigate('../userSettings');
	}
	function handleDragEnd(event) {
		const { over } = event;
		setParent(over ? over.id : null);
	}
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
									<button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
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
												<img className="ms-2 rounded" src={"http://localhost:8000" + userData.avatar} alt="" height="40" width="40" />
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
				<div className="opacity-75" style={{ position: 'absolute', top: '50%', left: '51%', transform: 'translate(-50%, -50%)', fontFamily: 'cyber4' }}>
					<Link to={`../userGameSetup/`} type="button" className="btn btn-dark rounded-3 me-2">{t('play_game')}</Link>
				</div>
			</div>
			<SettingsModal />
		</>
	);
}

export default UserHomePage;
