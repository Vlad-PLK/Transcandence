import { useContext, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { UserStatsContext } from "./UserStatsContext";
import SettingsModal from "./SettingsModal";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import { Link } from "react-router-dom";
import './customFonts.css';
import { useNavigate } from "react-router-dom";
import api from "./api";

function UserHomePage(){
	const {userData} = useContext(UserDataContext);
	const {userStats, setUserStats} = useContext(UserStatsContext);
	const navigate = useNavigate();
	const {t} = useTranslation();
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	const disconnect=() => {
		localStorage.clear();
		navigate("/");
	}
	const stats_page = () => {
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
		}
		navigate('../userSettings');
    }
	return (
		<>
			<div className="d-flex flex-column vh-100" style={main_image}>
      			<header className="p-4 opacity-75" style={{fontFamily: 'cyber4'}}>
      			  <div className="container">
      			    <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
      			      <TranslationSelect/>
      			      <a href="/userPage/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
      			        <span className="fs-4">{t('main.title')}</span>
      			      </a>
      			      <div className="text-end">
      			          <div className="btn-group dropstart">
							<button type="button" className="btn btn-outline-light dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
								<span className="visually-hidden">Toggle Dropstart</span>
							</button>
							<ul className="dropdown-menu opacity-50" style={{fontSize:"12px",textAlign:"center", minWidth:"5rem"}}>
								<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</a>
								<Link to={`../userFriends`} className="dropdown-item">Friends</Link>
								<hr className="dropdown-divider"/>
								<button className="dropdown-item" onClick={disconnect}>Disconnect</button>
							</ul>
							{userData && <button type="button" className="btn btn-outline-light me-2" onClick={stats_page}>{userData.username}
								<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40"/>
							</button>}
      			          </div>
      			      </div>
      			    </div>
      			  </div>
      			</header>
      			<div className="opacity-75" style={{position: 'absolute', top: '50%', left: '51%', transform: 'translate(-50%, -50%)', fontFamily: 'cyber4'}}>
      			  <Link to={`../userGameSetup/`} type="button" className="btn btn-dark rounded-3 me-2">{t('play_game')}</Link>
      			</div>
    		</div>
			<SettingsModal/>
		</>
	);
}

export default UserHomePage