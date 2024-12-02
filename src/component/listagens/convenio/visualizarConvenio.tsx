import { useNavigate } from "react-router";
import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import { ConvenioVisualizacao } from "../../../interface/cadastros/convenio.interface";
import ConvenioVisualizacaoService from "../../../services/convenios/ConvenioVisualizacaoService";
import EditarConvenioService from "../../../services/convenios/editarConvenioService";
import ExcluirConvenio from "../../../services/convenios/excluirConvenioService";
import styles from "./visualizarConvenio.module.css";
import { FileOrVisualizarDocumento, VisualizarDocumento } from "../../../interface/documento.interface";
import BaixarArquivo from "../../../services/projeto/utils/baixarArquivo";
import ValidadorDeArquivos from "../../../functions/validadorDeArquivos";
import separarMensagens from "../../../functions/separarMensagens";
import isVisualizarDocumento from "../../../functions/isVisualizarDocumento";
import ExcluirArquivo from "../../../services/projeto/excluir/excluirArquivo";
import attach from "../../../assets/criarProjeto/attach.svg";
import arquivoIcon from "../../../assets/criarProjeto/arquivo.svg";
import isTipoArquivo from "../../../functions/isTipoArquivo";

interface ConvenioVisualizacaoprops {
    idConvenio: number;
}

interface MensagemValidacao {
  titulo: string;
  texto: string;
}

