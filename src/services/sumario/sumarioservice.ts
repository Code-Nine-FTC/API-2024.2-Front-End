import api from "../api";
import { AxiosError } from 'axios';

export const buscarSumario = async (ano?: string): Promise<any> => {
    try {
        const params = ano ? { ano } : {};
        console.log('Parâmetros enviados para a API:', params); // Log dos parâmetros enviados
        const resposta = await api.get('/projeto/sumario', { params });
        console.log('Resposta da API:', resposta); // Log da resposta da API
        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao carregar o sumário. Por favor, tente novamente mais tarde.';
        console.error('Erro ao carregar o sumário:', errorMessage); // Log do erro
        throw new Error(errorMessage);
    }
};