import { AxiosError } from "axios";
import api from "../api";
import { getToken } from "../auth";

export default async function VisualizarMudancasFunction(projetoId?: string): Promise<any> {
    try {
        const resposta = projetoId
            ? await api.get(`/prestacao-contas/${projetoId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
            : await api.get(`/prestacao-contas/listar`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data || 'Erro ao carregar dados de prestação de contas.' };
        }

    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao carregar os dados do projeto. Por favor, tente novamente mais tarde.';
        
        console.error('Erro ao carregar dados de prestação de contas:', errorMessage);
        throw new Error(errorMessage);
    }
}