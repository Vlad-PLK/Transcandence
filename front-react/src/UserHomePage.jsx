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
import 'bootstrap/dist/css/bootstrap.min.css';

function UserHomePage() {
	const { userData, setUserData } = useContext(UserDataContext);
	const { setUserStats } = useContext(UserStatsContext);
	const { setGameData } = useContext(GameContext);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	};
	const loggedin_user = userData ? userData.username : null;

    useEffect(() => {
        console.log(loggedin_user);
        const online_status = new WebSocket('wss://'+window.location.host+'/wss/online/');

        online_status.onopen = function(e) {
            console.log('Connected to online status');
            online_status.send(JSON.stringify({
                'username': loggedin_user,
                'type': 'open' // Corrected key
            }));
        };

        window.addEventListener('beforeunload', function (e) {
            online_status.send(JSON.stringify({
                'username': loggedin_user,
                'type': 'offline' // Corrected key
            }));
        });

        online_status.onclose = function(e) {
            console.log('Connection closed');
        };

        online_status.onmessage = function(e) {
            var data = JSON.parse(e.data);
            if (data.username !== loggedin_user) {
				alert(`User connected: ${data.username}`);
                //var user_to_change = document.getElementById(`${data.username}_status`);
                //var small_status_to_change = document.getElementById(`${data.username}_small`);
                //if (data.online_status === true) {
                //    user_to_change.style.color = 'green';
                //    small_status_to_change.innerHTML = 'Online';
                //} else {
                //    user_to_change.style.color = 'red';
                //    small_status_to_change.innerHTML = 'Offline';
                //}
            }
        };

        return () => {
            online_status.close();
        };
    }, []);
	useEffect(() => {
		if (localStorage.getItem(ACCESS_TOKEN) != null)
		{
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
			.then(() => {
			})
			.catch(error => {
				console.log('Error:', error);
			});
		}
	}
	const game_setup = async() => {
		try{
			const response = await api.get('api/update-game-settings/')
			setGameData(response.data);
			navigate('../userGameSetup/')
		}catch(error){
			console.log(error);
		}	
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
												<img className="ms-2 rounded" src={"https://"+window.location.host+userData.avatar} alt="" height="40" width="40" />
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
					<button type="button" className="btn btn-dark rounded-3 me-2" onClick={game_setup}>{t('play_game')}</button>
				</div>
			</div>
			<SettingsModal />
		</>
	);
}

export default UserHomePage;
