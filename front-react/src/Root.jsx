import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { GuestDataContext } from "./GuestDataContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { UserStatsContext } from "./UserStatsContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
	const [guestData, setGuestData] = useState(null);
	const [userStats, setUserStats] = useState(null);
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
			<GuestDataContext.Provider value={{guestData, setGuestData}}>
      <UserStatsContext.Provider value={{userStats, setUserStats}}>
        <div>{children}</div>
      </UserStatsContext.Provider>
			</GuestDataContext.Provider>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root