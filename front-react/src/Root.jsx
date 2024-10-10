import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { GuestDataContext } from "./GuestDataContext";
import { TwoFaContext } from "./TwoFaContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { UserStatsContext } from "./UserStatsContext";
import { GameContext } from "./GameContext";
import { useTranslation } from "react-i18next"

function Root({children}){
  const [userData, setUserData] = useState(null);
	const [guestData, setGuestData] = useState({nickname: 'nickname', id: 6, guestNickname: 'guest', isGuest: true});
	const [userStats, setUserStats] = useState(null);
  const [TwoFA, setTwoFA] = useState({activated: false});
  const {i18n: {changeLanguage} } = useTranslation();
  const [gameData, setGameData] = useState({
    starFlag:0,
    gargantuaSize:2,
    gargantuaColor:"#c5e0e2",
    customStarSize:4,
    gargantuaIntensity:1,
    customStarColor:"#DC1010",
    customCoronaType:0,
    customStarIntensity:4,
    boostsEnabled:0,
    boostFactor:1,
    powerEnabled:0,
    gameDuration:10,
  });
  const [isUserReady, setIsUserReady] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("language") != null)
      changeLanguage(localStorage.getItem("language"));
  }, [])
  
  useEffect(() => {
    if (isUserReady == false){
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token)
          setIsUserReady(true);
      else
          takeData(setUserData, setIsUserReady);
    }
  }, [isUserReady])

  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
			<GuestDataContext.Provider value={{guestData, setGuestData}}>
      <UserStatsContext.Provider value={{userStats, setUserStats}}>
      <GameContext.Provider value={{gameData, setGameData}}>
      <TwoFaContext.Provider value={{TwoFA, setTwoFA}}>
        <div>{children}</div>
      </TwoFaContext.Provider>
      </GameContext.Provider>
      </UserStatsContext.Provider>
			</GuestDataContext.Provider>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root