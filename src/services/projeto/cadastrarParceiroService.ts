import { AxiosError } from 'axios';
import { getToken } from '../auth';
import api from '../api';
import { CadastroParceiro } from '../../interface/parceiro.interface';

export default async function CadastrarParceiro (parceiro: CadastroParceiro): Promise<any> {
    try {
        const resposta = await api.post('/parceiro/cadastrar', parceiro, {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }
        });

        if (resposta.status === 201) {
            console.log('Parceiro cadastrado com sucesso!', resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
        
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
} 