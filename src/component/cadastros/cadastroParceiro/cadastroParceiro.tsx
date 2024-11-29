import { Button, FloatingLabel, Form, InputGroup} from "react-bootstrap";
import React, { useState } from "react";
import styles from "../../criarProjeto/criarProjeto.module.css";
import SweetAlert2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CadastrarParceiro from "../../../services/projeto/cadastrar/cadastrarParceiroService";

interface CadastroParceiroProps {
  setShowParceiroModal?: (value: boolean) => void;
}

const CadastroParceiro = (props: CadastroParceiroProps) => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cnpj, setCNPJ] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [areaColaboracao, setAreaColaboracao] = useState("");
  const [camposValidados, setValidado] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
  
    const form = event.currentTarget;
  
    if (form.checkValidity() === false) {
      setValidado(true);
      return;
    }
  
    const parceiro = {
      nome,
      cnpj: cnpj,
      email,
      telefone,
      areaColaboracao,
    };
  
    console.log(parceiro);
  
    try {
      const resposta = await CadastrarParceiro(parceiro);
      console.log(resposta);
      SweetAlert2.fire({
        title: "Parceiro cadastrado com sucesso!",
        icon: "success",
      });
      if (props.setShowParceiroModal) {
        props.setShowParceiroModal(false);
      }
      else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      SweetAlert2.fire({
        title: "Erro ao cadastrar parceiro!",
        text: error instanceof Error ? error.message : "Erro desconhecido",
        icon: "error",
      });
    }
  };

  return (
    <>
      {!props.setShowParceiroModal && (
        <div className="tituloSetaVoltar">
          <span
            className="setaVoltar"
            style={{ cursor: "pointer" }}
            onClick={() => (navigate("/"))}
          >
            {" "}
            &#x2190;
          </span>
          <h1 className="titulo"> Cadastrar parceiros </h1>
        </div>
      )}

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
                placeholder="Nome do Parceiro"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o nome do parceiro.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>
            <InputGroup className="mb-3">
            <FloatingLabel
              label="CNPJ"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="CNPJ"
                value={cnpj}
                onChange={(e) => setCNPJ(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o cpf ou cnpj do bolsista.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">
            <FloatingLabel
              label="Email"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="RG"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o Email do parceiro.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">
            <FloatingLabel
              label="Telefone"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o telefone do parceiro.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3">

            <FloatingLabel
              label="Area de Colaboração"
              controlId="validationCustom03"
              className="flex-grow-1"
              style={{ color: "#9C9C9C", zIndex: 1 }}
            >
              <Form.Control
                type="text"
                placeholder="Area de colaboração"
                value={areaColaboracao}
                onChange={(e) => setAreaColaboracao(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira a area de colabroação do parceiro.
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

export default CadastroParceiro;
