import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
})

// If a token exists in localStorage (set after login), attach it to requests
const token = typeof window !== 'undefined' ? window.localStorage.getItem('auth-token') : null
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api