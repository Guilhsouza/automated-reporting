import { api } from './api'

export default async function login() {
    try {
        const response = await api.post('/loginAndGetData',
            {},
            { responseType: 'blob' }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]));

        const a = document.createElement('a');
        a.href = url;
        a.download = 'relatorio.xlsx';

        document.body.appendChild(a);
        a.click();
        a.remove();

        return response
    } catch (e) {
        throw e
    }
}
