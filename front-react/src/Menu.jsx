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
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                en
              </button>
              <div id="languages" className="dropdown-menu" aria-labelledby="languageMenuButton">
                <a className="dropdown-item" href="#">en</a>
                <a className="dropdown-item" href="#">fr</a>
                <a className="dropdown-item" href="#">ru</a>
              </div>
            </div>
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