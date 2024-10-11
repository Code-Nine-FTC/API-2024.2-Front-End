import { VisualizarDocumento } from "./documento.interface";

export interface CadastrarProjetoJson {
    titulo: string;
    referenciaProjeto: string;
    contratante: string;
    objeto: string;
    descricao?: string;
    integrantes?: string;
    links?: string;
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
    integrantes?: string;
    links?: string;
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
    dataInicio: Date;
    dataTermino: Date;
    valor: number;
    integrantes: string;
    links: string;
    documentos: VisualizarDocumento[];
}

export interface BuscarProjeto {
    referenciaProjeto: string;
    nomeCoordenador: string;
    dataInicio: string;
    dataTermino: string;
    startDate?: Date; 
    endDate?: Date;
    valor?: number;
}
