import { FileOrVisualizarDocumento } from '../interface/documento.interface';
import isVisualizarDocumento from './isVisualizarDocumento';

const isTipoArquivo = (file: FileOrVisualizarDocumento | null) => {
    return file && !isVisualizarDocumento(file) ? file : undefined;
};

export default isTipoArquivo;