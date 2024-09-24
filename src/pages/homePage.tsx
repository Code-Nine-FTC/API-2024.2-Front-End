import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Calendario from "../component/date/calendarioComponent";
import styles from "../component/home/Home.module.css";
import { Button } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import ProcurarProjetoFunction from "../services/buscar/buscarProjetosService";
import logo from "../assets/logo-fapg.svg";
import { FaRegFileLines } from "react-icons/fa6";


const Home = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [referenciaProjeto, setReferenciaProjeto] = useState("");
  const [coordenador, setCoordenador] = useState("");
  const [classificacao, setClassificacao] = useState("");
  const [projetosituacao, setProjetoSituacao] = useState("");
  const [projetos, setProjetos] = useState<any[]>([]);
  const navigate = useNavigate();

  const resultadosRef = useRef<HTMLDivElement>(null);


  const toggleFormVisibility = () => {
    setIsFormVisible((prevState) => !prevState);
  };

  const navegarProjeto = (projeto: { id: number }) => {
    console.log("Navegando para o projeto com ID:", projeto.id); // Adicione esta linha
    navigate(`/projeto/visualizar/${projeto.id}`);
};

  const fetchData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const projeto = {
      referenciaProjeto,
      nomeCoordenador: coordenador,
      dataInicio: startDate ? startDate.toISOString() : "",
      dataTermino: endDate ? endDate.toISOString() : "",
      classificacao,
      projetoSituacao: projetosituacao,
    };

    try {
      const resposta = await ProcurarProjetoFunction(projeto);
      console.log("Resposta recebida:", resposta);

      if (resposta.message) {
        SweetAlert2.fire({
          icon: "error",
          title: resposta.message,
        });
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
      resultadosRef.current.scrollIntoView({ behavior: 'smooth' });
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
              label="Referência do Projeto"
              className="mb-3"
              style={{ width: "50vw", color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Referência do Projeto"
                value={referenciaProjeto}
                onChange={(e) => setReferenciaProjeto(e.target.value)}
              />
            </FloatingLabel>
            <div className={`${styles.filtros} ${isFormVisible ? styles.filtrosVisiveis : ''}`}>
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
                  label="Classificação"
                  className="mb-3"
                  style={{ width: "50vw", color: "#9C9C9C", zIndex: 0 }}
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    value={classificacao}
                    onChange={(e) => setClassificacao(e.target.value)}
                    style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                  >
                    <option disabled selected>
                      Selecionar uma Classificação
                    </option>
                    <option value="">Qualquer</option>
                    <option value="Outros">AS, OF, PC e/ou outros</option>
                    <option value="Contrato">Contrato</option>
                    <option value="Patrocínio">Patrocínio</option>
                    <option value="Termo de Cooperação">
                      Termo de Cooperação
                    </option>
                    <option value="Termo de Outorga">Termo de Outorga</option>
                  </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                  controlId="floatingSelectGrid"
                  label="Situação do Projeto"
                  className="mb-3"
                  style={{ width: "50vw", color: "#9C9C9C", zIndex: 0 }}
                >
                  <Form.Select
                    aria-label="Floating label select example"
                    value={projetosituacao}
                    onChange={(e) => setProjetoSituacao(e.target.value)}
                    style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
                  >
                    <option disabled selected>
                      Selecionar uma Situação
                    </option>
                    <option value="">Todos</option>
                    <option value="Em Aberto">Em Aberto</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                  </Form.Select>
                </FloatingLabel>
              </div>
            <br />
            <Button type="submit" className={styles.botaoSubmit}>
              Procurar
            </Button>
            <br />
            <Button onClick={toggleFormVisibility} className={styles.botaoFiltro}>
              {isFormVisible ? "Fechar Filtros" : "Abrir Filtros"}
            </Button>
            <br />
            {projetos.length > 0 && (
                <div id="resultados" ref={resultadosRef} className={styles.projetobox}>
                  <p className={styles.titulo}>Resultados Encontrados</p>
                {projetos.map((projeto) => {
                    console.log(projeto);
                    return (
                        <div key={projeto.projetoId} className={styles.projeto} onClick={() => navegarProjeto(projeto)}>
                            <FaRegFileLines style={{ fontSize: 34}} />
                            <p>{projeto.titulo}</p>
                            <p>{projeto.dataInicio}</p>
                            <p>{projeto.dataTermino}</p>
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
