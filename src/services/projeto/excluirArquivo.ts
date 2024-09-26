import api from "../api";

export default async function excluirArquivo (id: number): Promise<any> {
    try {
        const url = api.getUri({ url: 'documento/excluir' });
        const resposta = await api.delete(url, { data: { id } });
        return resposta.data;
    } catch (error) {
        console.error('Erro ao excluir o arquivo', error);
        throw new Error('Erro ao excluir o arquivo. Tente novamente mais tarde');
    	}
}