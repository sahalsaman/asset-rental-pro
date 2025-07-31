import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

export const signUp = (phone: string, name: string) => api.post('/auth/signup', { phone, name });

export const registerPhone = (phone: string) => api.post('/auth/register', { phone });

export const verifyOtp = (phone: string, otp: string) => api.post('/auth/verify', { phone, otp });

export const sendOtpApi = (phone: string) => api.post('/auth/login', { phone });

export const verifyOtpApi = (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp });

export const getSession = () => api.get('/auth/session');

export const logout = () => api.post('/auth/logout');

export default api;
