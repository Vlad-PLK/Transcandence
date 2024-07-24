import { useParams } from "react-router";
import PlayerStats from "./PlayerStats";
import { useContext } from "react";
import { UserDataContext } from "./UserDataContext";

function UserSettings()
{
    const {id} = useParams()
    const {userData, setUserData} = useContext(UserDataContext);
    const playerData = {
        name: userData.username,
        wins: 10,
        losses: 5,
        draws: 2,
        goals: 150,
        matchHistory: [
          { opponent: 'Jane Doe', result: 'Win', score: '10-4' },
          { opponent: 'Bob Smith', result: 'Loss', score: '8-9' },
        ],
      };

    return (
        <>
            <div className="row justify-content-center mt-5">
                <div className="col-sm-6 text-center">
                    <h1>Player ID {id}</h1>
                    <PlayerStats {...playerData} />
                </div>
            </div>
        </>
    ); 
};

export default UserSettings
