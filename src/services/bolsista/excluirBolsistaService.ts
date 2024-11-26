import api from "../api";
import { getToken } from "../auth";

const ExcluirBolsista = async (id: number): Promise<any> => {
    try {
        const resposta = await api.delete(`/bolsista/deletar/${id}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });
        if (resposta.status === 200) {
            console.log("Bolsista deletado com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
      } catch (error) {
        console.error('Erro ao excluir o arquivo', error);
        throw new Error('Erro ao excluir o arquivo. Tente novamente mais tarde');
      }
}

export default ExcluirBolsista;