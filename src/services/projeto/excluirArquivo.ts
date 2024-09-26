import api from "../api";
import { getToken } from "../auth";

export default async function ExcluirArquivo (id: number): Promise<any> {
    try {
        const url = api.getUri({ url: 'documento/excluir' });
        const resposta = await api.delete(`/documento/excluir/${id}`,
        {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        }
        );
        if (resposta.status === 200) {
            console.log('Arquivo excluído com sucesso', resposta.data);
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        console.error('Erro ao excluir o arquivo', error);
        throw new Error('Erro ao excluir o arquivo. Tente novamente mais tarde');
    	}
}