import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL;
export const imgSrc = (p) => (!p ? '' : p.startsWith('http') ? p : `${API_URL}/${p}`);

export default axios.create({ baseURL: `${API_URL}/api` });