import api from "../../api";
import { getToken } from "../../auth";

const ExcluirProjeto = async (id: number): Promise<any> => {
    try {
        const resposta = await api.delete(`/projeto/deletar/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resposta.status === 200) {
            console.log("Projeto deletado com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
      } catch (error) {
        console.error('Erro ao excluir o arquivo', error);
        throw new Error('Erro ao excluir o arquivo. Tente novamente mais tarde');
      }
}

export default ExcluirProjeto;