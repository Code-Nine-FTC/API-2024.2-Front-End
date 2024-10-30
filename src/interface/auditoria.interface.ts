import { VisualizarDocumento } from "./documento.interface"
import { MudancaProjeto } from "./projeto.interface"

export interface Mudanca {
    id: string
    evento: string
    usuario?: string
    data: Date
    projeto: MudancaProjeto
}

export interface AuditorarProjeto {
    id?: number
    titulo?: string
    referencia?: string
    contratante?: string
    objeto?: string
    descricao?: string
    nomeCoordenador?: string
    dataInicio?: Date
    dataTermino?: Date
    valor?: number
    integrantes?: string
    status?: string
    links?: string
    documentos?: VisualizarDocumento[]
}

export interface Auditoria {
    id: number
    projetoId: number
    nomeCoordenador?: string
    tituloAntigo?: string
    referencia: string
    contratanteAntigo?: string
    descricaoAntiga?: string
    valorAntigo?: number
    dataInicioAntiga?: Date
    dataTerminoAntiga?: Date
    statusAntigo?: string
    integrantesAntigos?: string
    objetivoAntigo?: string
    linksAntigos?: string
    tituloNovo?: string
    contratanteNovo?: string
    descricaoNovo?: string
    valorNovo?: number
    dataInicioNovo?: Date
    dataTerminoNovo?: Date
    statusNovo?: string
    integrantesNovo?: string
    objetivoNovo?: string
    linksNovo?: string
    arquivoOriginal1?: Blob
    arquivoOriginal2?: Blob
    dataAlteracao?: Date
}
