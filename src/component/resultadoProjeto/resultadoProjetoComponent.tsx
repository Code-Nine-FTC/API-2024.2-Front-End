import { useNavigate } from "react-router";
import styles from "./resultadoprojeto.module.css";

export default function ResultadoProjeto() {
    const navigate = useNavigate();

    return (
        <div>
            <div className={styles.topoPagina}>
            <span
            className="setaVoltar"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
            >
            {" "}
            &#x2190;
            </span>
            <h1 className="titulo"> Titulo Projeto </h1>
        </div>
        
    </div>
    );
}