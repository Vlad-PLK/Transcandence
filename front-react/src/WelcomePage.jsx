import { useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { useTranslation } from "react-i18next";
import Title from "./Title";
import TranslationSelect from "./TranslationSelect";
import './customFonts.css';
import { UserDataContext } from "./UserDataContext";
import { useNavigate } from "react-router-dom";
import UserHomePage from "./UserHomePage";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

function WelcomePage()
{
  const { t } = useTranslation();
  const {userData} = useContext(UserDataContext);
  const {navigate} = useNavigate();

  const main_image = {
		backgroundImage: `url('/cyberpunk1.jpg')`,
		backgroundSize: 'cover', // Adjust background size as needed
		backgroundPosition: 'center', // Adjust background position as needed
	};
  
	return (
    <>
    {(localStorage.getItem(ACCESS_TOKEN) == null || localStorage.getItem(REFRESH_TOKEN) == null) ?	
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
                <div>
                  <button type="button" className="btn btn-outline-light rounded-3 me-2" data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
                </div>
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
    </>
    :  
    <UserHomePage/>}
    </>
  );
}

export default WelcomePage