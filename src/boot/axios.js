import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

// -----------------------------
// Public API (no auth)
// -----------------------------
const publicApi = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/json",
    }
})

// -----------------------------
// Auth API (Bearer token)
// -----------------------------
const authApi = axios.create({
    baseURL: process.env.API_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

    authApi.interceptors.request.use(config => {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
            error => {
        return Promise.reject(error);
    });

export default defineBoot(({ app }) => {
    app.config.globalProperties.$publicApi = publicApi
    app.config.globalProperties.$authApi = authApi
})

export { publicApi, authApi }
