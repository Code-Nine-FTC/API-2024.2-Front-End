import { VisualizarMaterial } from "./material.interface"

export interface GastoCadastro {
    documento: string
    tipoDocumento: string
    fornecedor: string
    dataGasto: Date
    valor: number
    material: VisualizarMaterial
}

export interface FormDataGastoCadastro {
    gasto: GastoCadastro
    idProjeto: string
    notaFiscal?: File
}
