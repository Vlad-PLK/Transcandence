import { useParams } from "react-router";
import PlayerStats from "./PlayerStats";

const playerData = {
    name: 'John Doe',
    wins: 10,
    losses: 5,
    draws: 2,
    goals: 150,
    matchHistory: [
      { opponent: 'Jane Doe', result: 'Win', score: '10-4' },
      { opponent: 'Bob Smith', result: 'Loss', score: '8-9' },
    ],
  };

function Settings()
{
    const {id} = useParams()

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

export default Settings
