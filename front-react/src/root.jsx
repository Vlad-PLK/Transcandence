import Menu from "./Menu";
import HomePage from "./HomePage";

function Root({children}){
    const click=() => {
      window.$("#click-modal").modal('show');
    }
    return (
    <>
      <Menu/>
      <HomePage/>
    </>
    );
  
}

export default Root