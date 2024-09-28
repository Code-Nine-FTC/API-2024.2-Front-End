import { ValidacaoResultado } from "../interface/validacaoResultado.interface"

const separarMensagens = (arquivosValidados: ValidacaoResultado[]): string =>{
    let mensagem = arquivosValidados.filter(resultadoFiltro => !resultadoFiltro.resultado)
            .map(resultadoFiltro => resultadoFiltro.mensagem)
            .join('\n');
    return mensagem;
}

export default separarMensagens;