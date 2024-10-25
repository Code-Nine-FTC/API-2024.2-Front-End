import { useParams } from "react-router";
import AuditoriaComponent from "../component/auditoria/auditoriaComponent";

const AuditoriaPorId = () => {
    const { id } = useParams<{ id: string }>(); // Captura o ID da URL

    return(
        <div>
            <AuditoriaComponent projetoId={id}/>
        </div>
    )
}

export default AuditoriaPorId