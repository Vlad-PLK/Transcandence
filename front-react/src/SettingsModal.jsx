import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from './UserDataContext';
import { TwoFaContext } from './TwoFaContext';
import { useState } from 'react';
import api from './api';
import { use } from 'i18next';

function SettingsModal() {
    const { userData, setUserData } = useContext(UserDataContext);
    const { TwoFA, setTwoFA } = useContext(TwoFaContext);
    const [isTwoFAEnabled, setIsTwoFAEnabled] = useState(0);
    const [newUsername, setNewUsername] = useState('');
    const [logError, setLogError] = useState('');
    const [errorAvatar, setErrorAvatar] = useState('');
    const [errorNick, setErrorNick] = useState('');
    const [errorPass, setErrorPass] = useState('');
    const [messageAvatar, setMessageAvatar] = useState('');
    const [messageNick, setMessageNick] = useState('');
    const [messagePass, setMessagePass] = useState('');
    const [userAvatar, setUserAvatar] = useState(null);
    const [isAvatar, setIsAvatar] = useState(false);
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData)
        {
            api.get('api/users/user/status-2fa/')
            .then(response => {
                setTwoFA(response.data.is_2fa_enabled);
                //console.log(response.data);
            })
            .catch(error => {
                console.log('Error:', error);
              // alert('Login successful'); // Всплывающее уведомление или другой способ уведомления пользователя
            });
        }
    }, [])

    const clearNick = () => {
        document.getElementById('paramUsername-change').value = '';
        setMessageNick('');
        setErrorNick('');
    }

    const clearAvatar = () => {
        setSelectedFile(null);
        document.getElementById('avatar0').value = '';
        setMessageAvatar('');
        setErrorAvatar('');
    }

    const clearPass = () => {
        document.getElementById('oldPassword').value = '';
        document.getElementById('paramNewPassword').value = '';
        document.getElementById('paramNewConfirmPassword').value = '';
        setMessagePass('');
        setErrorPass('');
    }

    const clearAll = () => {
        clearAvatar();
        clearNick();
        clearPass();
        setMessageAvatar('');
        setMessageNick('');
        setMessagePass('');
    }

    const AvatarState = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];

        if (file && !allowedTypes.includes(file.type)) {
            setErrorAvatar('Invalid file type. Please select an image file (jpeg, png, gif, bmp, webp).');
        }
        else {
            setSelectedFile(file);
            if (event.target.files && event.target.files[0]) {
                setUserAvatar(event.target.files[0]);
            }
        }
    }

    const changeAvatar = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('avatar', userAvatar);
            const response = await api.post('api/users/user/avatar-upload/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUserData(response.data);
            setMessageAvatar(t('userSettings.avatarUploadSuccess'));
            setErrorAvatar('');
        } catch (error) {
            setErrorAvatar(t('userSettings.avatarUploadFailed'));
            setMessageAvatar('');
        }
    }
    useEffect(() => {
        if (newUsername) {
            setUserData(prevData => ({
                ...prevData,
                username: newUsername
            }));
        }
    }, [newUsername]);
    const changeUsername = () => {
        const username = document.getElementById('paramUsername-change').value;
        if (username.length > 0) {
            api.patch('api/users/user/update-username/', {
                username: username
            }).then(response => {
                document.getElementById('paramUsername-change').value = '';
                setMessageNick(t('userSettings.usernameUpdateSuccess'));
                setErrorNick('');
                setNewUsername(username);
            }).catch(error => {
                setErrorNick(t('userSettings.usernameUpdateFailed'));
                setMessageNick('');
            });
        }
    }

    const changePassword = () => {
        const oldPass = document.getElementById('oldPassword').value;
        const newPass = document.getElementById('paramNewPassword').value;
        const newConfirmPass = document.getElementById('paramNewConfirmPassword').value;
        if (newPass.length > 0 && newConfirmPass.length > 0) {
            setErrorPass("");
            if (newPass !== newConfirmPass)
                setErrorPass(t('userSettings.passwordMismatch'));
            else {
                api.post('api/users/user/change-password/', {
                    old_password: oldPass,
                    new_password: newPass,
                    confirm_new_password: newConfirmPass
                }).then(response => {
                    document.getElementById('oldPassword').value = '';
                    document.getElementById('paramNewPassword').value = '';
                    document.getElementById('paramNewConfirmPassword').value = '';
                    setMessagePass(t('userSettings.passwordUpdateSuccess'));
                    setErrorPass('');
                }).catch(error => {
                    setErrorPass(t('userSettings.passwordUpdateFailed') + ': ' + error.response.data.old_password);
                    setMessagePass('');
                });
            }
        }
    }
    const handle2FA = async (e) => {
        const isChecked = e.target.checked;
        try {
            if (isChecked) {    
                setTwoFA(true);
                await api.post('api/users/user/enable-2fa/');
                console.log(TwoFA);
            }
            else {
                setTwoFA(false);
                await api.post('api/users/user/disable-2fa/');
                console.log(TwoFA);
            }
		} catch (error) {
			setLogError(error.response.data);
            console.log(logError);
        }
    }
    useEffect(() => {
        if (TwoFA == true)
            setIsTwoFAEnabled(1);
        else if (TwoFA == false)
            setIsTwoFAEnabled(0);
    }, [TwoFA])
    return (
        <>
            <div className="modal fade" id="UserSettingsModal" tabIndex="-1" style={{ fontFamily: 'cyber4' }}>
                <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header d-flex flex-column justify-content-center p-5 pb-4 border-bottom-0">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={clearAll}></button>
                            <h1 className="fw-bold mb-0 fs-4">{t('userSettings.settings')}</h1>
                        </div>
                        <div className="form-check form-switch ms-5 mb-3" style={{transform: "scale(1.2)", transformOrigin: "top left"}}>
                                <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={isTwoFAEnabled} onChange={handle2FA}/>
                                <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
                                    {t('two_fa')}
                                    {isTwoFAEnabled == 1 ? (
                                        <span className="text-success">{t('userSettings.enabled')}</span>
                                    ) : (
                                        <span className="text-danger">{t('userSettings.disabled')}</span>
                                    )}
                                </label>
                        </div>
                        {userData && <div className="modal-body p-5 pt-0">
                            <p>{t('userSettings.changeAvatar')}</p>
                            <div className="d-flex mb-4">
                                <div>
                                    <input type="file" id="avatar0" className="filetype" onChange={AvatarState} style={{ display: 'none' }} />
                                    {selectedFile ? selectedFile.name : t('userSettings.chooseFile')}
                                    <label htmlFor="avatar0" className="file-label" style={{ cursor: 'pointer' }}>
                                        {userData.avatar == null ?
                                            <img className="rounded bg-warning" src="/robot.webp" alt="" height="100" width="100" />
                                            :
                                            <img className="rounded bg-warning" src={"https://"+window.location.host+userData.avatar} alt="" height="100" width="100" />
                                        }
                                    </label>
                                </div>
                                <div className="d-flex flex-column justify-content-center ms-3 mt-2">
                                    <button className="btn btn-success btn-sm mb-2" onClick={changeAvatar}>{t('userSettings.save')}</button>
                                    <button className="btn btn-danger btn-sm" onClick={clearAvatar}>{t('userSettings.cancel')}</button>
                                    {messageAvatar && <p className="text-success">{messageAvatar}</p>}
                                    {errorAvatar && <p className="mt-2 text-danger">{errorAvatar}</p>}
                                </div>
                            </div>
                            <p className="m-0">{t('userSettings.currentNickname')}: {userData.username}</p>
                            <div className="form-floating mb-4">
                                <input type="username" className="form-control rounded-3" id="paramUsername-change" placeholder={t('userSettings.usernamePlaceholder')} />
                                <label htmlFor="paramUsername-change">{t('userSettings.changeNickname')}</label>
                                <button className="btn btn-success btn-sm mt-2 me-2" onClick={changeUsername}>{t('userSettings.save')}</button>
                                <button className="btn btn-danger btn-sm mt-2" onClick={clearNick}>{t('userSettings.cancel')}</button>
                                {messageNick && <p className="mt-2 text-success">{messageNick}</p>}
                                {errorNick && <p className="mt-2 text-danger">{errorNick}</p>}
                            </div>
                            <p className="m-0">{t('userSettings.changePassword')}</p>
                            <div className="form-floating mb-2">
                                <input type="password" className="form-control rounded-3" id="oldPassword" placeholder={t('userSettings.oldPassword')} autoComplete='new-password' />
                                <label htmlFor="paramPassword">{t('userSettings.oldPassword')}</label>
                            </div>
                            <div className="form-floating mb-2">
                                <input type="password" className="form-control rounded-3" id="paramNewPassword" placeholder={t('userSettings.newPassword')} autoComplete='new-password' />
                                <label htmlFor="paramPassword">{t('userSettings.newPassword')}</label>
                            </div>
                            <div className="form-floating mb-4">
                                <input type="password" className="form-control rounded-3" id="paramNewConfirmPassword" placeholder={t('userSettings.confirmPassword')} autoComplete='new-password' />
                                <label htmlFor="paramcPassword">{t('userSettings.confirmNewPassword')}</label>
                                <button className="btn btn-success btn-sm mt-2 me-2" onClick={changePassword}>{t('userSettings.save')}</button>
                                <button className="btn btn-danger btn-sm mt-2" onClick={clearPass}>{t('userSettings.cancel')}</button>
                                {errorPass && <p className="mt-2 text-danger">{errorPass}</p>}
                                {messagePass && <p className="mt-2 text-success">{messagePass}</p>}
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}

export default SettingsModal;
