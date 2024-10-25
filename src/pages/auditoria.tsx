import { useParams } from "react-router-dom";
import AuditoriaComponent from "../component/auditoria/auditoriaComponent";

const Auditoria: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return(
        <div>
            {id ?(
                <AuditoriaComponent projetoId={id}/>
            ) : (
                <AuditoriaComponent/>
            )}

        </div>
    )
}

export default Auditoria