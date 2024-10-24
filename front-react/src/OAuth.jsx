import { useEffect } from "react";
import api from "./api";

function OAuth() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        api.get("/api/users/user/oauth/?code="+code)
        .then(response => {
            console.log(response);
        })
        .catch(error => {
            console.log('Error:', error);
        });
    }, [])
}

export default OAuth