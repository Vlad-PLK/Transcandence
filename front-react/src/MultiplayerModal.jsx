import React from 'react';
import { useTranslation } from 'react-i18next';

function MultiplayerModal() {
    const { t } = useTranslation();

    return (
        <>
            <div className="modal fade" id="multiplayerModal" tabIndex="-1" aria-labelledby="multiplayerModalLabel" aria-hidden="true" style={{fontFamily: 'cyber4'}}>
                <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header p-5 pb-4 border-bottom-0">
                            <h1 className="fw-bold mb-0 fs-4" id="multiplayerModalLabel">{t('multiplayerComingSoon')}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body ps-4 ms-4 mt-2 mb-4 border-bottom-0">
                            <a className="text-decoration-none text-dark fs-4" href="https://www.youtube.com/watch?v=xvFZjo5PgG0">{t('moreDetails')}</a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MultiplayerModal;
