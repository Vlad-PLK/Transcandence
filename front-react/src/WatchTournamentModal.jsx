import { useTranslation } from 'react-i18next';
import React, { useState, useContext, useEffect } from 'react';
import { UserDataContext } from './UserDataContext';
import { UserStatsContext } from './UserStatsContext';
import api from './api';
import { useNavigate } from 'react-router-dom';

function WatchTournamentModal({tournamentList}) {
    const { t } = useTranslation();
	const {userData} = useContext(UserDataContext);
	// const [tournamentList, setTournamentList] = useState([]);
	const navigate = useNavigate();
	console.log(tournamentList);

	const tournamentPage = (id) => {
		const tId = id;
		navigate("/tournamentStats/", {state: {
			tournamentID: tId
		}});
	}
    return (
        <>
            <div className="modal fade" id="tournamentWModal" tabIndex="-1" aria-labelledby="tournamentWModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0 d-flex flex-column">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <h1 className="fw-bold mb-0 fs-4" id="tournamentWModalLabel">{t('tournament.List')}</h1>
							<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-trophy mt-2" viewBox="0 0 16 16">
  								<path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935M3.504 1q.01.775.056 1.469c.13 2.028.457 3.546.87 4.667C5.294 9.48 6.484 10 7 10a.5.5 0 0 1 .5.5v2.61a1 1 0 0 1-.757.97l-1.426.356a.5.5 0 0 0-.179.085L4.5 15h7l-.638-.479a.5.5 0 0 0-.18-.085l-1.425-.356a1 1 0 0 1-.757-.97V10.5A.5.5 0 0 1 9 10c.516 0 1.706-.52 2.57-2.864.413-1.12.74-2.64.87-4.667q.045-.694.056-1.469z"/>
							</svg>
						</div>
                        <div className="modal-body ps-4 ms-4 mt-2 mb-4 border-bottom-0">
						{Array.isArray(tournamentList) && tournamentList.length > 0 ?
							<ul className="tournament-history list-group">
								{tournamentList.map((tournament, id) => (
            					<div key={id} className="d-flex mt-2 mb-2">
            					    <li className="list-group-item">
            					        {t('tournament.name')} : {tournament.name}
            					    </li>
            					    <button className='btn btn-sm btn-success ms-2' data-bs-dismiss="modal" onClick={() => tournamentPage(tournament.id)}>{t('tournament.watch')}</button>
            					</div>
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
