import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import SettingsModal from "./SettingsModal";

function Menu()
{
  // if user already connected == SettingsModal
  // else LoginModal && RegisterModal
	return (
    <>
      <header className="p-4 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-lg-start">
            <ul class="nav col-sm-auto mb-2 justify-content-center mb-md-0">
              <select class="form-select form-select-sm" aria-label="language">
                <option selected>en</option>
                <option value="ru">ru</option>
                <option value="fr">fr</option>
              </select>
            </ul>
            <a href="/" className="d-flex align-items-center ms-3 mb-3 mb-md-0 me-md-auto text-decoration-none text-white">
              <span className="fs-4">Transcendance</span>
            </a>
            <div className="d-flex text-end">
              <button type="button" className="btn btn-outline-light me-2" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
              <button type="button" className="btn btn-warning me-2" data-bs-toggle="modal" data-bs-target="#signupModal" >Sign-up</button>
              <div className="">
                <button type="button" className="btn btn-danger" data-bs-toggle="modal" data-bs-target="#settingsModal" >Settings</button>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* <!-- Modal --> */}
      <LoginModal/>
      <RegisterModal/>
      <SettingsModal/>
    </>
  );
}

export default Menu