import Menu from "./Menu";

function Root({children}){
    const click=() => {
      window.$("#click-modal").modal('show');
    }
    return (
    <>
      <Menu/>
    </>
    );
  
}

export default Root