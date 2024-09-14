import axios from 'axios';
import { CadastrarProjeto } from "../../interface/projeto.interface";

export default async function CadastrarProjetoFunction (projeto: FormData): Promise<any> {
    try {
        const resposta = await axios.post('http://localhost:8080/projeto/cadastrar', projeto, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return resposta.data;
    } catch (error) {
        console.error('Erro ao enviar o projeto', error);
        throw error;
    }
}