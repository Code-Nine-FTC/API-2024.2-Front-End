import axios from 'axios';
import { BuscarProjeto } from "../../interface/projeto.interface";
import api from '../api';

export default async function ProcurarProjetoFunction(projeto: BuscarProjeto): Promise<any> {
    try {
        const params: { [key: string]: string } = {};

        // Aqui ele pega os filtros se tiverem e coloca no params
        Object.entries(projeto).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // Formata a data se for do tipo Date, caso contrário, converte para string
                params[key] = value instanceof Date ? value.toISOString() : value.toString();
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
        throw new Error('Erro ao buscar os projetos. Tente novamente mais tarde.');
    }
}