const VisualizarConvenioComponent: React.FC <ConvenioVisualizacaoprops> = ({idConvenio}) => {
    const [convenioOriginal, setConvenioOriginal] = useState<ConvenioVisualizacao | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [nomeInstituicao, setNomeInstituicao] = useState(convenioOriginal?.nomeInstituicao || '');
    const [dataInicial, setDataInicial] = useState(convenioOriginal?.dataInicial || '');
    const [dataFinal, setDataFinal] = useState(convenioOriginal?.dataFinal || '');
    const [documentos, setDocumentos] = useState<VisualizarDocumento[]>([]);
    const [documentoClausulas, setDocumentoClausulas] = useState<FileOrVisualizarDocumento | null>(null);
    const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({ titulo: "", texto: "" });
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchconvenio = async () => {
            try {
                const response = await ConvenioVisualizacaoService(idConvenio);
                if (response.status === 200) {
                    setConvenioOriginal(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError('Erro ao carregar os dados do convenio');
            } finally {
                setLoading(false);
            }
        }
        fetchconvenio();

    }, [idConvenio]);

    useEffect(() => {
    if (convenioOriginal) {
        setNomeInstituicao(convenioOriginal.nomeInstituicao);
        setDataInicial(convenioOriginal.dataInicial);
        setDataFinal(convenioOriginal.dataFinal);
        setDocumentos(convenioOriginal.documentoClausulas);
        setDocumentoClausulas(documentos[0])
    } 
}, [convenioOriginal]);

useEffect(() => {
  if (mensagemValidacao.titulo && mensagemValidacao.texto) {
    SweetAlert2.fire({
      icon: "error",
      title: mensagemValidacao.titulo,
      text: mensagemValidacao.texto,
    });
  }
}, [mensagemValidacao]);

const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/convenio/visualizar/${id}`);
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const camposEditados = {
        nomeInstituicao: nomeInstituicao,
        dataInicial: dataInicial,
        dataFinal: dataFinal,
        documentoClausulas: documentoClausulas,
    }

    console.log("camposEditados:", camposEditados);

    const dados = {
    nomeInstituicao: camposEditados.nomeInstituicao,
    dataInicial: camposEditados.dataInicial,
    dataFinal: camposEditados.dataFinal,
};
    const formData = new FormData()
    formData.append("convenio", JSON.stringify(dados));
    const arquivoFormatado = isTipoArquivo(documentoClausulas);
    if (arquivoFormatado) {
        formData.append("documentoClausulas", arquivoFormatado);
    }

    try {
        const response = await EditarConvenioService(formData ,idConvenio);
        console.log(response)
        if (response.status === 201) {
          SweetAlert2.fire({
            title: "Sucesso!",
            text: "convenio atualizado com sucesso.",
            icon: "success",
        }).then(() => {
            navigate(`/listagemconvenios`);
            setIsEditing(false);
        });
      }
      else {
        setError(response.message);
      }
    } catch (error) {
        setError('Erro ao atualizar os dados do convenio');
    }
}

const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir o convenio?",
      text: "Essa ação não pode ser desfeita.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sim, excluir",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const exclusaoConvenio = await ExcluirConvenio(id);
          if (exclusaoConvenio.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoConvenio.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir o convenio. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir convenio", error);
          SweetAlert2.fire({
            icon: "error",
            title: "Erro!",
            text: errorMessage,
          });
        }
      }
    });
  };

  const handleEditar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!convenioOriginal) {
    return <Alert variant="warning">convenio não encontrado</Alert>;
  }
  
  const atualizarMensagem = (mensagens: string) => {
    const [tituloErro, ...textoErro] = mensagens.split(". ");
    const text = textoErro.join(". ");
    setMensagemValidacao({ titulo: tituloErro, texto: text });
    return;
  };

  const handleBaixar = async (id: number, nome: string) => {
    try {
      await BaixarArquivo(id, nome);
    } catch (error) {
      console.error("Erro ao baixar o arquivo", error);
      setMensagemValidacao({
        titulo: "Erro ao baixar arquivo",
        texto: "Tente novamente mais tarde.",
      });
    }
  };
  
  const excluirArquivo = async (
    arquivoExcluir: File | VisualizarDocumento,
    setState?: Dispatch<SetStateAction<FileOrVisualizarDocumento | null>>
  ) => {
    if (isVisualizarDocumento(arquivoExcluir)) {
      SweetAlert2.fire({
        title: "Tem certeza que deseja excluir o arquivo?",
        text: "Essa ação não pode ser desfeita.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const resultadoExclusao = await ExcluirArquivo(arquivoExcluir.id);
            if (setState) {
              setState(undefined);
            }
            if (resultadoExclusao.status === 200) {
              SweetAlert2.fire({
                title: "Arquivo excluído com sucesso",
                text:"", 
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok",
                }).then((result) => {
                  if (result.isConfirmed) {
                    window.location.reload();
                  }});
            } else {
              console.error(
                "Erro ao excluir o arquivo",
                resultadoExclusao.data
              );
              setMensagemValidacao({
                titulo: "Erro ao excluir o arquivo",
                texto: "Tente novamente mais tarde.",
              });
            }
          } catch (error) {
            console.error("Erro ao excluir o arquivo", error);
            setMensagemValidacao({
              titulo: "Erro ao excluir o arquivo",
              texto: "Tente novamente mais tarde.",
            });
          }
        }
      });
    } else {
      if (setState) {
        setState(undefined);
      }
    }
  };
  
  const handleArquivo = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState?: Dispatch<SetStateAction<FileOrVisualizarDocumento | null>>
  ) => {
    const arquivo = event.target.files ? event.target.files[0] : null;

    if (!arquivo) {
      return;
    }

    if (setState) {
      if (documentoClausulas) {
        setMensagemValidacao({
          titulo: "Apenas um arquivo pode ser adicionado.",
          texto: "Por favor, remova o arquivo atual para adicionar outro.",
        });
        return;
      }
      const arquivosValidadosDocumento = ValidadorDeArquivos([arquivo]);
      const mensagem = separarMensagens(arquivosValidadosDocumento);
      if (mensagem) {
        atualizarMensagem(mensagem);
        return;
      } else {
        setState(arquivo);
        SweetAlert2.fire({
          icon: "success",
          title: "Arquivo adicionado com sucesso",
        });
        return;
      }
    }
  }

return (
    <>
     <div className={styles.topoPagina}>
        <span
          className="setaVoltar"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          {" "}
          &#x2190;
        </span>
        <h1 className="titulo">{convenioOriginal.nomeInstituicao}</h1>
        {!isEditing && (<div className={styles.editarExcluir}>
            <Button variant="primary" onClick={handleEditar} className="mt-3">
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(idConvenio)}
              className="mt-3"
            >
              Deletar
            </Button>
          </div>
        )}
        </div>
        <br />
      <section className={styles.formMain}>
      <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId="validationCustom01" label="nomeInstituicao" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="nomeInstituicao do convenio"
              required
              value={nomeInstituicao}
              onChange={(e) => setNomeInstituicao(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o nomeInstituicao do convenio.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom02" label="dataInicial" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="date"
              placeholder="Data inicial"
              required
              value={dataInicial}
              onChange={(e) => setDataInicial(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a data inicial do convênio.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom03" label="dataFinal" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="date"
              placeholder="Data final"
              value={dataFinal}
              onChange={(e) => setDataFinal(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a data final do convênio.
            </Form.Control.Feedback>
          </FloatingLabel>

         {!isEditing ? (
          documentos.map((doc) => (
            <Button
              key={doc.id}
              variant="primary"
              size="lg"
              className="mt-3"
              onClick={() => handleBaixar(doc.id, doc.nome)}
            >
              Ver documento de cláusula
            </Button>
          ))
         ) : (
          <div className={styles.adicionarArquivos}>
              <label htmlFor="enviarProposta">
                <span>Documento de clausula</span>
                <img src={attach} alt="Adicionar arquivo" />
              </label>
              <input
                type="file"
                id="enviarProposta"
                accept=".pdf"
                onChange={(e) => handleArquivo(e, setDocumentoClausulas)}
                style={{ display: "none" }}
              />
              {documentoClausulas && (
                <div className={styles.anexosEscolhidos}>
                  <img src={arquivoIcon} alt="Arquivo" />
                  <span className={styles.arquivoSpan}>
                    {isVisualizarDocumento(documentoClausulas)
                      ? documentoClausulas.nome
                      : documentoClausulas.name}
                  </span>
                  <span
                    className={styles.arquivoSpanExcluir}
                    onClick={(e) => excluirArquivo(documentoClausulas, setDocumentoClausulas)}
                  >
                    &#10006;
                  </span>
                </div>
              )}
            </div>
         )}

       {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(idConvenio)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
      </section>
    </>
)

}
export default VisualizarConvenioComponent;