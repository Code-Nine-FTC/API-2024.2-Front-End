// src/interfaces/convenio.interface.ts
export interface ConvenioCadastro {
    nomeInstituicao: string;
    dataInicial: string;
    dataFinal: string;
    documentoClausulas: string;
}

export interface ConvenioVisualizacao {
    id?: string;
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    areaColaboracao: string;
    historicoParceria?: string; // Opcional
}