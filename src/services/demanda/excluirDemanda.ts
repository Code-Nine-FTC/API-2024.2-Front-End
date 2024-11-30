import api from "../api";
import { getToken } from "../auth";

const ExcluirDemandaService = async (id: number): Promise<any> => {
    try {
        const resposta = await api.delete(`/classificacao-demanda/excluir/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (resposta.status === 200) {
            console.log("Demanda excluída com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        console.error("Erro ao excluir demanda", error);
        throw new Error("Erro ao excluir a demanda. Tente novamente mais tarde");
    }
};

export default ExcluirDemandaService;
