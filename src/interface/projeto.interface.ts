export interface CadastrarProjeto {
    titulo: string;
    referenciaProjeto: string;
    empresa: string;
    objeto: string;
    descricao?: string;
    coordenador: string;
    valor: number;
    dataInicio: string;
    dataFim: string;
    resumoPdf?: File;
    resumoExcel?: File;
}

export{}