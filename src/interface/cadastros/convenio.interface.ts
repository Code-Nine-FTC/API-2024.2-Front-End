import { FileOrVisualizarDocumento, VisualizarDocumento } from "../documento.interface";

// src/interfaces/convenio.interface.ts
export interface ConvenioCadastro {
    convenio: string;
    documentoClausulas: File | null;
}

export interface ConvenioCadastro2 {
    nome_instituicao: string;
    data_inicial: string;
    data_final: string;
    documento_clausulas: string;
    projeto_id: string;
}

export interface ConvenioVisualizacao {
    id?: string;
    nomeInstituicao: string;
    dataInicial: string;
    dataFinal: string;
    documentoClausulas: VisualizarDocumento[];
}