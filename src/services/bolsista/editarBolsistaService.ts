import api from "../api";
import { getToken } from "../auth";
import { AxiosError } from 'axios';

const EditarBolsistaService = async (bolsistaDados: string, idbolsista: number) => {
    try {
        console.log(bolsistaDados);
        const resposta = await api.put(`/bolsista/atualizar/${idbolsista}`, bolsistaDados, {
            headers: {
                Authorization: `Bearer ${getToken()} `,
                'Content-Type': 'application/json',
            }
        });

        if (resposta.status === 200) {
            console.log('Bolsista alterado com sucesso', resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        // errorMessage = errorMessage? || 'Erro ao realizar o cadastro. Por favor, tente novamente mais tarde.';
        throw new Error(errorMessage);
    }
}

export default EditarBolsistaService;