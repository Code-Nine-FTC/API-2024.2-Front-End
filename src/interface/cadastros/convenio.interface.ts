// src/interfaces/convenio.interface.ts
export interface ConvenioCadastro {
    nomeInstituicao: string;
    dataInicial: string;
    dataFinal: string;
    documentoClausulas: string;
}

export interface ConvenioVisualizacao {
    id?: string;
    nomeInstituicao: string;
    dataInicial: string;
    dataFinal: string;
    documentoClausulas: string;
}