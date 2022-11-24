import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://192.168.237.74:3003/api'
    //baseURL: 'http://172.22.4.164:3003/api',
    //baseURL: 'http://172.22.24.20:3003/api'
    
})