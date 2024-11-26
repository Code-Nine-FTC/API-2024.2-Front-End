import api from "../api";

const VisualizarBolsistaService = async (id: number) => {
    try {
        const response = await api.get(`/bolsista/visualizar/${id}`);
        console.log(response.data);
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, message: response.data };
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do bolsista', error);
        throw new Error('Erro ao carregar os dados do bolsista. Tente novamente mais tarde')
      }
}

export default VisualizarBolsistaService;