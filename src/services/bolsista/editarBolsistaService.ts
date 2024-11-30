import api from "../api";
import { getToken } from "../auth";
import { AxiosError } from 'axios';

interface BolsistaDados {
    nome: string;
    documento: string;
    rg: string;
    tipoBolsa: string;
    duracao: string;
    areaAtuacao: string;
}
const EditarBolsistaService = async (bolsistaDados: BolsistaDados, id: number) => {
    try {
        console.log(bolsistaDados);
        const resposta = await api.put(`/bolsista/atualizar/${id}`, bolsistaDados, {
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

export default EditarBolsistaService;