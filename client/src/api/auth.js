import axios from './axios';

export const loginRequest = user => axios.post(`/auth/login`, user);

export const verifyToken = (token) => axios.get(`/auth/verify`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});