import { api } from './api'

export const helloWorld = async () => {
    try {
        const response = await api.get('')
        return response.data
    } catch (e) {
        throw e
    }
}