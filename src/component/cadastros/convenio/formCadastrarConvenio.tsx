import { Button, FloatingLabel, Form, InputGroup, Modal } from "react-bootstrap";
import React, { useState } from "react";
import SweetAlert2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "../../criarProjeto/criarProjeto.module.css";
import CadastrarConvenioService from "../../../services/convenios/cadastrarConvenioService";

interface CadastrarConvenioProps {
  setShowConvenioModal?: (value: boolean) => void;
}

const CadastrarConvenio = (props: CadastrarConvenioProps) => {
  const navigate = useNavigate();

  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [documentoClausulas, setDocumentoClausulas] = useState("");
  const [formValidado, setFormValidado] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormValidado(true);
      return;
    }

    const novoConvenio = {
      nomeInstituicao,
      dataInicial,
      dataFinal,
      documentoClausulas,
    };

    console.log("Novo Convênio Cadastrado:", novoConvenio);

    try {
      const resultado = await CadastrarConvenioService(novoConvenio);
      console.log(resultado);
      if (resultado.status === 201) {
        SweetAlert2.fire({
          icon: "success",
          title: "Convênio cadastrado com sucesso!",
        });
        if (props.setShowConvenioModal) {
          props.setShowConvenioModal(false);
        } else {
          navigate("/");
        }
      }
    } catch (error: any) {
      let errorMessage =
        error.message ||
        "Erro ao cadastrar convênio. Por favor, tente novamente mais tarde.";
      console.error("Erro ao cadastrar convênio", error);
      SweetAlert2.fire({
        icon: "error",
        title: "Erro ao cadastrar convênio",
        text: errorMessage,
      });
    }
  };

  return (
    <>
      {!props.setShowConvenioModal && (
        <div className="tituloSetaVoltar">
          <span
            className="setaVoltar"
            style={{ cursor: "pointer" }}
            onClick={() => (navigate("/"))}
          >
            {" "}
            &#x2190;
          </span>
          <h1 className="titulo"> Cadastrar convênio </h1>
        </div>
      )}
      <section className={styles.formMain}>
        <Form noValidate validated={formValidado} onSubmit={handleSubmit} style={{width: '60%'}}>
          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="nomeInstituicao"
              label="Nome do Convênio"
            >
              <Form.Control
                type="text"
                placeholder="Nome do convênio"
                required
                value={nomeInstituicao}
                onChange={(e) => setNomeInstituicao(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira um nome.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="dataInicial"
              label="Data Inicial"
            >
              <Form.Control
                type="text"
                placeholder="Data inicial"
                required
                value={dataInicial}
                onChange={(e) => setDataInicial(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira uma data válida.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="dataFinal"
              label="Data Final"
            >
              <Form.Control
                type="text"
                placeholder="Data final"
                required
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira uma data válida.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <InputGroup className="mb-3">
            <FloatingLabel
              controlId="documentoClausulas"
              label="Documento de Cláusulas"
            >
              <Form.Control
                type="text"
                placeholder="Documento de cláusulas"
                required
                value={documentoClausulas}
                onChange={(e) => setDocumentoClausulas(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira um documento válido.
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

export default CadastrarConvenio;