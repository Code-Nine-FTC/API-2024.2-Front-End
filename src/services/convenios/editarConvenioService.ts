import api from "../api";
import { getToken } from "../auth";
import { AxiosError } from 'axios';
import { ConvenioCadastro } from "../../interface/cadastros/convenio.interface";

const EditarConvenioService = async (convenioDados: ConvenioCadastro, id: number) => {
    try {
        console.log(convenioDados);
        const resposta = await api.put(`/convenio/atualizar/${id}`, convenioDados, {
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

export default EditarConvenioService;