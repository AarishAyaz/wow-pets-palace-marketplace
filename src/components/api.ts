import axios from "axios";

const API = axios.create({
    baseURL: "https://www.wowpetspalace.com/test",
});

API.interceptors.request.use((config)=> {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = user?.authToken?.auth_token || user?.auth_token;

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default API;