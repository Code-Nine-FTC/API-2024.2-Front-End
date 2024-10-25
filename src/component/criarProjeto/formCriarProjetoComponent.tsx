import {
  Button,
  FloatingLabel,
  Form,
  InputGroup,
} from "react-bootstrap";
import React, { useState, useEffect } from "react";
import styles from "./criarProjeto.module.css";
import SweetAlert2 from "sweetalert2";
import CadastrarProjetoFunction from "../../services/projeto/cadastarProjetoService";
import Calendario from "../date/calendarioComponent";
import { useNavigate } from "react-router-dom";

interface MensagemValidacao {
  titulo: string;
  texto: string;
}

const CriarProjetoComponent = () => {
  const navigate = useNavigate();

  const [mensagemValidacao] = useState<MensagemValidacao>(
    { titulo: "", texto: "" }
  );
  const [camposValidados, setValidado] = useState(false);
  const [tituloProjeto, setTituloProjeto] = useState("");
  const [referenciaProjeto, setReferenciaProjeto] = useState("");
  const [contratante, setContratante] = useState("");
  const [nomeCoordenador, setCoordenador] = useState("");
  const [valor, setValor] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [status, setSatus] = useState("");
  const [startDateValid, setStartDateValid] = useState<boolean | null>(null);
  const [endDateValid, setEndDateValid] = useState<boolean | null>(null);

  const [hideTitulo, setHideTitulo] = useState(false);
  const [hideReferencia, setHideReferencia] = useState(false);
  const [hideContratante, setHideContratante] = useState(false);
  const [hideCoordenador, setHideCoordenador] = useState(false);
  const [hideValor, setHideValor] = useState(false);
  const [hideStatus, setHideStatus] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidado(true);
      return;
    }

    const valorFloat = parseFloat(valor);
    setValidado(true);

    const dataInicioString = startDate?.toISOString();
    const dataTerminoString = endDate?.toISOString();

    const camposOcultos = [];
    if (hideTitulo) camposOcultos.push("titulo");
    if (hideReferencia) camposOcultos.push("referencia");
    if (hideContratante) camposOcultos.push("contratante");
    if (hideCoordenador) camposOcultos.push("coordenador");
    if (hideValor) camposOcultos.push("valor");
    if (hideStatus) camposOcultos.push("status");

    const camposOcultosString = camposOcultos.join(", ");

    const projeto = {
      titulo: tituloProjeto,
      referencia: referenciaProjeto,
      nomeCoordenador: nomeCoordenador,
      dataInicio: dataInicioString || "",
      valor: valorFloat,
      status: status,
      dataTermino: dataTerminoString || "",
      contratante: contratante,
      camposOcultos: camposOcultosString,
    };

    console.log(projeto);
    console.log(camposOcultos);

    try {
      const resposta = await CadastrarProjetoFunction(projeto);
      if (resposta.status === 201) {
        console.log("Projeto cadastrado com sucesso");
        navigate(`/`);
        SweetAlert2.fire({
          icon: "success",
          title: resposta.data,
        });
      }
    } catch (error: any) {
      let errorMessage =
        error.message ||
        "Erro ao cadastrar o projeto. Por favor, tente novamente mais tarde.";
      console.error("Erro ao cadastrar projeto", error);
      SweetAlert2.fire({
        icon: "error",
        title: "Erro!",
        text: errorMessage,
      });
    }
  };

  const validarDatas = () => {
    setStartDateValid(startDate !== null);
    setEndDateValid(endDate !== null && (!startDate || endDate >= startDate));
  };

  useEffect(() => {
    if (mensagemValidacao.titulo && mensagemValidacao.texto) {
      SweetAlert2.fire({
        icon: "error",
        title: mensagemValidacao.titulo,
        text: mensagemValidacao.texto,
      });
    }
  }, [mensagemValidacao]);

  return (
    <>
      <div className="tituloSetaVoltar">
        <span
          className="setaVoltar"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {" "}
          &#x2190;
        </span>
        <h1 className="titulo"> Adicionar projeto </h1>
      </div>

      <section className={styles.formMain}>
        <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
          <InputGroup>
            <Form.Text
              className="flex-grow-1"
              style={{
                color: "#9C9C9C",
                zIndex: 1,
                paddingBottom: "10px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Caso o checkbox ao lado seja marcado, os campos serão ocultos para
              os usuarios comuns.
            </Form.Text>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="validationCustom01"
              label="Titulo"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Titulo do projetor"
                required
                value={tituloProjeto}
                onChange={(e) => setTituloProjeto(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o título do projeto.
              </Form.Control.Feedback>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideTitulo}
              onChange={(e) => setHideTitulo(e.target.checked)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <FloatingLabel
              label="Referência de projeto"
              controlId="validationCustom02"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Referência de projeto"
                required
                value={referenciaProjeto}
                onChange={(e) => setReferenciaProjeto(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira a referência de projeto.
              </Form.Control.Feedback>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideReferencia}
              onChange={(e) => setHideReferencia(e.target.checked)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              label="Contratante"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Contratante"
                value={contratante}
                onChange={(e) => setContratante(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o contratante.
              </Form.Control.Feedback>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideContratante}
              onChange={(e) => setHideContratante(e.target.checked)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              label="Coordenador"
              controlId="validationCustom06"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Coordenador"
                value={nomeCoordenador}
                required
                onChange={(e) => setCoordenador(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o coordenador.
              </Form.Control.Feedback>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideCoordenador}
              onChange={(e) => setHideCoordenador(e.target.checked)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="floatingSelectGrid"
              label="Situação do Projeto"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 0 }}
            >
              <Form.Select
                aria-label="Floating label select example"
                value={status}
                onChange={(e) => setSatus(e.target.value)}
                style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
              >
                <option disabled selected>
                  Selecionar uma Situação
                </option>
                <option value="Pendente">Pendente</option>
                <option value="Concluído">Concluído</option>
                <option value="Em Andamento">Em Andamento</option>
              </Form.Select>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideStatus}
              onChange={(e) => setHideStatus(e.target.checked)}
            />
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              label="Valor do projeto"
              controlId="validationCustom07"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Valor do projeto"
                value={valor}
                min="0"
                onChange={(e) => setValor(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o valor do projeto.
              </Form.Control.Feedback>
            </FloatingLabel>
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideValor}
              onChange={(e) => setHideValor(e.target.checked)}
            />
          </InputGroup>
          <Calendario
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            startDateValid={startDateValid}
            endDateValid={endDateValid}
            validarDatas={validarDatas}
            cadastro={true}
          />
          <div className={styles.botaoEnviar}>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default CriarProjetoComponent;
