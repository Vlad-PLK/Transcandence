import { useParams } from "react-router";
import PlayerStats from "./PlayerStats";
import { useContext, useEffect } from "react";
import { UserDataContext } from "./UserDataContext";
import { useTranslation } from "react-i18next";
import TranslationSelect from "./TranslationSelect";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SettingsModal from "./SettingsModal";
import { TwoFaContext } from "./TwoFaContext";
import { WebSocketContext } from "./WebSocketContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

function UserSettings()
{
    const {userData, setUserData} = useContext(UserDataContext);
    const {online_status} = useContext(WebSocketContext);
	const {TwoFA, setTwoFA} = useContext(TwoFaContext);
	const {t} = useTranslation();
	const navigate = useNavigate();
    const main_image = {
		backgroundImage: `url('/game_stats.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
		fontFamily: 'cyber4'
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

    return (
        <>
            <>
            <div className="d-flex flex-column vh-100" style={main_image}>
                <header className="p-4 opacity-75">
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
								<button className="dropdown-item" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">{t('dropdown.settings')}</button>
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
                <div className="d-flex justify-content-center mt-5">
                    <div className="col-sm-6 text-center">
                        <PlayerStats/>
                    </div>
                </div>
            </div>
			<SettingsModal/>
            </>
        </>
    ); 
};

export default UserSettings
