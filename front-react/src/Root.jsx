import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { GuestDataContext } from "./GuestDataContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { UserStatsContext } from "./UserStatsContext";
import { GameContext } from "./GameContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
	const [guestData, setGuestData] = useState({nickname: 'nickname', id: 6, guestNickname: 'guest'});
	const [userStats, setUserStats] = useState(null);
  const [gameData, setGameData] = useState({
    starFlag:0,
    gargantuaSize:0,
    gargantuaColor:"0xc5e0e2",
    customStarSize:4,
    customStarColor:"0x2ec149",
    customStarIntensity:2,
    boostsEnabled:0,
    boostFactor:1,
    powerEnabled:0,
    gameDuration:10,
  });
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
      <GameContext.Provider value={{gameData, setGameData}}>
        <div>{children}</div>
      </GameContext.Provider>
      </UserStatsContext.Provider>
			</GuestDataContext.Provider>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root