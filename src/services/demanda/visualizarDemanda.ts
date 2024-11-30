import api from "../api";
import { AxiosError } from "axios";
import { getToken } from "../auth";

const ListarDemandasService = async (): Promise<any> => {
    try {
        const response = await api.get("/classificacao-demanda/listar", {
            headers: {
                Authorization: `Bearer ${getToken()}` // Autenticação via Bearer token
            }
        });
        if (response.status === 200) {
            return { status: response.status, data: response.data };
        } else {
            return { status: response.status, message: response.data };
        }
    } catch (error) {
        console.error("Erro ao listar demandas", error);
        throw new Error("Erro ao carregar as demandas. Tente novamente mais tarde");
    }
};

export default ListarDemandasService;
