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
    coordenador: string;
    dataInicio: string;
    valor?: number;
    dataTermino?: string;
    contratante?: string;
}

export interface EditarProjeto {
    id: string;
    titulo?: string;
    referenciaProjeto?: string;
    empresa?: string;
    objeto?: string;
    descricao?: string;
    coordenador?: string;
    valor?: number;
    dataInicio?: string;
    dataTermino?: string;
    resumoExcel?: File;
    resumoPdf?: File;
    proposta?: File;
    contrato?: File;
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
