import api from "../api";
import { VisualizarDemanda } from "../../interface/demanda.interface"; // Importando a interface
import { getToken } from "../auth";

const EditarDemandaService = async (id: number, dadosEditados: VisualizarDemanda): Promise<any> => {
    try {
        const resposta = await api.put(`/classificacao-demanda/editar/${id}`, dadosEditados, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });

        if (resposta.status === 200) {
            console.log("Demanda editada com sucesso!");
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data };
        }
    } catch (error) {
        console.error("Erro ao editar demanda", error);
        throw new Error("Erro ao editar a demanda. Tente novamente mais tarde");
    }
};

export default EditarDemandaService;
