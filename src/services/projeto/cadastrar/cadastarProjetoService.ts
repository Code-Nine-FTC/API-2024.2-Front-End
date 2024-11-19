import api from '../../api';
import { CadastrarProjeto } from "../../../interface/projeto.interface";
import { AxiosError } from 'axios';
import { getToken } from '../../auth';

export default async function CadastrarProjetoFunction (projeto: CadastrarProjeto): Promise<any> {
    try {
        const resposta = await api.post('/projeto/cadastrar', projeto, {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }
        });

        if (resposta.status === 201) {
            console.log('Projeto cadastrado com sucesso', resposta.data);
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