import axios from 'axios';

const API_URL = 'http://localhost:8080';

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const signup = async (email, username, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');

export const setAuthHeader = () => {
    const token = getToken();
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
};
