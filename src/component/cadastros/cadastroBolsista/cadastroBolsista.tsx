import { Button, FloatingLabel, Form, InputGroup} from "react-bootstrap";
import React, { useState } from "react";
import styles from "./criarBolsistas.module.css";
import SweetAlert2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CadastrarBolsista from "../../../services/projeto/cadastrarBolsistaService";

const CadastroBolsista = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cpfoucnpj, setCPFouCNPJ] = useState("");
  const [rg, setRG] = useState("");
  const [tipoBolsa, setTipoBolsa] = useState("");
  const [duracaoBolsa, setDuracaoBolsa] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [referenciaProjeto, setReferenciaProjeto] = useState("");
  const [camposValidados, setValidado] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  
    const form = event.currentTarget;
  
    if (form.checkValidity() === false) {
      setValidado(true);
      return;
    }
  
    const bolsista = {
      nome,
      CPFouCNPJ: cpfoucnpj,
      RG: rg,
      tipoBolsa,
      duracaoBolsa,
      areaAtuacao,
      referenciaProjeto,
    };
  
    console.log(bolsista);
  
    try {
      const resposta = await CadastrarBolsista(bolsista);
      console.log(resposta);
      SweetAlert2.fire({
        title: "Bolsista cadastrado com sucesso!",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      SweetAlert2.fire({
        title: "Erro ao cadastrar bolsista!",
        text: error instanceof Error ? error.message : "Erro desconhecido",
        icon: "error",
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
        <h1 className="titulo"> Cadastrar bolsista </h1>
      </div>

      <section className={styles.formMain}>
        <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
        <InputGroup className="mb-3">
            <FloatingLabel
              controlId="validationCustom01"
              label="Nome"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              
              <Form.Control
                type="text"
                placeholder="Nome do Bolsista"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o nome do bolsista.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
            <FloatingLabel
              label="CPF ou CNPJ"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="CPF ou CNPJ"
                value={cpfoucnpj}
                onChange={(e) => setCPFouCNPJ(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o cpf ou cnpj do bolsista.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">
            <FloatingLabel
              label="RG"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="RG"
                value={rg}
                onChange={(e) => setRG(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o RG do bolsista.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">
            <FloatingLabel
              label="Tipo Bolsa"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="tipo Bolsa"
                value={tipoBolsa}
                onChange={(e) => setTipoBolsa(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o tipo da bolsa.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">
            <FloatingLabel
              label="Duração Bolsa"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Duração Bolsa"
                value={duracaoBolsa}
                onChange={(e) => setDuracaoBolsa(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira a duração da bolsa.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">

            <FloatingLabel
              label="Area de Atuação"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Area de atuação"
                value={areaAtuacao}
                onChange={(e) => setAreaAtuacao(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira a area de atuação.
              </Form.Control.Feedback>
            </FloatingLabel>
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
            </InputGroup>
          <div className={styles.botaoEnviar}>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default CadastroBolsista;
