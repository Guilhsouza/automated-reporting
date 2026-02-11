import { api } from './api'

export default function login() {
    try {
        const response = api.post('/login')
        return response
    } catch (e) {
        throw e
    }
}
