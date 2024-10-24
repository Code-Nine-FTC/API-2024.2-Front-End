import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Calendario from "../date/calendarioComponent";
import styles from "./Home.module.css";
import { Button } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import ProcurarProjetoFunction from "../../services/buscar/buscarProjetosService";
import logo from "../../assets/logo-fapg.svg";
import { FaRegFileLines } from "react-icons/fa6";
import { parseISO, format, parse } from "date-fns";

const Home = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [referenciaProjeto, setReferenciaProjeto] = useState("");
  const [coordenador, setCoordenador] = useState("");
  const [status, setStatus] = useState("");
  const [projetos, setProjetos] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(false);

  const resultadosRef = useRef<HTMLDivElement>(null);

  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const navegarProjeto = (projeto: { id: number }) => {
    console.log("Navegando para o projeto com ID:", projeto.id);
    navigate(`/projeto/visualizar/${projeto.id}`);
  };

  const fetchData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const projeto = {
      referenciaProjeto,
      nomeCoordenador: coordenador,
      dataInicio: startDate ? format(startDate, "yyyy-MM-dd") : "",
      dataTermino: endDate ? format(endDate, "yyyy-MM-dd") : "",
      status,
    };

    // Dentro da função fetchData
    setIsFetching(true); // Inicia o estado de "buscando"
    try {
      const resposta = await ProcurarProjetoFunction(projeto);
      console.log("Resposta do servidor:", resposta);
      // Lida com a resposta...
    } catch (error) {
      console.error("Erro ao buscar o projeto", error);
    } finally {
      setIsFetching(false); // Finaliza o estado de "buscando"
    }

    try {
      const resposta = await ProcurarProjetoFunction(projeto);
      console.log("Resposta recebida:", resposta);

      if (resposta.message) {
        SweetAlert2.fire({
          icon: "error",
          title: resposta.message,
        });
        setProjetos([]);
      } else {
        setProjetos(resposta);
      }
    } catch (error) {
      console.error("Erro ao encontrar projeto", error);
      SweetAlert2.fire({
        icon: "error",
        title: "Erro ao encontrar projeto!",
      });
    }
  };

  useEffect(() => {
    if (projetos.length > 0 && resultadosRef.current) {
      resultadosRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [projetos]);

  return (
    <body>
      <main className={styles.main}>
        <Form onSubmit={fetchData} className={styles.form}>
          <img src={logo} alt="Logo FAPG" className={styles.logo} />
          <br />
          <FloatingLabel
            controlId="floatingInput"
            label="Referência"
            className="mb-3"
            style={{ width: "50vw", color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              type="text"
              placeholder="Referência"
              value={referenciaProjeto}
              onChange={(e) => setReferenciaProjeto(e.target.value)}
              style={{fontSize: "1rem"}}
            />
          </FloatingLabel>
          <div
            className={`${styles.filtros} ${
              isFormVisible ? styles.filtrosVisiveis : ""
            }`}
          >
            <FloatingLabel
              label="Coordenador"
              controlId="floatingInput"
              className="mb-3"
              style={{ width: "50vw", color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Coordenador"
                value={coordenador}
                onChange={(e) => setCoordenador(e.target.value)}
              />
            </FloatingLabel>
            <Calendario
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              startDateValid={true}
              endDateValid={true}
              validarDatas={() => {}}
              cadastro={false}
            />
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="Situação do Projeto"
              className="mb-3"
              style={{ width: "50vw", color: "#9C9C9C", zIndex: 0 }}
            >
              <Form.Select
                aria-label="Floating label select example"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
              >
                <option disabled value="">
                  Selecionar uma Situação
                </option>
                <option value="">Todos</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </Form.Select>
            </FloatingLabel>
          </div>
          <br />
          <div className="container d-flex flex-column align-items-center">
        <div className="mb-3 w-100 d-flex justify-content-center">
          
          <Button
            type="submit"
            className={`btn btn-primary ${styles.botaoSubmit}`}
            style={{ width: "20vw",  whiteSpace: "normal", wordBreak: "break-word" }}
          >
            Procurar
          </Button>
        </div>

        <div className="w-100 d-flex justify-content-center">
         
          <Button
            onClick={toggleFormVisibility}
            className={`btn btn-primary ${styles.botaoFiltro}`}
            disabled={isFetching}
            style={{ width: "20vw",  whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {isFormVisible ? "Fechar Filtros" : "Abrir Filtros"}
          </Button>
        </div>
      </div>
      <br />
          {projetos.length > 0 && (
            <div
              id="resultados"
              ref={resultadosRef}
              className={styles.projetobox}
            >
              <p className={styles.titulo}>Resultados Encontrados</p>
              {projetos.map((projeto) => {
                console.log(projeto);

                const dataInicio = projeto.dataInicio
                  ? format(
                      parse(projeto.dataInicio, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )
                  : "Data não disponível";
                const dataTermino = projeto.dataTermino
                  ? format(
                      parse(projeto.dataTermino, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )
                  : "Data não disponível";

                return (
                  <div
                    key={projeto.projetoId}
                    className={styles.projeto}
                    onClick={() => navegarProjeto(projeto)}
                  >
                    <FaRegFileLines style={{ fontSize: 34 }} />
                    <p>{projeto.titulo}</p>
                    <p>{dataInicio}</p>
                    <p>{dataTermino}</p>
                    <p>{projeto.valor}</p>
                  </div>
                );
              })}
            </div>
          )}
        </Form>
      </main>
    </body>
  );
};
export default Home;
