interface ValidacaoResultado {
    resultado: boolean;
    mensagem?: string;
    arquivos?: File[];
}

const ValidadorDeArquivos = (arquivos: File[]): ValidacaoResultado[] => {
    const tiposValidos = ['application/pdf', 'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const tamanhoMaximo = 5 * 1024 * 1024;

    const arquivosValidos = arquivos.map(arquivo => {
        if (!tiposValidos.includes(arquivo.type)) {
            return {resultado: false, mensagem: `Tipo de arquivo inválido: ${arquivo.name}. \n
                Escolha arquivos PDF ou Excel!`};
        }
        if (arquivo.size > tamanhoMaximo) {
            return {resultado: false, mensagem: `Arquivo muito grande: ${arquivo.name}. \n
                Escolha arquivos de até 5mb!`};
        }
        return {resultado: true, arquivos: [arquivo]};
    });

    return arquivosValidos;
}

export default ValidadorDeArquivos;