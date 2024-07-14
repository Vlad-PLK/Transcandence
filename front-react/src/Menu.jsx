import { useContext, useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SettingsModal from "./SettingsModal";
import { useTranslation } from "react-i18next";
import { UserDataContext } from "./UserDataContext";
import { Link, useParams } from 'react-router-dom';

function Menu()
{
  const { t, i18n: { changeLanguage, language } } = useTranslation();
  const {userData, setUserData} = useContext(UserDataContext);
  const {id} = useParams();
   const handleLanguageChange = (event) => {
        const selectedLang = event.target.value;
        changeLanguage(selectedLang);
    };
  // setUserData("vlado");
	return (
    <>
      <header className="p-4 text-bg-dark">
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
            <div className="d-flex text-end">
              { userData === null ?
                <div>
                  <button type="button" className="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">{t('login')}</button>
                  <button type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#signupModal" >{t('signup')}</button>
                </div>
              :  
                <div class="dropdown">
                  <a href="" data-bs-toggle="dropdown" data-bs-dismiss="false">
                    <img src="./guychill.jpg" alt="" width="45" height="45" className="rounded-circle"/>
                  </a>
                  <ul class="dropdown-menu">
                    <li><Link to="/user/1" className="text-decoration-none ms-3">{userData}</Link></li>
                    <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#settingsModal">Settings</a></li>
                    <li><a class="dropdown-item" href="#">Disconnect</a></li>
                  </ul>
                </div>
              }
              </div>
          </div>
        </div>
      </header>
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