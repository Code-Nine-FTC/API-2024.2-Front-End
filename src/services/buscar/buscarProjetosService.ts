import axios from 'axios';
import { BuscarProjeto } from '../../interface/projeto.interface';
import api from '../api';
import { format, isValid, parse } from 'date-fns';

export default async function ProcurarProjetoFunction(projeto: BuscarProjeto): Promise<any> {
    try {
        const params: { [key: string]: string } = {};

        // Aqui ele pega os filtros se tiverem e coloca no params
        Object.entries(projeto).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                if (typeof value === 'string' && key.includes('data')) {
                    // Utiliza o formato 'yyyy-MM-dd' diretamente
                    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
                    if (isValid(parsedDate)) {
                        // Converte para o formato 'yyyy-MM-dd' para o backend
                        params[key] = format(parsedDate, 'yyyy-MM-dd');
                    } else {
                        console.warn(`Data inválida para o campo ${key}:`, value);
                    }
                } else {
                    params[key] = value.toString();
                }
            }
        });


        const url = api.getUri({ url: 'projeto/listar' });

        // Se usar os filtros ele usa o params se nao ele busca tudo
        const resposta = await axios.get(url, { params });


        // aqui ele verifica se a resposta é vazia ai se for ele retorna que nada foi encontrado
        if (resposta.data && resposta.data.length === 0) {
            return { message: 'Nenhum projeto encontrado com os filtros aplicados.' };
        }

        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar o projeto', error);
        if (axios.isAxiosError(error)) {
            console.error('Erro de Axios:', error.response?.data);
        }
        throw new Error('Erro ao buscar os projetos. Tente novamente mais tarde.');
    }
}