import { useState } from "react";
import WelcomePage from "./WelcomePage";
import { UserDataContext } from "./UserDataContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
      <div>{children}</div>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root