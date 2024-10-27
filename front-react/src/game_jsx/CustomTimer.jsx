import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ConvertTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    return (minutes + ':' + seconds);
};

function CustomTimer({ flag, tournamentID, seconds, player1, player1_nick, player2, player2_nick, player1_score, player2_score, isGuest }) {
    const [count, setCount] = useState(seconds);
    const [extraTimeAdded, setExtraTimeAdded] = useState(false);
    const timerId = useRef();
    const navigate = useNavigate();

    const gameData = async () => {
        try {
            if (flag === 0) {
                console.log(player1, player2, player1_score, player2_score);
                const response = await api.post('api/match-create/', { player1, player2, player1_score, player2_score });
                console.log(response.data);
            } else {
                console.log(tournamentID, player1, player2, player1_score, player2_score);
                const url = `api/tournament/match/${tournamentID}/result/`;
                const response = await api.post(url, { player1_goals: player1_score, player2_goals: player2_score });
                console.log(response);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        timerId.current = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timerId.current);
    }, []);

    useEffect(() => {
        if (count === 0) {
            if (player1_score === player2_score && flag === 1 && !extraTimeAdded) {
                setCount(1);
                setExtraTimeAdded(true);
            } else if (player1_score !== player2_score) {
                console.log(player1, player1_nick, player2, player2_nick, player1_score, player2_score);
                if (!isGuest) gameData();
                clearInterval(timerId.current);
                navigate("../userGameEnd", {
                    replace: true,
                    state: {
                        flag: flag,
                        player1: player1,
                        player1_nick: player1_nick,
                        player2: player2,
                        player2_nick: player2_nick,
                        player1_score: player1_score,
                        player2_score: player2_score
                    }
                });
            }
        }
    }, [count, player1_score, player2_score, flag, extraTimeAdded]);

    return (
        <div>
            {ConvertTime(count)}
        </div>
    );
}

export default CustomTimer;
