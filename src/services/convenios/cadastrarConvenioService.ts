// src/services/cadastrarConvenioService.ts
import api from "../api";
import { getToken } from "../auth";
import { ConvenioCadastro } from "../../interface/cadastros/convenio.interface";
import { AxiosError } from "axios";

export default async function CadastrarConvenioService(convenioData: ConvenioCadastro): Promise<any> {
    try {
        const resposta = await api.post('/convenio/cadastrar', convenioData, {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }
        });

        if (resposta.status === 201) {
            console.log('Convenio cadastrado com sucesso', resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
        
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
}
