import api from "../api"
import { getToken } from "../auth"
import { AxiosError } from 'axios';

const EditarProjetoService = async (projetoDados: FormData, id: number) => {
    try {
        console.log(projetoDados);
        const resposta = await api.put(`/projeto/atualizar/${id}`, projetoDados, {
            headers: {
                Authorization: `Bearer ${getToken()} `,
                'Content-Type': 'multipart/form-data',
            }
        });

        if (resposta.status === 200) {
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

export default EditarProjetoService;