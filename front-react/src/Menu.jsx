import { useState } from "react";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";


function Menu()
{
  const [openState, setOpen] = useState(false);
  const changeModalState=() => {
    setOpen(!openState);
  }
  const [openStateRegister, setOpenRegister] = useState(false);
  const changeModalStateRegister=() => {
    setOpenRegister(!openStateRegister);
  }

	return (
    <>
      <header className="p-3 text-bg-dark">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <div className="dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                en
              </button>
              <div className="dropdown-menu" aria-labelledby="languageMenuButton">
                <a className="dropdown-item" href="#">en</a>
                <a className="dropdown-item" href="#">fr</a>
                <a className="dropdown-item" href="#">ru</a>
              </div>
            </div>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none text-white">
              <svg className="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
              <span className="fs-4">Transcendance</span>
            </a>
            <div className="text-end">
              <button type="button" className="btn btn-outline-light me-2" onClick={changeModalState}>Login</button>
              <button type="button" className="btn btn-warning" onClick={changeModalStateRegister} >Sign-up</button>
            </div>
          </div>
        </div>
      </header>
      {openState && (
        <LoginModal/>
      )}
      {openStateRegister && (
        <RegisterModal/>
      )}
    </>
  );
}

export default Menu