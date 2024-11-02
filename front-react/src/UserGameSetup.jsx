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

function UserGameSetup()
{
	const {userData, setUserData} = useContext(UserDataContext);
	const [tournamentList, setTournamentList] = useState([]);
	const navigate = useNavigate();
	const {t} = useTranslation();
	const {online_status} = useContext(WebSocketContext);
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	useEffect(() => {
		if (userData == null)
			navigate("/");
	}, [userData])
	const disconnect=() => {
		console.log('Disconnected from websocket and closed connection');
		localStorage.clear();
		setUserData(null);
	}
	const buttons_style = {
		position: 'absolute', 
		top: '50%', 
		left: '51%', 
		transform: 'translate(-50%, -50%)', 
		fontFamily: 'cyber4',
	};
	const settings_button = {
    	color: 'black',
    	backgroundImage: 'linear-gradient(to right, #AC16A5,  #1F054C)',
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
								<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</a>
								<Link to={`../userFriends`} className="dropdown-item">{t('dropdown.friends')}</Link>
								<hr className="dropdown-divider"/>
								<button className="dropdown-item" onClick={disconnect}>{t('dropdown.disconnect')}</button>
							</ul>
							{userData && <Link to={`../userSettings/`} type="button" className="btn btn-outline-light me-2">{userData.username}
								{userData.avatar != null ?
									<img className="ms-2 rounded" src={"https://"+window.location.host+userData.avatar} alt="" height="40" widht="40"/>
									:
									<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40"/>
								}
							</Link>}
      			       </div>
      			      </div>
      			    </div>
      			  </div>
      			</header>
    		</div>
            <div className="d-flex flex-column mt-4" style={buttons_style}>
				<button type="button" className="btn btn-dark btn-lg rounded-3 me-4 mb-3" data-bs-toggle="modal" data-bs-target="#localGame" style={{color: '#6B3EB8'}}>{t('local')}</button>
				<button type="button" className="btn btn-dark btn-lg rounded-3 me-4 mb-3" data-bs-toggle="modal" data-bs-target="#tournamentWModal" style={{color: '#A337C7'}} onClick={search_tournament}>{t('join_tournament')}</button>
                <button type="button" className="btn btn-dark btn-lg rounded-3 me-4 mb-3" data-bs-toggle="modal" data-bs-target="#tournamentCModal" style={{color: '#FF29DF'}}>{t('create_tournament')}</button>
            </div>
            <div className="" style={{position: 'absolute', top: '20%', left: '51%', transform: 'translate(-50%, -50%)',fontFamily: 'cyber4'}}>
                <button type="button" className="btn btn-lg rounded-3 me-4 border-0" style={settings_button} data-bs-toggle="modal" data-bs-target="#gameSettings">{t('game_settings')}</button>
            </div>
			<div className="" style={{position: 'absolute', top: '80%', left: '51%', transform: 'translate(-50%, -50%)',fontFamily: 'cyber4'}}>
                <button type="button" className="btn btn-dark btn-lg rounded-3 me-4 border-0" data-bs-toggle="modal" data-bs-target="#multiplayerModal" style={{color: '#6B3EB8'}}>{t('multiplayer')}</button>
            </div>
            <LocalGameModal/>
            <MultiplayerModal/>
            <GameSettingsModal/>
			<SettingsModal/>
			<CreateTournamentModal/>
			<WatchTournamentModal tournamentList={tournamentList}/>
		</>
    )
}
export default UserGameSetup