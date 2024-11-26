import { VisualizarDocumento } from "./documento.interface"

export interface prestacaoContas {
    projeto_id: string,
    material_id: string,
    nome: string,
    documento: VisualizarDocumento[],
    tipo_documento: string,
    data: Date,
    tipo_prestacao: string,
    valor: Number
}