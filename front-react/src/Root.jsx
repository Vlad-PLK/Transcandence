import Menu from "./Menu";

function Root({children}){
    return (
    <>
      <Menu/>
      <div>{children}</div>
    </>
    );
  
}

export default Root