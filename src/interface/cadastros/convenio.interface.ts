// src/interfaces/convenio.interface.ts
export interface ConvenioCadastro {
    nome: string;
    cnpj: string;
    email: string;
    telefone: string;
    areaColaboracao: string;
    historicoParceria?: string; // Opcional
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