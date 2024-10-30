import { Auditoria } from "../../interface/auditoria.interface";

export default async function VisualizarMudancasFunction(projetoId?: string) {
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
}

/* export default async function VizualizarMudancaFunction(projetoId?: string){
  try {
    let response
    
    if (projetoId){
      response = await api.get(`/mudancas/${projetoId}`);
    } else {
      response = await api.get(`/mudancas`);
    }
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
} */