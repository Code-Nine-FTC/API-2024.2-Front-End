import api from "../api";
import { getToken } from "../auth";
const VisualizarDemandaService = async (id: number) => {
    try {
        const response = await api.get(`/classificacao-demanda/visualizar/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        console.log(response.data);
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, message: response.data };
        }
      } catch (error) {
        console.error('Erro ao carregar os dados da demanda', error);
        throw new Error('Erro ao carregar os dados da demanda. Tente novamente mais tarde')
      }
}

export default VisualizarDemandaService;