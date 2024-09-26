import { VisualizarDocumento } from "./documento.interface";

export interface CadastrarProjetoJson {
    titulo: string;
    referenciaProjeto: string;
    contratante: string;
    objeto: string;
    descricao?: string;
    nomeCoordenador: string;
    valor: number;
    dataInicio: string;
    dataTermino: string;
}

export interface CadastrarProjeto {
    titulo: string;
    referencia: string;
    nomeCoordenador: string;
    dataInicio: string;
    valor?: number;
    dataTermino?: string;
    contratante?: string;
}

export interface EditarProjeto {
    id: number;
    titulo: string;
    referencia: string;
    contratante?: string;
    objeto?: string;
    descricao?: string;
    nomeCoordenador: string;
    dataInicio: string;
    dataTermino?: string;
    valor?: number;
    resumoPdfUrl?: string; 
    resumoExcelUrl?: string; 
    resumopropostaUrl?: string; 
    resumocontratoUrl?: string; 
}

export interface VisualizarProjeto {
    id: number;
    titulo: string;
    referencia: string;
    contratante: string;
    objeto: string;
    descricao: string;
    nomeCoordenador: string;
    dataInicio: string;
    dataTermino: string;
    valor: number;
    documentos: VisualizarDocumento[];
}

export interface BuscarProjeto {
    referenciaProjeto: string;
    nomeCoordenador: string;
    dataInicio: string;
    dataTermino: string;
    classificacao: string;
    projetoSituacao: string;
    startDate?: Date; 
    endDate?: Date;
    valor?: number;
}
