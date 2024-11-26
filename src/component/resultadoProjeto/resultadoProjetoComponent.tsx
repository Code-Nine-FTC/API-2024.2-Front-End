import { useNavigate } from "react-router";
import { FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import PieChart from "./graficos/PieChart";
import BarChart from "./graficos/BarChart";
import LineChart from "./graficos/LineChart";
import { pieData, barData, barOptions, lineData, lineOptions } from "./utils/chartData";
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
                    &#x2190;
                </span>
                <h1 className="titulo"> Titulo Projeto </h1>
                <div className={styles.icones}>
                    <FaTrash 
                        style={{ cursor: "pointer", marginRight: "10px" }} 
                        onClick={() => navigate("/apagar")}
                    />
                    <FaEdit 
                        style={{ cursor: "pointer" }} 
                        onClick={() => navigate("/editar")}
                    />
                </div>
            </div>
            <Form>
                <InputGroup className="mb-3">
                    <FloatingLabel
                        label="Análise do Projeto"
                        controlId="validationCustom01"
                        className="flex-grow-1"
                        style={{ color: "#9C9C9C", zIndex: 1, width: "80%" }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Análise do Projeto"
                        />
                    </FloatingLabel>
                </InputGroup>
                <InputGroup className="mb-3">
                    <FloatingLabel
                        label="Depoimento"
                        controlId="validationCustom02"
                        className="flex-grow-1"
                        style={{ color: "#9C9C9C", zIndex: 1, width: "80%" }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Depoimento"
                        />
                    </FloatingLabel>
                </InputGroup>
            </Form>
            <div className={styles.graficos}>
                <div className={styles.grafico}>
                    <PieChart data={pieData} />
                </div>
                <div className={styles.grafico}>
                    <BarChart data={barData} options={barOptions} />
                </div>
            </div>
            <div className={styles.graficoLinha}>
                <LineChart data={lineData} options={lineOptions} />
            </div>
        </div>
    );
}