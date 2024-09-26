import axios from 'axios';
import { BuscarProjeto } from "../../interface/projeto.interface";
import api from '../api';
import { format, parseISO, parse } from 'date-fns';

export default async function ProcurarProjetoFunction(projeto: BuscarProjeto): Promise<any> {
    try {
        const params: { [key: string]: string } = {};

        // Aqui ele pega os filtros se tiverem e coloca no params
        Object.entries(projeto).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                // Verifica se o valor é uma data no formato dd/MM/yyyy
                if (typeof value === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
                    // Mantém a data no formato dd/MM/yyyy
                    params[key] = value;
                } else {
                    params[key] = value.toString();
                }
            }
        });
        console.log('Parâmetros da requisição:', params);

        const url = api.getUri({ url: 'projeto/listar' });

        // Se usar os filtros ele usa o params se nao ele busca tudo
        const resposta = await axios.get(url, { params });

        console.log('Resposta da requisição:', resposta.data);

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
