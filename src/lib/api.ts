import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

export const signUp = (phone: string, countryCode:string,name: string,organisationName:string) => api.post('/auth/signup', { phone, countryCode, name, organisationName });

export const registerPhone = (phone: string) => api.post('/auth/register', { phone });

export const verifyOtp = (phone: string, otp: string) => api.post('/auth/verify', { phone, otp });

export const sendOtpApi = (phone: string,countryCode:string) => api.post('/auth/login', { phone, countryCode });

export const verifyOtpApi = (phone: string, otp: string) => api.post('/auth/verify-otp', { phone, otp });

export const getSession = () => api.get('/auth/session');

export const logout = () => api.post('/auth/logout');

export async function apiFetch(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // send cookies
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/auth/login";
    }
  }

  return res;
}

export default api;
