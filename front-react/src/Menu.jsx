function Menu()
{
  const click=() => {
    window.$("#click-modal").modal('show');
  }

	return <header className="p-3 text-bg-dark">
    <div className="container">
      <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            en
          </button>
          <div class="dropdown-menu" aria-labelledby="languageMenuButton">
            <a class="dropdown-item" href="#">en</a>
            <a class="dropdown-item" href="#">fr</a>
            <a class="dropdown-item" href="#">ru</a>
          </div>
        </div>
        <a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none text-white">
          <svg class="bi me-2" width="40" height="32"><use xlink:href="#bootstrap"></use></svg>
          <span class="fs-4">Transcendance</span>
        </a>
        <div className="text-end">
          <button type="button" className="btn btn-outline-light me-2" onClick={click}>Login</button>
          <button type="button" className="btn btn-warning">Sign-up</button>
        </div>
      </div>
    </div>
  </header>
}

export default Menu