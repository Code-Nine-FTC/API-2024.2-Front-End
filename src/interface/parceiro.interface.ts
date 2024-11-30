import { VisualizarDemanda } from "./demanda.interface";
import { FileOrVisualizarDocumento } from "./documento.interface";
import { VisualizarProjeto } from "./projeto.interface";

export interface CadastroParceiro {
  nome: string,
  cnpj: string,
  email: string,
  telefone: string,
  classificacaoDemanda: VisualizarDemanda[],
}

export interface VisualizarParceiro {
  id: number,
  nome: string,
  cnpj: string,
  email: string,
  telefone: string,
  areaColaboracao: string,
  projetos?: VisualizarProjeto[],
  classificacaoDemandas: VisualizarDemanda[],
}