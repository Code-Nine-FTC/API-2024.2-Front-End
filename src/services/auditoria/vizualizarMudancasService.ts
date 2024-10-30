import { AxiosError } from "axios";
import { Auditoria } from "../../interface/auditoria.interface";
import api from "../api";
import { getToken } from "../auth";

/* export default async function VisualizarMudancasFunction(projetoId?: string) {
  try {
    let response

    if (projetoId){
      response = await fetch('/data.json');
    } else {
      response = await fetch('/data.json')
    }

      if (!response.ok) {
          throw new Error(`Erro ao carregar os dados: ${response.statusText}`);
      }
      const data: Auditoria[] = await response.json();
      console.log(data)
      return { status: response.status, data };
  } catch (error) {
      console.error('Erro ao carregar os dados do projeto', error);
      throw new Error('Erro ao carregar os dados do projeto. Tente novamente mais tarde');
  }
} */

  export default async function VisualizarMudancasFunction(projetoId?: string): Promise<any> {
    try {
        const resposta = projetoId
            ? await api.get(`/auditorias/${projetoId}`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            })
            : await api.get(`/auditorias`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

        if (resposta.status === 200) {
            return { status: resposta.status, data: resposta.data };
        } else {
            return { status: resposta.status, message: resposta.data || 'Erro ao carregar dados de auditoria.' };
        }

    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const errorMessage = axiosError.response?.data?.message || 'Erro ao carregar os dados do projeto. Por favor, tente novamente mais tarde.';
        
        console.error('Erro ao carregar dados de auditoria:', errorMessage);
        throw new Error(errorMessage);
    }
}