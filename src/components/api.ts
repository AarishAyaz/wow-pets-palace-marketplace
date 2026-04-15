import axios from "axios";

const API = axios.create({
    baseURL: "https://www.wowpetspalace/com/test",
});

API.interceptors.request.use((config)=> {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if(user?. auth_token){
        config.headers.Authorization = `Bearer ${user.auth_token}`;
    }
    return config;
})