import axios from 'axios';
import { RootState } from '../app/store';

// TODO: Add xsrf
export const api = axios.create({
    baseURL: process.env.NX_API_BASEURL,
    timeout: 3000,
})

api.interceptors.request.use(config => {
    const token = localStorage.getItem('wstState') ? (JSON.parse(localStorage.getItem('wstState') as string) as RootState).auth.token : ''
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})