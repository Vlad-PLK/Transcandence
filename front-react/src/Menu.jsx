import { useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SettingsModal from "./SettingsModal";
import { useTranslation } from "react-i18next";
import { UserDataContext } from "./UserDataContext";
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Title from "./Title";
import TranslationSelect from "./TranslationSelect";
import './customFonts.css';

function Menu()
{
  // fix login, signup pour tout afficher correctement //
  // refaire stats //
  // finir le modal settings //
  // traduction complete //

  const { t, i18n: { changeLanguage, language } } = useTranslation();
  const {userData, setUserData} = useContext(UserDataContext);
  const {id} = useParams();
  const navigate = useNavigate()
  const main_image = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
  
	return (
    <>
		<div className="d-flex flex-column vh-100" style={main_image}>
      <header className="p-4 opacity-75" style={{fontFamily: 'cyber4'}}>
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
            <TranslationSelect/>
            <a href="/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
              <span className="fs-4">{t('main.title')}</span>
            </a>
            <div className="text-end">
              { userData === null ?
                <div>
                  <button type="button" className="btn btn-outline-light rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
                </div>
              :  
                navigate("userhome/" + {id})
              }
              </div>
          </div>
        </div>
      </header>
      <Title/>
      <div className="opacity-75" style={{position: 'absolute', top: '50%', left: '51%', transform: 'translate(-50%, -50%)', fontFamily: 'cyber4'}}>
        <button type="button" className="btn btn-dark rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#signupModal">{t('signup')}</button>
      </div>
    </div>
    <LoginModal/>
    <RegisterModal/>
    <SettingsModal/>
    {/* <footer className=""> */}
        {/* <p>this is the footer</p> */}
    {/* </footer> */}
      {/* <!-- Modal --> */}
                {/* <div> */}
                  {/* <button data-bs-toggle="modal" data-bs-target="#settingsModal" > */}
                    {/* <img src="./guychill.jpg" alt="" width="50" height="50"/> */}
                  {/* </button> */}
                {/* </div> */}
                {/* <div class="dropdown"> */}
                  {/* <a href="" data-bs-toggle="dropdown" data-bs-dismiss="false"> */}
                    {/* <img src="./guychill.jpg" alt="" width="45" height="45" className="rounded-circle"/> */}
                  {/* </a> */}
                  {/* <ul class="dropdown-menu"> */}
                    {/* <li><Link to={"/user/" + userData.id} className="dropdown-item ms-1">{userData.username}</Link></li> */}
                    {/* <li><button className="dropdown-item ms-1" style={{background: 'none'}}  data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</button></li> */}
                    {/* <li><button className="dropdown-item ms-1" style={{background: 'none'}}>Disconnect</button></li> */}
                  {/* </ul> */}
                {/* </div> */}
    </>
  );
}

export default Menu