import React, { useState } from "react";
import { Button, FloatingLabel, Form, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from "sweetalert2";


const CadastroDemandasComponent = () => {
  const navigate = useNavigate();

  const [descricao, setDescricao] = useState("");
  const [statusAtendimento, setStatusAtendimento] = useState("");
  const [tipoDemanda, setTipoDemanda] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [formValidado, setFormValidado] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormValidado(true);
      return;
    }

    const novaDemanda = {
      descricao,
      statusAtendimento,
      tipoDemanda,
      prioridade,
    };

    console.log("Nova Demanda Cadastrada:", novaDemanda);

    try {
      SweetAlert2.fire({
        icon: "success",
        title: "Demanda cadastrada com sucesso!",
      });
      navigate("/"); 
    } catch (error) {
      console.error("Erro ao cadastrar demanda:", error);
      SweetAlert2.fire({
        icon: "error",
        title: "Erro ao cadastrar demanda",
        text: "Por favor, tente novamente mais tarde.",
      });
    }
  };

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
        <h1 className="titulo">Cadastro de Demandas</h1>
      </div>

      <section className={styles.formMain}>
        <Form noValidate validated={formValidado} onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="descricaoDemanda"
              label="Descrição de Demanda"
            >
              <Form.Control
                type="text"
                placeholder="Descrição da demanda"
                required
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira uma descrição.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="statusAtendimento"
              label="Status do Atendimento"
            >
              <Form.Select
                aria-label="Selecione o status"
                value={statusAtendimento}
                onChange={(e) => setStatusAtendimento(e.target.value)}
                required
              >
                <option disabled value="">
                  Selecione o status
                </option>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, selecione o status do atendimento.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel controlId="tipoDemanda" label="Tipo de Demanda">
              <Form.Select
                aria-label="Selecione o tipo de demanda"
                value={tipoDemanda}
                onChange={(e) => setTipoDemanda(e.target.value)}
                required
              >
                <option disabled value="">
                  Selecione o tipo
                </option>
                <option value="Urgente">Urgente</option>
                <option value="Corretiva">Corretiva</option>
                <option value="Evolutiva">Evolutiva</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, selecione o tipo de demanda.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel controlId="prioridade" label="Prioridade de Demanda">
              <Form.Select
                aria-label="Selecione a prioridade"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                required
              >
                <option disabled value="">
                  Selecione a prioridade
                </option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, selecione a prioridade da demanda.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <div className={styles.botaoEnviar}>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default CadastroDemandasComponent;