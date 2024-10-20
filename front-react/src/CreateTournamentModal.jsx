import { useContext, useState } from "react";
import { UserDataContext } from "./UserDataContext";
import GuestModal from "./GuestModal";
import PlayerModal from "./PlayerModal";
import { useTranslation } from 'react-i18next';
import api from "./api";

function CreateTournamentModal() {
    const { t } = useTranslation();
	const [playersNB, setPlayersNB] = useState(0);
	const [error, setError] = useState('');
	const [username, setUsername] = useState('');
	const [nickname, setNickname] = useState('');
	const [name, setName] = useState('');
	const [tournament, setTournament] = useState('');
    const { userData } = useContext(UserDataContext);
	const [tournamentArray, setTournamentArray] = useState();
	const [playerList, setPlayerList] = useState([]);
	const [isCreated, setIsCreated] = useState(false);
	const [isFull, setIsFull] = useState(false);
	const [tournamentList, setTournamentList] = useState([]);

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
			setTournament(tournamentArray.id);
            const response = await api.post('api/tournament/add-participant/', {tournament, nickname});
            console.log(response.data);
			incPlayers();
			setPlayerList([...playerList, response.data]);
			console.log(playerList);
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
			//check for if the name already exists//
			const response = await api.post('api/tournament/create-tournament/', {name});
			console.log(response);
			setTournamentArray(response.data);
			setTournament(response.data.id);
			setIsCreated(true);
			setName('');
		}catch(error){
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
				console.log(username);
				for (let i = 0; i <= response.data.length; i++) {
					console.log(response.data[i]);
					console.log(response.data[i].name);
					if (response.data[i].name == username) {
						setTournamentArray(response.data[i]);
						setTournament(response.data[i].id);
						setIsCreated(true);
						//need a way to find the number of players in the tournament + the names//
					}
				}
			  })
			.catch(error => {
				console.log('Error:', error);
				// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
			  });
		} catch (error) {
			alert(error);
		}
	}
	const launchTournament = async(id) => {
        const url = `api/tournament/${id}/shuffle-participants/`;
		try {
			const response = await api.post(url);
			console.log(response);
		} catch (error) {
			console.log(error);
		}
	}
    return (
        <>
            <div className="modal fade" id="tournamentCModal" tabIndex="-1" aria-labelledby="tournamentCLabel" aria-hidden="true" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header d-flex flex-column justify-content-center">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h1 className="fw-bold mb-0 fs-4" id="tournamentCLabel">{t('tournament.new')}</h1> 
                        </div>
                        <div className="modal-body mt-3 p-5 pt-0">
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
								<button type="button" className="btn btn-success btn-sm rounded-3 me-4 mb-3" onClick={createTournament}>{t('create_tournament')}</button></>}
								{!isCreated && <>
								<div className="mb-2 mt-1">
                                    			<input
                                    			    type="text"
                                    			    className="form-control rounded-3"
                                    			    id="tournamentSearch"
                                    			    placeholder={t('tournament.placeHolder')}
                                    			    autoComplete='tournament_name'
                                    			    value={username}
                                    			    onChange={(e) => setUsername(e.target.value)}
                                    			/>
                               				</div>
								<button type="button" className="btn btn-primary btn-sm rounded-3 me-4 mb-3" onClick={searchTournament}>{t('search_tournament')}</button>
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
									{playerList.length > 0 ?
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