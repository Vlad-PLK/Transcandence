import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import takeData from "./takeData";

function Root({children}){
  const [userData, setUserData] = useState(null);
  const [isUserReady, setIsUserReady] = useState(false);

  useEffect(() => {
    if (isUserReady == false){
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (token != null)
        takeData(setUserData, setIsUserReady);
      else
        setIsUserReady(true)
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