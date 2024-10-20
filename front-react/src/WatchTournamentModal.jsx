import { useTranslation } from 'react-i18next';
import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { UserStatsContext } from './UserStatsContext';
import api from './api';
import { useNavigate } from 'react-router-dom';


function WatchTournamentModal() {
    const { t } = useTranslation();
	const {userData} = useContext(UserDataContext);
	const [tournamentList, setTournamentList] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
			try {
				api.get('api/tournament/list-tournaments/')
				.then(response => {
					setTournamentList(response.data)
				  })
				.catch(error => {
					console.log('Error:', error);
					// alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
				  });
			} catch (error) {
				alert(error);
			}
	},[])

	const tournamentPage = (id) => {
		//navigate to tournament page specified by the ID//
		navigate(`TournamentStats/${id}`);
	}
    return (
        <>
            <div className="modal fade" id="tournamentWModal" tabIndex="-1" aria-labelledby="tournamentWModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0 d-flex flex-column">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h1 className="fw-bold mb-0 fs-4" id="tournamentWModalLabel">{t('tournament.List')}</h1>
                        </div>
                        <div className="modal-body ps-4 ms-4 mt-2 mb-4 border-bottom-0">
						{tournamentList.length > 0 ?
							<ul className="tournament-history list-group">
								{tournamentList.map((tournament, id) => (
									<>
									<li key={id} className="list-group-item">
										{t('tournament.name')} : {tournament.name} | {t('tournament.creator')} : {tournament.creator}
									</li>
									<button className='btn btn-sm btn-success' onClick={() => tournamentPage(tournament.id)}>{t('tournament.watch')}</button>
									</>
								))}
							</ul>
						:
						<p className="text-muted">{t('tournament.noTournament')}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default WatchTournamentModal;
