import api from "../api";
import { getToken } from "../auth";

const ExcluirParceiro = async (id: number): Promise<any> => {
    try {
        const resposta = await api.delete(`/parceiro/deletar/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resposta.status === 200) {
            console.log("Parceiro deletado com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
      } catch (error) {
        console.error('Erro ao excluir o parceiro', error);
        throw new Error('Erro ao excluir o parceiro. Tente novamente mais tarde');
      }
}

export default ExcluirParceiro;