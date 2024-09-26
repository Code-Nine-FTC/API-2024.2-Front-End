import { VisualizarDocumento } from "../interface/documento.interface";

const isVisualizarDocumento = (file: File | VisualizarDocumento): file is VisualizarDocumento => {
    return (file as VisualizarDocumento).id !== undefined;
};

export default isVisualizarDocumento;