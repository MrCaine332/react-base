import axios from "axios"

export const API_URL = `http://localhost:5000`

const Http = axios.create({
    baseURL: API_URL,
    // withCredentials: true,
})

export { Http }
