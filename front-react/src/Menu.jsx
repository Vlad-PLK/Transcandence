import { useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SettingsModal from "./SettingsModal";
import { useTranslation } from "react-i18next";
import { UserDataContext } from "./UserDataContext";
import { Link, useParams } from 'react-router-dom';
import './customFonts.css';

function Menu()
{
  // refaire design principal //
  // diviser menu //
  // fix login, signup pour tout afficher correctement //
  // refaire stats //
  // finir le modal settings //
  // traduction complete //

  const { t, i18n: { changeLanguage, language } } = useTranslation();
  const {userData, setUserData} = useContext(UserDataContext);
  const {id} = useParams();
  const handleLanguageChange = (event) => {
      const selectedLang = event.target.value;
      changeLanguage(selectedLang);
  };
  const myStyle = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
  const textStyle = {
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text', // WebKit browsers support
    backgroundColor: 'transparent',
    color: 'transparent',
    backgroundImage: 'linear-gradient(to bottom, #ff00a0,  #ff911a)',
    fontFamily: 'cyberFont',
    fontSize: '100px',
  };
	return (
    <>
		<div className="d-flex flex-column vh-100" style={myStyle}>
      <header className="p-4 opacity-75">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
            <ul className="nav col-sm-auto mb-2 justify-content-center mb-md-0">
              <select className="form-select form-select-sm" aria-label="language" defaultValue={language} onChange={handleLanguageChange}>
                <option value="en">EN</option>
                <option value="ru">RU</option>
                <option value="fr">FR</option>
              </select>
            </ul>
            <a href="/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
              <span className="fs-4">{t('title')}</span>
            </a>
            <div className="text-end">
              { userData === null ?
                <div>
                  <button type="button" className="btn btn-outline-light rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
                  <button type="button" className="btn btn-warning rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#signupModal">{t('signup')}</button>
                </div>
              :  
                <div class="dropdown">
                  <a href="" data-bs-toggle="dropdown" data-bs-dismiss="false">
                    <img src="./guychill.jpg" alt="" width="45" height="45" className="rounded-circle"/>
                  </a>
                  <ul class="dropdown-menu">
                    <li><Link to="/user/1" className="dropdown-item ms-1">{userData.username}</Link></li>
                    <li><button className="dropdown-item ms-1" style={{background: 'none'}}  data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button></li>
                    <li><button className="dropdown-item ms-1" style={{background: 'none'}}>Disconnect</button></li>
                  </ul>
                </div>
              }
              </div>
          </div>
        </div>
      </header>
      <div className="d-flex justify-content-center">
        <p style={textStyle}>
          Transcendance
        </p>
      </div>
    </div>
      {/* <!-- Modal --> */}
      <LoginModal/>
      <RegisterModal/>
      <SettingsModal/>
                {/* <div> */}
                  {/* <button data-bs-toggle="modal" data-bs-target="#settingsModal" > */}
                    {/* <img src="./guychill.jpg" alt="" width="50" height="50"/> */}
                  {/* </button> */}
                {/* </div> */}
    </>
  );
}

export default Menu