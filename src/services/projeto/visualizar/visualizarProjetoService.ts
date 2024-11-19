import api from "../../api";

const VisualizarProjetoService = async (id: number) => {
    try {
        const response = await api.get(`/projeto/visualizar/${id}`);
        console.log(response.data);
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, message: response.data };
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do projeto', error);
        throw new Error('Erro ao carregar os dados do projeto. Tente novamente mais tarde')
      }
}

export default VisualizarProjetoService;