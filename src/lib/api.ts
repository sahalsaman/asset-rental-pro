import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const signUp = (phone: string, countryCode: string, name: string, lastName: string, businessName: string) => api.post('/auth/signup', { phone, countryCode, name, lastName, businessName });

export const login = (phone: string, countryCode: string) => api.post('/auth/login', { phone, countryCode });

export const logout = () => api.post('/auth/logout');

export async function apiFetch(url: string, options: RequestInit & { preventRedirect?: boolean } = {}) {
  const { preventRedirect, ...fetchOptions } = options;
  const res = await fetch(url, {
    ...fetchOptions,
    credentials: "include", // send cookies
  });

  if (res.status === 401 && !preventRedirect) {
    if (typeof window !== "undefined") {
      const redirectPath = window.location.pathname.startsWith('/admin') ? '/admin-login' : '/login';
      window.location.href = redirectPath;
    }
  }

  return res;
}

export default api;
