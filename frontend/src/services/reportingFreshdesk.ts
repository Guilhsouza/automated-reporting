import { api } from './api'

export default async function reportingFreshdesk() {
    try {
        const response = await api.post('reportingFreshdesk')

        return response
    } catch (e) {
        throw e
    }

}