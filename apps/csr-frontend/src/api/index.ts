import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NX_API_BASEURL,
    timeout: 1500,
    headers: { 'Authorization': `Bearer ${localStorage.getItem('JWT_TOKEN')}` }
})