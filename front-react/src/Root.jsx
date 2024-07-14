import { useState } from "react";
import Menu from "./Menu";
import { UserDataContext } from "./UserDataContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
      <Menu/>
      <div>{children}</div>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root