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

function UserHomePage(){
	const {userData} = useContext(UserDataContext);
	const {userStats, setUserStats} = useContext(UserStatsContext);
	const navigate = useNavigate();
	const {t} = useTranslation();
	const [parent, setParent] = useState(null);
	const main_image = {
		backgroundImage: `url('/cyber4.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
	const boxRef = useRef(null);
	const containerRef = useRef(null);
	const isClicked = useRef(false);
	const coords = useRef({
		startX: 0,
		startY: 0,
		lastX: 0,
		lastY: 0
	  })
	useEffect(() => {
		if (!boxRef.current || !containerRef.current) return;

   		const box = boxRef.current;
    	const container = containerRef.current;
		console.log("test");
		const onMouseDown = (e) => {
			isClicked.current = true;
			coords.current.startX = e.clientX;
      		coords.current.startY = e.clientY;
			console.log(coords);
			console.log("clicked");
		}
		const onMouseUp = (e) => {
			isClicked.current = false;
			coords.current.lastX = box.offsetLeft;
      		coords.current.lastY = box.offsetTop;
			console.log(coords);
			console.log("not clicked");
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
		container.addEventListener("mousemouve", onMouseMove);
		container.addEventListener("mouseleave", onMouseUp);

		const cleanup = () => {
			box.removeEventListener('mousedown', onMouseDown);
			box.removeEventListener('mouseup', onMouseUp);
			container.removeEventListener('mousemove', onMouseMove);
			container.removeEventListener('mouseleave', onMouseUp);
		}
		return cleanup;

	}, [])
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
	function handleDragEnd(event) {
		const {over} = event;
	
		// If the item is dropped over a container, set it as the parent
		// otherwise reset the parent to `null`
		setParent(over ? over.id : null);
	  }
	return (
		<>
			<div id="big_container" className="d-flex flex-column vh-100" style={main_image}>
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
								<a className="dropdown-item" href="" data-bs-toggle="modal" data-bs-target="#UserSettingsModal">Settings</a>
								<Link to={`../userFriends`} className="dropdown-item">Friends</Link>
								<hr className="dropdown-divider"/>
								<button className="dropdown-item" onClick={disconnect}>Disconnect</button>
							</ul>
							{userData && <button type="button" className="btn btn-outline-light me-2" onClick={stats_page}>{userData.username}
								{userData.avatar != null ?
									<img className="ms-2 rounded" src={"http://localhost:8000" + userData.avatar} alt="" height="40" widht="40"/>
									:
									<img className="ms-2 rounded" src="/robot.webp" alt="" height="40" widht="40"/>
								}
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
			<div ref={containerRef} style={{position: "relative",
  border: "1px solid black",
  height: "800px",
  width: "800px",
  overflow: "hidden",}}>
				<div ref={boxRef} style={{position: "absolute",
  top: "0",
  left: "0",
  color: "black",
  height: "60px",
  width: "60px",
  cursor: "pointer"}}>
						  	{/* <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-discord" viewBox="0 0 16 16" style={{color: "black"}}> */}
  								{/* <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/> */}
							{/* </svg> */}
				</div>
			</div>
			
			{/* <Chat></Chat> */}
		</>
	);
}

export default UserHomePage