import api from "../api";
import { getToken } from "../auth";

const ExcluirConvenio = async (id: number): Promise<any> => {
    try {
        const resposta = await api.delete(`/convenio/deletar/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resposta.status === 200) {
            console.log("Convenio deletado com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
      } catch (error) {
        console.error('Erro ao excluir o Convenio', error);
        throw new Error('Erro ao excluir o Convenio. Tente novamente mais tarde');
      }
}

export default ExcluirConvenio;