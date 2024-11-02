import { useEffect, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import { GuestDataContext } from "./GuestDataContext";
import { WebSocketContext } from "./WebSocketContext";
import { TwoFaContext } from "./TwoFaContext";
import takeData from "./takeData";
import { ACCESS_TOKEN } from "./constants";
import { UserStatsContext } from "./UserStatsContext";
import { GameContext } from "./GameContext";
import { useTranslation } from "react-i18next"
import api from "./api";
import { TournamentPairDataContext } from "./TournamentPairDataContext";
import { CurrentTournamentContext } from "./CurrentTournamentContext";

function Root({children}){
  const [userData, setUserData] = useState(null);
	const [guestData, setGuestData] = useState({nickname: '', id: 6, guestNickname: '', isGuest: true});
  const [currentTournament, setCurrentTournament] = useState({
    creator: '', 
    id: 0,
    name: '',
    playerList: [[]], 
    matchList: [[]]
  });
  const [tournamentPairData, setTournamentPairData] = useState({tournament_id: 0, match_id: 0, player1_name: '', player2_name: '', player1_id: 0, player2_id: 0});
	const [userStats, setUserStats] = useState(null);
  const [TwoFA, setTwoFA] = useState(null);
  const {i18n: {changeLanguage} } = useTranslation();
  const [gameData, setGameData] = useState(null);
  const [isUserReady, setIsUserReady] = useState(false);
  const [online_status, setOnlineStatus] = useState(null);
  
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
        api.get('api/update-game-settings/')
			  .then(response => {
			  	setGameData(response.data);
			  })
			  .catch(error => {
			  	console.log('Error:', error);
			  });
      }
    }
  }, [isUserReady])
  useEffect(() => {
    if (userData) {
      let status;
      const connectWebSocket = () => {
        status = new WebSocket('wss://' + window.location.host + '/wss/online/');
  
        status.onopen = function(e) {
          console.log('Connected to web socket : status online');
          status.send(JSON.stringify({
            'username': userData.username,
            'type': 'open'
          }));
        };
  
        status.onerror = function(e) {
          console.error('WebSocket error:', e);
        };
  
        status.onclose = function(e) {
          console.log('WebSocket closed:', e);
          if (!e.wasClean) {
            console.log('Reconnecting...');
            setTimeout(connectWebSocket, 5000); // Reconnect after 5 seconds
          }
        };
      };
  
      connectWebSocket();
  
      const handleBeforeUnload = (e) => {
        if (status.readyState === WebSocket.OPEN) {
          status.send(JSON.stringify({
            'username': userData.username,
            'type': 'offline'
          }));
        }
      };
  
      window.addEventListener('beforeunload', handleBeforeUnload);
  
      return () => {
        if (status.readyState === WebSocket.OPEN) {
          status.send(JSON.stringify({
            'username': userData.username,
            'type': 'offline'
          }));
        }
        console.log('WebSocket connection closed');
        window.removeEventListener('beforeunload', handleBeforeUnload);
        status.close();
      };
    }
  }, [userData]);
  return (
  <>
    <UserDataContext.Provider value={{userData, setUserData}}>
		<WebSocketContext.Provider value={{online_status, setOnlineStatus}}>
    	<GuestDataContext.Provider value={{guestData, setGuestData}}>
      <UserStatsContext.Provider value={{userStats, setUserStats}}>
      <TournamentPairDataContext.Provider value={{tournamentPairData, setTournamentPairData}}>
      <GameContext.Provider value={{gameData, setGameData}}>
      <TwoFaContext.Provider value={{TwoFA, setTwoFA}}>
      <CurrentTournamentContext.Provider value={{currentTournament, setCurrentTournament}}>
        <div>{children}</div>
      </CurrentTournamentContext.Provider>
      </TwoFaContext.Provider>
      </GameContext.Provider>
      </TournamentPairDataContext.Provider>
      </UserStatsContext.Provider>
			</GuestDataContext.Provider>
    </WebSocketContext.Provider>
    </UserDataContext.Provider>
  </>
  );
  
}

export default Root