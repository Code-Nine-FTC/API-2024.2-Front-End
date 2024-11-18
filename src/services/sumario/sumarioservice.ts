import api from "../api";
import { AxiosError } from 'axios';

export const buscarSumario = async (): Promise<any> => {
    try {
        const resposta = await api.get('/projeto/sumario');
        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao carregar o sumário. Por favor, tente novamente mais tarde.';
        throw new Error(errorMessage);
    }
};