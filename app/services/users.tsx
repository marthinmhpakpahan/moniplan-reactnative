import { BASE_URL } from "@/utils/helper";
import axios from "axios";

export const login = async (_email: string, _password: string) => {
    try {
        const response = await axios.post(BASE_URL + "/api/v1/auth/login", { 
            email: _email, password: _password 
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Login failed:", error.response.data);
            throw new Error(error.response.data.message || "Login failed");
        }
        throw error;
    }
};

export const register = async (_name: string, _email: string, _password: string) => {
    try {
        const response = await axios.post(BASE_URL + "/api/v1/auth/register", { 
            name: _name,
            email: _email,
            password: _password
        });
        return response.data;
    } catch (error: any) {
        if (error.response) {
            console.error("Login failed:", error.response.data);
            throw new Error(error.response.data.message || "Login failed");
        }
        throw error;
    }
};
