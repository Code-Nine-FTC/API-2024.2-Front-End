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
export interface BuscarProjeto {
        referenciaProjeto: string;
        coordenador: string;
        classificacao: string;
        projetosituacao: string;
        startDate: Date | null;
        endDate: Date | null;
}
