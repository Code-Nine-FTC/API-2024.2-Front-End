export interface VisualizarDocumento {
    id: number;
    nome: string;
    caminho: string;
    tipo: string;
    tamanho: number;
}

export type FileOrVisualizarDocumento = File | VisualizarDocumento | undefined;
