import api from "../api";
import { getToken } from "../auth";
import { AxiosError } from 'axios';

interface ParceiroDados {
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    areaColaboracao: string;
}

const EditarParceiroService = async (parceiroDados: ParceiroDados, id: number) => {
    try {
        console.log(parceiroDados);
        const resposta = await api.put(`/parceiro/atualizar/${id}`, parceiroDados, {
            headers: {
                Authorization: `Bearer ${getToken()} `,
                'Content-Type': 'application/json',
            }
        });

        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
}

export default EditarParceiroService;