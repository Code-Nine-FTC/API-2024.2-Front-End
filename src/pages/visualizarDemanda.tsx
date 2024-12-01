import { useParams } from "react-router";
import VisualizarDemandaComponent from "../component/cadastros/demanda/visualizarDemandaComponent";

export default function VisualizarDemandaPage() {
    const { id } = useParams<{ id: string }>();
    
    return (
        <div>
        {id ? (
          <VisualizarDemandaComponent idDemanda={Number(id)}/>
        ) : (
          <p>ID da demanda não fornecido</p>
        )}
      </div>
    );
}