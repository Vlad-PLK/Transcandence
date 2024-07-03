import Menu from "./Menu";
import HomePage from "./HomePage";
import Settings from "./Settings";

function Root({children}){
    const click=() => {
      window.$("#click-modal").modal('show');
    }
    return (
    <>
      <Menu/>
      <HomePage/>
      <Settings/>
      <div className="container">{children}</div>
    </>
    );
  
}

export default Root