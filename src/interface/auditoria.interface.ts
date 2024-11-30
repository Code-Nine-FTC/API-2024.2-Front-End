import { VisualizarDemanda } from "./demanda.interface"
import { VisualizarDocumento } from "./documento.interface"
import { VisualizarParceiro } from "./parceiro.interface"
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
    id: number;
    projeto_id: number;
    tipoAuditoria?: string;
    nomeCoordenador?: string;
    titulo_antigo?: string;
    referenciaProjeto: string; 
    parceiro_antigo?: VisualizarParceiro;
    descricao_antiga?: string;
    valor_antigo?: number;
    dataInicio_antiga?: string;
    dataTermino_antiga?: string;
    status_antigo?: string;
    integrantes_antigos?: string;
    objetivo_antigo?: string;
    links_antigos?: string;
    titulo_novo?: string;
    parceiro_novo?: VisualizarParceiro;
    descricao_novo?: string;
    valor_novo?: number;
    dataInicio_novo?: string;
    dataTermino_novo?: string;
    camposOcultos_novo?: string;
    camposOcultos_antigo?: string;
    status_novo?: string;
    integrantes_novo?: string;
    objetivo_novo?: string;
    links_novo?: string;
    documentos_novo: VisualizarDocumento[];
    dataAlteracao?: Date;
    demanda_antiga: VisualizarDemanda;
    demanda_nova: VisualizarDemanda;
}
