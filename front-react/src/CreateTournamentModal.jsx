import { useContext, useState, useEffect } from "react";
import { UserDataContext } from "./UserDataContext";
import GuestModal from "./GuestModal";
import PlayerModal from "./PlayerModal";
import { useTranslation } from 'react-i18next';
import api from "./api";
import { useNavigate } from 'react-router-dom';
import { CurrentTournamentContext } from "./CurrentTournamentContext";

function CreateTournamentModal() {
    const { t } = useTranslation();
	const [playersNB, setPlayersNB] = useState(0);
	const {currentTournament, setCurrentTournament} = useContext(CurrentTournamentContext);
	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [nickname, setNickname] = useState('');
	const [name, setName] = useState('');
	const [errorTournament, setErrorTournament] = useState('');
	const [tournament, setTournament] = useState('');
	const [tournamentArray, setTournamentArray] = useState();
	const [playerList, setPlayerList] = useState([]);
	const [isCreated, setIsCreated] = useState(false);
	const [isFull, setIsFull] = useState(false);
	const [msg, setMsg] = useState('');
	const navigate = useNavigate();

	const incPlayers = () => {
        setPlayersNB(prevPlayersNB => prevPlayersNB + 1);
    };

	const addPlayer = async (e) => {
        e.preventDefault();
        if (!nickname) {
            setError(t('usernameRequired'));
            return;
        }
        try
        {
			await api.post('/api/get-user-id/', {username:nickname});
			setTournament(tournamentArray.id);
			for (let i = 0; i < playerList.length; i++) {
				if (playerList[i].nickname == nickname) {
					setError(t('tournament.userAlreadyInTournament'));
					setNickname('');
					return ;
				}
			}
            const response = await api.post('api/tournament/add-participant/', {tournament, nickname});
			incPlayers();
			setPlayerList([...playerList, response.data]);
			if (playersNB == 7)
				setIsFull(true);
            setNickname('');
            setError('');
        }
        catch(error)
        {
            console.log('Error:', error);
            setError(t('userNotFound'));
        }
    };

	const createTournament = async(e) => {
		e.preventDefault();
		if (!name) {
            setError(t('usernameRequired'));
            return;
        }
		try{
			const response = await api.post('api/tournament/create-tournament/', {name});
			setTournamentArray(response.data);
			setTournament(response.data.id);
			setIsCreated(true);
			setName('');
		}catch(error){
			setName('');
			setMsg(t('tournament.tournamentAlreadyExists'));
			console.log(error);
		}
	};
	const searchTournament = async(e) => {
		e.preventDefault();
		if (!username) {
			setError(t('usernameRequired'));
			return;
		}
		try {
			api.get('api/tournament/list-tournaments/')
			.then(response => {
				let i = 0;
				for (i; i < response.data.length; i++) {
					if (response.data[i].name == username) {
						setTournamentArray(response.data[i]);
						setTournament(response.data[i].id);
						const url = `api/tournament/${response.data[i].id}/participants/`;
						api.get(url)
						.then(response => {
							setPlayerList(response.data);
							setPlayersNB(response.data.length);
							if (response.data.length == 8)
								setIsFull(true);
						  })
						.catch(error => {
							console.log('Error:', error);
						  });
						setIsCreated(true);
						return ;
					}
				}
				if (i == response.data.length) {
					//a traduire//
					setErrorTournament(t('tournament.tournamentNotFound'));
				}
			})
			.catch(error => {
				console.log('Error:', error);
			});
		} catch (error) {
			console.log('Error:', error);
		}
	}
	const launchTournament = async(id) => {
        const url = `api/tournament/${id}/shuffle-participants/`;
		setCurrentTournament(prevState => ({
			...prevState,
			id: tournamentArray.id,
            creator: tournamentArray.creator,
            name: tournamentArray.name,
			playerList: playerList,
		}))
		try {
			const response = await api.post(url);
			console.log(response.data);
			const url2 = `api/tournament/${id}/tournament-matches/`;
			api.get(url2)
        	.then(response => {
				setCurrentTournament(prevState => ({
        	        ...prevState,
        	        matchList: response.data,
        	    }));
			  })
			.catch(error => {
				console.log('Error:', error);
			});
			navigate("../tournamentStats/", {state: {
				tournamentID: id,
			}});
		} catch (error) {
			console.log(error);
		}
	}

	const cleanModal = () => {
		setUsername('');
		setNickname('');
		setError('');
		setMsg('');
	}
    return (
        <>
            <div className="modal fade" id="tournamentCModal" tabIndex="-1" aria-labelledby="tournamentCLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header d-flex flex-column justify-content-center">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={cleanModal}></button>
                            <h1 className="fw-bold mb-0 fs-4" id="tournamentCLabel">{t('tournament.new')}</h1> 
							<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-trophy mt-2" viewBox="0 0 16 16">
  								<path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
							</svg>
						</div>
                        <div className="modal-body mt-5 p-5 pt-0">
                            <div className="">
								{!isCreated &&
								<>
								<div className="mb-2 mt-1">
                                    			<input
                                    			    type="text"
                                    			    className="form-control rounded-3"
                                    			    id="tournamentNew"
                                    			    placeholder={t('tournament.placeHolder')}
                                    			    autoComplete='tournament_name'
                                    			    value={name}
                                    			    onChange={(e) => setName(e.target.value)}
                                    			/>
                               				</div>
								<button type="button" className="btn btn-success btn-sm rounded-3 me-4 mb-3" onClick={createTournament}>{t('create_tournament')}</button>
								{msg && <p className="text-danger">{msg}</p>}
								</>}
								{!isCreated && <>
								<div className="mb-2 mt-2">
                                    			<input
                                    			    type="text"
                                    			    className="form-control rounded-3"
                                    			    id="tournamentSearch"
                                    			    placeholder={t('tournament.placeHolderSearch')}
                                    			    autoComplete='tournament_name'
                                    			    value={username}
                                    			    onChange={(e) => setUsername(e.target.value)}
                                    			/>
                               				</div>
								<button type="button" className="btn btn-primary btn-sm rounded-3 me-4 mb-3" onClick={searchTournament}>{t('search_tournament')}</button>
								{errorTournament && <p className="text-danger">{errorTournament}</p>}
								</>}
								{isCreated &&
								<>
								<p>Current Players in tournament {playersNB} / 8</p>
                                {playersNB < 8 && <div className="row g-3 align-items-center">
                                    <div className="col-auto d-flex flex-row">
										<form onSubmit={addPlayer}>
                                			<div className="form-floating mb-2 d-flex">
                                    			<input
                                    			    type="text"
                                    			    className="form-control rounded-3"
                                    			    id="tournamentPlayer"
                                    			    placeholder={t('usernamePlaceholder')}
                                    			    autoComplete='username'
                                    			    value={nickname}
                                    			    onChange={(e) => setNickname(e.target.value)}
                                    			/>
                                    			<label htmlFor="tournamentPlayer">{t('username')}</label>
                                				<button className="w-90 ms-2 btn btn-lg rounded-3 btn-danger" type="submit">{t('login')}</button>
                               				</div>
                                		{error && <p className="text-danger mt-1">{error}</p>}
                            			</form>
                                    </div>
                                </div>}
								<div className="mt-2">
									<p className="fs-4">{t('tournament.users')} : </p>
									{Array.isArray(playerList) && playerList.length > 0 ?
										<ul className="players-history list-group">
											{playerList.map((player, id) => (
												<li key={id} className="list-group-item">
													{player.nickname}
												</li>
											))}
										</ul>
										:
									<></>}
								</div>
								
								</>}
								{isFull && <button className="mt-4 btn btn-warning" style={{ color: "#000" }} data-bs-dismiss="modal" onClick={() => launchTournament(tournament)}>{t('startTheGame')}</button>} 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateTournamentModal;