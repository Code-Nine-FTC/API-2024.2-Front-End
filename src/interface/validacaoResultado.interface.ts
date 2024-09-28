export interface ValidacaoResultado {
    resultado: boolean;
    mensagem?: string;
    arquivos?: File[];
    tipo?: string;
}
