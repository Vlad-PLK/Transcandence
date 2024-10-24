import { useEffect } from "react";
import api from "./api";
import { UserDataContext } from "./UserDataContext";
import takeData from "./takeData";
import { useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

function OAuth() {
	const { setUserData } = useContext(UserDataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        api.get("/api/users/user/oauth/?code="+code)
        .then(response => {
            localStorage.removeItem(ACCESS_TOKEN);
			localStorage.removeItem(REFRESH_TOKEN);
            console.log(response);
            localStorage.setItem(ACCESS_TOKEN, response.data.access_token);
			localStorage.setItem(REFRESH_TOKEN, response.data.refresh_token);
            takeData(setUserData);
			navigate("../userPage/");
        })
        .catch(error => {
            console.log('Error:', error);
        });
    })
}

export default OAuth