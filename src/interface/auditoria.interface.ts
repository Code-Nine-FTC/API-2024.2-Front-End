import { VisualizarDocumento } from "./documento.interface";
import { MudancaProjeto } from "./projeto.interface";

export interface Mudanca{
    id: string,
    evento: string,
    usuario?: string
    data: Date,
    projeto: MudancaProjeto
}

export interface AuditorarProjeto {
    id?: number;
    titulo?: string;
    referencia?: string;
    contratante?: string;
    objeto?: string;
    descricao?: string;
    nomeCoordenador?: string;
    dataInicio?: Date;
    dataTermino?: Date;
    valor?: number;
    integrantes?: string;
    status?: string;
    links?: string;
    documentos?: VisualizarDocumento[];
}