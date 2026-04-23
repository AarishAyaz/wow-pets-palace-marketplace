import axios from "axios";

const BASE_URL = "https://www.wowpetspalace.com/test";

const getToken = () => {
    try {
        const storedUser = localStorage.getItem("user");
        if(!storedUser) return null;

        const parsedUser = JSON.parse(storedUser);

        return(
            parsedUser?.authToken?.auth_token || parsedUser?.auth_token || null
        );
    } catch (error) {
        console.error("Invalid user in localStorage:", error);
        return null;
    }
};

const getAuthHeaders = () => {
    const token = getToken();

    return token  ? {Authorization: `Bearer ${token}`} : {};
}

export const createPaymentIntent = async (data: any) => {
    const res = await axios.post(`${BASE_URL}/product/createIntent`, data,
        {headers: getAuthHeaders()}
    );
    return res.data;
};

export const createOrder = async (data: any) =>{
    const res = await axios.post(`${BASE_URL}/product/v2/createOrder`, data,{
        headers: getAuthHeaders(),
    });
    return res.data;
};