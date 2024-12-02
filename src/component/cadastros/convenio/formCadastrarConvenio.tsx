import { Button, FloatingLabel, Form, InputGroup, Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import SweetAlert2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import styles from "../../criarProjeto/criarProjeto.module.css";
import CadastrarConvenioService from "../../../services/convenios/cadastrarConvenioService";
import ValidadorDeArquivos from "../../../functions/validadorDeArquivos";
import separarMensagens from "../../../functions/separarMensagens";
import attach from '../../../assets/criarProjeto/attach.svg';
import arquivoIcon from '../../../assets/criarProjeto/arquivo.svg';

interface CadastrarConvenioProps {
  setShowConvenioModal?: (value: boolean) => void;
}

interface MensagemValidacao {
  titulo: string;
  texto: string;
}

const CadastroConvenio = (props: CadastrarConvenioProps) => {
  const navigate = useNavigate();

  const [nomeInstituicao, setNomeInstituicao] = useState("");
  const [dataInicial, setDataInicial] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [documentoClausulas, setDocumentoClaususulas] = useState<File | null>(null);
  const [formValidado, setFormValidado] = useState(false);
  const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({ titulo: "", texto: "" });

  useEffect(() => {
    if (mensagemValidacao.titulo && mensagemValidacao.texto) {
      SweetAlert2.fire({
        icon: "error",
        title: mensagemValidacao.titulo,
        text: mensagemValidacao.texto,
      });
    }
  }, [mensagemValidacao]);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setFormValidado(true);
      return;
    }

    const novoConvenio = {
      nomeInstituicao: nomeInstituicao,
      dataInicial: dataInicial,
      dataFinal: dataFinal,
/*       projetoId: projetoId */
    };

    const formData = new FormData();
    formData.append("convenio", JSON.stringify(novoConvenio));
    if (documentoClausulas) {
      formData.append("documentoClausulas", documentoClausulas);
    }

    console.log("Novo Convênio Cadastrado:", novoConvenio);

    try {
      const resultado = await CadastrarConvenioService(formData);
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

  const atualizarMensagem = (mensagens: string) => {
    const [tituloErro, ...textoErro] = mensagens.split(". ");
    const text = textoErro.join(". ");
    setMensagemValidacao({ titulo: tituloErro, texto: text });
    return;
  };

  const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (documentoClausulas) {
        setMensagemValidacao({
            titulo: "Apenas um arquivo pode ser adicionado.",
            texto: "Por favor, remova o arquivo atual para adicionar outro.",
          });
          return;
    }
    const arquivo = event.target.files ? event.target.files[0] : null;
    if (!arquivo) {
        return;
    }
    const arquivoValidado = ValidadorDeArquivos([arquivo]);
    const mensagem = separarMensagens(arquivoValidado);
    if (mensagem) {
        atualizarMensagem(mensagem);
        return;
      } else {
        setDocumentoClaususulas(arquivo);
        SweetAlert2.fire({
          icon: "success",
          title: "Arquivo adicionado com sucesso",
        });
        return;
      }
}

const excluirArquivo = (notaFiscal: File | null) => {
    if (!notaFiscal) {
        return;
    }
    setDocumentoClaususulas(null);
}

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
                type="date"
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
                type="date"
                placeholder="Data final"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira uma data válida.
              </Form.Control.Feedback>
            </FloatingLabel>
          </InputGroup>

          <div className={styles.adicionarArquivo}>
                    <label htmlFor="enviararquivo">
                    <img src={attach} alt="Adicionar arquivo" />
                    <span>Adicionar documento de clausulas</span>
                    </label>
                    <input
                    type="file"
                    id="enviararquivo"
                    accept=".pdf,.xls,.xlsx"
                    onChange={(e) => handleArquivo(e)}
                    style={{ display: "none" }}
                    />
                </div>
                {documentoClausulas && (
              <div className={styles.arquivosEscolhidos}>
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                    {documentoClausulas.name}
                </span>
                <span
                  className={styles.arquivoSpanExcluir}
                  onClick={() => excluirArquivo(documentoClausulas)}
                >
                  &#10006;
                </span>
              </div>
            )}

          <div className={styles.botaoEnviar}>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default CadastroConvenio;