import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { GuestDataContext } from "./GuestDataContext";
import { TwoFaContext } from "./TwoFaContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { UserStatsContext } from "./UserStatsContext";
import { GameContext } from "./GameContext";
import { useTranslation } from "react-i18next"
import api from "./api";
import { TournamentPairDataContext } from "./TournamentPairDataContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
	const [guestData, setGuestData] = useState({nickname: '', id: 6, guestNickname: '', isGuest: true});
  const [tournamentPairData, setTournamentPairData] = useState({match_id: 0, player1_name: '', player2_name: '', player1_id: 0, player2_id: 0});
	const [userStats, setUserStats] = useState(null);
  const [TwoFA, setTwoFA] = useState(null);
  const {i18n: {changeLanguage} } = useTranslation();
  const [gameData, setGameData] = useState(null);
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
      {
        takeData(setUserData, setIsUserReady);
        //check_2FA();
      }
    }
  }, [isUserReady])

  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
			<GuestDataContext.Provider value={{guestData, setGuestData}}>
      <UserStatsContext.Provider value={{userStats, setUserStats}}>
      <TournamentPairDataContext.Provider value={{tournamentPairData, setTournamentPairData}}>
      <GameContext.Provider value={{gameData, setGameData}}>
      <TwoFaContext.Provider value={{TwoFA, setTwoFA}}>
        <div>{children}</div>
      </TwoFaContext.Provider>
      </GameContext.Provider>
      </TournamentPairDataContext.Provider>
      </UserStatsContext.Provider>
			</GuestDataContext.Provider>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root