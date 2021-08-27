import axios from 'axios';
import { RootState } from '../app/store';

// TODO: Add xsrf and get url from env
export const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1500,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('wstState') ? (JSON.parse(localStorage.getItem('wstState') as string) as RootState).auth.token : ''}` }
})