import { AxiosError } from 'axios';
import { getToken } from '../../auth';
import api from '../../api';
import { CadastroBolsista } from '../../../interface/bolsistas.interface';

export default async function CadastrarBolsista (bolsista: CadastroBolsista): Promise<any> {
    try {
        const resposta = await api.post('/bolsista/cadastrar', bolsista, {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }
        });

        if (resposta.status === 201) {
            console.log('Bolsista cadastrado com sucesso', resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
        
    } catch (error) {
        let errorMessage = (error as AxiosError).response?.data as any;
        throw new Error(errorMessage);
    }
} 