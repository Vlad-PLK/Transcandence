import Menu from "./Menu";

function Root({children}){
    return (
    <>
      <Menu/>
      {/* <HomePage/> */}
      {/* <Settings/> */}
      <div>{children}</div>
    </>
    );
  
}

export default Root