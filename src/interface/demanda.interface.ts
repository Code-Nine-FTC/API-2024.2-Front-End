import { VisualizarParceiro } from './parceiro.interface';
import { VisualizarProjeto } from './projeto.interface';

export interface CadastrarDemanda {
    descricao: string;
    statusAtendimento: string;
    tipo: string;
    prioridade: string;
}

export interface VisualizarDemanda {
    id: number;
    descricao: string;
    statusAtendimento: string;
    tipo: string;
    prioridade: string;
    parceiros?: VisualizarParceiro[];
    projetos?: VisualizarProjeto[];
}

export interface AtualizarDemanda {
    descricao: string;
    statusAtendimento: string;
    tipo: string;
    prioridade: string;
    parceiros?: number[];
    projetos?: number[];
}