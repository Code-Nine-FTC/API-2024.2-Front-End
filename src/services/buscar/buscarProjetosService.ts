import axios from 'axios';
import { BuscarProjeto } from "../../interface/projeto.interface";

export default async function ProcurarProjetoFunction(projeto: BuscarProjeto): Promise<any> {
    try {
        let resposta;
        const params = new URLSearchParams();
        // Olha cada parametro do objeto da interface do projeto e adiciona os valores ao paremetros de busca
        Object.entries(projeto).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !=='') {
                params.append(key, value instanceof Date ? value.toISOString() : value.toString());
            }
        });

        if (params.toString()) {
            // vai buscar o projeto de acordo com os parametros
            resposta = await axios.get('http://localhost:8080/projeto/listar', { params });
        } else {
            // se nao tiver nenhum parametro ele busca todos os projetos
            resposta = await axios.get('http://localhost:8080/projeto/listar');
        }
        // se nos parametros fornecidos pelo usuario ele nao achar nada, ele printa um erro
        if (resposta.data && resposta.data.length === 0) {
            throw new Error('Nenhum projeto encontrado com os filtros aplicados.');
        }

        return resposta.data;
    } catch (error) {
        console.error('Erro ao achar o projeto', error);
        throw error;
    }
}