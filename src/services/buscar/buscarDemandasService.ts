import api from "../api"
import { getToken } from "../auth"
import { AxiosError } from "axios"

export default async function buscarDemandasService () {
    try {
        const resposta = await api.get('/classificacao-demanda/listar', {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        })
        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data || 'Erro ao buscar demandas.' };
        }

    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao buscar demandas. Por favor, tente novamente mais tarde.';
        console.error('Erro ao buscar demandas:', errorMessage);
        throw new Error(errorMessage);
    }
}