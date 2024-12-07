import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'http://localhost:8080';

export const getToken = () => localStorage.getItem('token');

export const getTokenExpiration = (token) => {
    const decoded = jwtDecode(token);
    return decoded.exp ? decoded.exp * 1000 : null;
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    const token = response.data.token;

    const expirationTime = getTokenExpiration(token);
    if (expirationTime) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationTime);
    }

    setAuthHeader();
    return response.data;
};

export const signup = async (email, username, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { email, username, password });
    const token = response.data.token;

    const expirationTime = getTokenExpiration(token);
    if (expirationTime) {
        localStorage.setItem('token', token);
        localStorage.setItem('tokenExpiration', expirationTime);
    }

    setAuthHeader();
    return response.data;
};

export const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('tokenExpiration');
    return !expirationTime || Date.now() > parseInt(expirationTime, 10);
};

export const setAuthHeader = () => {
    if (isTokenExpired()) {
        logout();
    } else {
        const token = getToken();
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    delete axios.defaults.headers.common['Authorization'];
};

axios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            logout();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);
