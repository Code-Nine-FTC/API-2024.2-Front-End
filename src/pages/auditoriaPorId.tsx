import { useParams } from "react-router-dom";
import AuditoriaComponent from "../component/auditoria/auditoriaComponent";

const AuditoriaPorId: React.FC = () => {
    const { id } = useParams<{ id: string }>()

    return(
        <div>
            <AuditoriaComponent projetoId={id}/>
        </div>
    )
}

export default AuditoriaPorId