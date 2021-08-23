import axios from 'axios';

// TODO: Add xsrf and get url from env
export const api = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1500,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('JWT_TOKEN')}` }
})