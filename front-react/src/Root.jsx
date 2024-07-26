import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { jwtDecode } from "jwt-decode";


function Root({children}){
  const [userData, setUserData] = useState(null);
  const [isUserReady, setIsUserReady] = useState(false);

  useEffect(() => {
    if (isUserReady == false){
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token)
          setIsUserReady(true);
      takeData(setUserData, setIsUserReady);
    }
  }, [isUserReady])

  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
      <div>{children}</div>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root