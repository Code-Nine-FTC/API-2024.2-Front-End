import React, { useEffect, useState, SetStateAction, Dispatch  } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MontarFormDataCadastro from "../../services/projeto/montarFormDataProjetoService";
import { Button, Form, Alert, Spinner, FloatingLabel } from "react-bootstrap";
import styles from "./mostraProjeto.module.css";
import { getToken, isAuthenticated } from "../../services/auth";
import Calendario from "../date/calendarioComponent";
import arquivoIcon from "../../assets/criarProjeto/arquivo.svg";
import pdflogo from "../../assets/editarProjeto/pdflogo.svg";
import excellogo from "../../assets/editarProjeto/excellogo.svg"
import attach from "../../assets/criarProjeto/attach.svg";
import { EditarProjeto, VisualizarProjeto } from "../../interface/projeto.interface";
import separarMensagens from "../../functions/separarMensagens";
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import isVisualizarDocumento from "../../functions/isVisualizarDocumento";
import isTipoArquivo from "../../functions/isTipoArquivo";
import BaixarArquivo from "../../services/projeto/baixarArquivo";
import ExcluirArquivo from "../../services/projeto/excluirArquivo";
import SweetAlert2 from "sweetalert2";
import { VisualizarDocumento, FileOrVisualizarDocumento } from "../../interface/documento.interface";
import ExcluirProjeto from "../../services/projeto/excluirProjetoService";
import EditarProjetoService from "../../services/projeto/editarProjetoService";
import VisualizarProjetoService from "../../services/projeto/visualizarProjetoService";
import MontarJsonEditado from "../../services/projeto/montarJsonEditado";
import formatarData from "../../functions/formatarData";

interface MensagemValidacao {
    titulo: string
    texto: string
}

interface VisualizarProjetoProps {
  id: number;
}

const VisualizarProjetoComponent: React.FC<VisualizarProjetoProps> = ({ id }) => {
  const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({titulo: '', texto: ''});
  const [autenticado, setAutenticado] = useState<boolean>(isAuthenticated());
  const [projetoOriginal, setProjeto] = useState<VisualizarProjeto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [titulo, setTitulo] = useState(projetoOriginal?.titulo || "")
  const [referencia, setReferencia] = useState(projetoOriginal?.referencia || "")
  const [contratante, setContratante] = useState(projetoOriginal?.contratante || "")
  const [objeto, setObjeto] = useState(projetoOriginal?.objeto || "")
  const [descricao, setDescricao] = useState(projetoOriginal?.descricao || "")
  const [coordenador, setCoordenador] = useState(projetoOriginal?.nomeCoordenador || "")
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [valor, setValor] = useState(projetoOriginal?.valor || "")
  const [startDateValid, setStartDateValid] = useState<boolean | null>(null);
  const [endDateValid, setEndDateValid] = useState<boolean | null>(null);
  const [resumoPdf, setResumoPdf] = useState<FileOrVisualizarDocumento | null>(null);
  const [resumoExcel, setResumoExcel] = useState<FileOrVisualizarDocumento | null>(null);
  const [proposta, setProposta] = useState<FileOrVisualizarDocumento | null>(null);
  const [contrato, setContrato] = useState<FileOrVisualizarDocumento | null>(null);
  const [documentos, setDocumentos] = useState<VisualizarDocumento[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const respostaProjeto = await VisualizarProjetoService(id);
        if (respostaProjeto.status === 200) {
          setProjeto(respostaProjeto.data);
        }
      } catch (error:any) {
        let errorMessage = error.message || 'Erro ao buscar o projeto. Por favor, tente novamente mais tarde.';
        console.error('Erro ao buscar projeto', error);
        setError(errorMessage);
      }
      finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

  useEffect(() => {
    if (projetoOriginal) {
      setTitulo(projetoOriginal.titulo || "");
      setReferencia(projetoOriginal.referencia || "");
      setContratante(projetoOriginal.contratante || "");
      setObjeto(projetoOriginal.objeto || "");
      setDescricao(projetoOriginal.descricao || "");
      setCoordenador(projetoOriginal.nomeCoordenador || "");
      setStartDate(projetoOriginal.dataInicio ? new Date(projetoOriginal.dataInicio) : null);
      setEndDate(projetoOriginal.dataTermino ? new Date(projetoOriginal.dataTermino) : null);
      setValor(projetoOriginal.valor || "");
      setDocumentos(projetoOriginal.documentos);
      projetoOriginal.documentos.forEach(doc => {
        if (doc.tipo === "resumoPdf" && doc.caminho) {
            setResumoPdf(doc);
        } else if (doc.tipo === "resumoExcel" && doc.caminho) {
            setResumoExcel(doc);
        } else if (doc.tipo === "proposta" && doc.caminho) {
            setProposta(doc);
        } else if (doc.tipo === "contrato" && doc.caminho) {
            setContrato(doc);
        }
    });
    }
  }, [projetoOriginal]);

  useEffect(() => {
    if (mensagemValidacao.titulo && mensagemValidacao.texto) {
        SweetAlert2.fire({
            icon: 'error',
            title: mensagemValidacao.titulo,
            text: mensagemValidacao.texto,
        });
    }
  },[mensagemValidacao]);

  const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/projeto/visualizar/${id}`);
  };

  const validarDatas = () => {
    setStartDateValid(startDate !== null);
    setEndDateValid(endDate !== null && (!startDate || endDate >= startDate));
};

  const dataInicioString = formatarData(startDate);
  const dataTerminoString = formatarData(endDate);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const camposEditados = {
      titulo: titulo,
      referencia: referencia,
      contratante: contratante,
      objeto: objeto,
      descricao: descricao,
      nomeCoordenador: coordenador,
      dataInicio: dataInicioString,
      dataTermino: dataTerminoString,
      valor: parseFloat(valor.toString()),
    };

    console.log("camposEditados:", camposEditados);

    const projetoInicial = MontarJsonEditado(projetoOriginal, camposEditados);
    
    console.log("projetoInicial:", projetoInicial);

    if (Object.keys(projetoInicial).length === 0) {
      console.log("No changes detected");
      return;
    }

    console.log("projetoInicial:", projetoInicial);
    console.log("resumoPdf:", resumoPdf);
    console.log("resumoExcel:", resumoExcel);
    console.log("proposta:", proposta);
    console.log("contrato:", contrato);

      const formData = MontarFormDataCadastro(
        projetoInicial,
        "edicao",
        isTipoArquivo(resumoExcel),
        isTipoArquivo(resumoPdf),
        isTipoArquivo(proposta),
        isTipoArquivo(contrato),

      );
      try {
        console.log(getToken());
        const resposta = await EditarProjetoService(formData, id);

        if (resposta.status === 200) {
          setIsEditing(false);
        } else {
          setError("Erro ao atualizar o projeto");
        }
      } catch (error) {
        setError("Erro ao atualizar o projeto");
      }
    }

  const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: 'Tem certeza que deseja excluir o projeto?',
      text: 'Essa ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
        if (result.isConfirmed) {
        try {
          const exclusaoProjeto = await ExcluirProjeto(id);
          if (exclusaoProjeto.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: 'success',
              title: exclusaoProjeto.data,
          });
          }
        } catch (error: any) {
          let errorMessage = error.message || 'Erro ao excluir o projeto. Por favor, tente novamente mais tarde.';
                  console.error('Erro ao excluir projeto', error);
                  SweetAlert2.fire({
                      icon: 'error',
                      title: 'Erro!',
                      text: errorMessage,
                });
            }
          }
        })
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

  if (!projetoOriginal) {
    return <Alert variant="warning">Projeto não encontrado</Alert>;
  }

  const atualizarMensagem = (mensagens: string) => {
        const [tituloErro, ...textoErro] = mensagens.split('. ');
            const text = textoErro.join('. ');
            setMensagemValidacao({titulo: tituloErro, texto: text});
            return;
    }

  const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>, setState?: Dispatch<SetStateAction<FileOrVisualizarDocumento | null>>) => {
      const arquivo = event.target.files ? event.target.files[0] : null;

      if (!arquivo) {
          return;
      }

      switch (setState) {

          case setProposta:
              if (proposta) {
                  setMensagemValidacao({titulo: 'Apenas um arquivo pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                  return;
              }
              const arquivosValidadosProposta = ValidadorDeArquivos([arquivo]);
              const mensagem = separarMensagens(arquivosValidadosProposta);
              if (mensagem) {
                  atualizarMensagem(mensagem);
                  return;
              } else {
                  setState(arquivo);
                  SweetAlert2.fire({
                      icon: 'success',
                      title: 'Arquivo adicionado com sucesso',
                      })
                  return;
              }

          case setContrato:
              if (contrato) {
                  setMensagemValidacao({titulo: 'Apenas um arquivo pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                  return;
              }
              const arquivosValidadosContrato = ValidadorDeArquivos([arquivo]);
              const mensagemContrato = separarMensagens(arquivosValidadosContrato);
              if (mensagemContrato) {
                  atualizarMensagem(mensagemContrato);
                  return;
              } else {
                  setState(arquivo);
                  SweetAlert2.fire({
                      icon: 'success',
                      title: 'Arquivo adicionado com sucesso',
                      })
                  return;
              }

          default:
              if (resumoPdf && resumoExcel) {
                  setMensagemValidacao({titulo: 'Apenas 2 arquivos podem ser adicionados nessa categoria.', texto: 'Por favor, remova um arquivo para adicionar outro.'});
                  return;
              }
              const arquivosValidados = ValidadorDeArquivos([arquivo]);
              const mensagens = separarMensagens(arquivosValidados);
              if (mensagens) {
                  atualizarMensagem(mensagens);
                  return;
              } else {
                  if (arquivo.type === 'application/pdf') {
                      if (resumoPdf != undefined) {
                          setMensagemValidacao({titulo: 'Apenas um arquivo PDF pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                          return;
                      }
                      else {
                          setResumoPdf(arquivo);
                          SweetAlert2.fire({
                              icon: 'success',
                              title: 'Arquivo adicionado com sucesso',
                              })
                          }
                      }
                  if (arquivo.type === 'application/vnd.ms-excel' || arquivo.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                      if (resumoExcel != undefined) {
                          setMensagemValidacao({titulo: 'Apenas um arquivo Excel pode ser adicionado.', texto: 'Por favor, remova o arquivo atual para adicionar outro.'});
                          return;
                      }
                      else {
                          setResumoExcel(arquivo);
                          SweetAlert2.fire({
                              icon: 'success',
                              title: 'Arquivo adicionado com sucesso',
                              })
                          }
                      }
              }
          } 

          event.target.value = '';

      }

    const handleBaixar = async (id: number, nome: string) => {
      try {
        await BaixarArquivo(id, nome);
      } catch (error) {
        console.error('Erro ao baixar o arquivo', error);
        setMensagemValidacao({titulo: 'Erro ao baixar arquivo', texto: 'Tente novamente mais tarde.'});
      }
    }

    const excluirArquivo = async (arquivoExcluir: File | VisualizarDocumento, setState?: Dispatch<SetStateAction<FileOrVisualizarDocumento | null>>) => {
          if (isVisualizarDocumento(arquivoExcluir)) {
            SweetAlert2.fire({
              title: 'Tem certeza que deseja excluir o arquivo?',
              text: 'Essa ação não pode ser desfeita.',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Sim, excluir',
              cancelButtonText: 'Cancelar',
            }).then(async (result) => {
              if (result.isConfirmed) {
            try {
                const resultadoExclusao = await ExcluirArquivo(arquivoExcluir.id);
                if (arquivoExcluir.tipo === "resumoPdf") {
                    setResumoPdf(undefined);
                }
                if (arquivoExcluir.tipo === "resumoExcel") {
                    setResumoExcel(undefined);
                }
                if (setState) {
                      setState(undefined);
                }
                if (resultadoExclusao.status === 200) {
                    SweetAlert2.fire('Arquivo excluído com sucesso', '', 'success');
                }
                else {
                    console.error('Erro ao excluir o arquivo', resultadoExclusao.data);
                    setMensagemValidacao({titulo: 'Erro ao excluir o arquivo', texto: 'Tente novamente mais tarde.'});
                }
              }
            catch (error) {
                console.error('Erro ao excluir o arquivo', error);
                setMensagemValidacao({titulo: 'Erro ao excluir o arquivo', texto: 'Tente novamente mais tarde.'});
            }
          }})
        } else {
            if (setState) {
              setState(undefined);
            }
            if (arquivoExcluir.type === 'application/pdf') {
                  setResumoPdf(undefined);
              }
            if (arquivoExcluir.type === 'application/vnd.ms-excel' || arquivoExcluir.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                setResumoExcel(undefined);
              }
            }
        }

  return (
    <div className={styles.formMain}>
      <div className={styles.topoPagina}>
            <span className="setaVoltar" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}> &#x2190;</span>
            <h1 className="titulo"> {projetoOriginal.titulo} </h1>
            {autenticado && !isEditing && (
              <div className={styles.editarExcluir}>
                <Button variant="primary" onClick={handleEditar} className="mt-3">
                  Editar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(id)}
                  className="mt-3"
                >
                  Deletar
                </Button>
              </div>
            )}
      </div>

      <Form onSubmit={handleSubmit}>
        <FloatingLabel
                controlId="validationCustom01"
                label="Titulo"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
            <Form.Control 
                type="text" 
                placeholder="Titulo do projeto"
                required
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                readOnly={!isEditing}
              />
        </FloatingLabel>

        <FloatingLabel
                controlId="validationCustom02"
                label="Referencia"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
          <Form.Control
            type="text"
            name="referencia"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            readOnly={!isEditing}
          />
        </FloatingLabel>

        <FloatingLabel
                controlId="validationCustom03"
                label="Contratante"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
                
          <Form.Control
            type="text"
            name="contratante"
            value={contratante}
            onChange={(e) => setContratante(e.target.value)}
            readOnly={!isEditing}
          />
        </FloatingLabel>

        <FloatingLabel
                controlId="validationCustom04"
                label="Objeto"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
          <Form.Control
            type="text"
            name="objeto"
            value={objeto}
            onChange={(e) => setObjeto(e.target.value)}
            readOnly={!isEditing}
          />
          </FloatingLabel>

          <FloatingLabel
                controlId="validationCustom04"
                label="Descrição"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
          <Form.Control
            as="textarea"
            name="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            readOnly={!isEditing}
          />
          </FloatingLabel>

          <FloatingLabel
                controlId="validationCustom04"
                label="Valor"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
          <Form.Control
            type="number"
            name="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            readOnly={!isEditing}
          />
          </FloatingLabel>

          <FloatingLabel
                controlId="validationCustom04"
                label="Coordenador"
                className="mb-3"
                style={{width: '50vw',
                    color: '#9C9C9C',
                    zIndex: 1,
                }}
            >
          <Form.Control
            type="text"
            name="Coordenador"
            value={coordenador}
            onChange={(e) => setCoordenador(e.target.value)}
            readOnly={!isEditing}
          />
          </FloatingLabel>

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

      {isEditing ? (
          <div className={styles.adicionarArquivo}>
            <label htmlFor="enviararquivo">
              <img src={attach} alt="Adicionar arquivo" />
              <span>Adicionar arquivo</span>
            </label>
            <input
              type="file"
              id="enviararquivo"
              accept=".pdf,.xls,.xlsx"
              onChange={(e) => handleArquivo(e)}
              style={{ display: 'none' }}
            />
          {resumoPdf && (
            <div className={styles.arquivosEscolhidos}>
              <img src={arquivoIcon} alt="Arquivo" />
              <span className={styles.arquivoSpan}>
                {isVisualizarDocumento(resumoPdf) ? resumoPdf.nome : resumoPdf.name}
              </span>
              <span
                className={styles.arquivoSpanExcluir}
                onClick={() => excluirArquivo(resumoPdf)}
              >
                &#10006;
              </span>
            </div>
          )}
          {resumoExcel && (
            <div className={styles.arquivosEscolhidos}>
              <img src={arquivoIcon} alt="Arquivo" />
              <span className={styles.arquivoSpan}>
                {isVisualizarDocumento(resumoExcel) ? resumoExcel.nome : resumoExcel.name}
              </span>
              <span
                className={styles.arquivoSpanExcluir}
                onClick={() => excluirArquivo(resumoExcel)}
              >
                &#10006;
              </span>
            </div>
          )}
          <div className={styles.adicionarArquivos}>
              <label htmlFor="enviarProposta">
                  <span>Proposta</span>
                  <img src={attach} alt="Adicionar arquivo" />
              </label>
            <input 
                type="file"
                id="enviarProposta"
                accept=".pdf"
                onChange={(e) => handleArquivo(e, setProposta)}
                style={{display: 'none'}}
            />
            {proposta && (
                <div className={styles.anexosEscolhidos}> 
                    <img src={arquivoIcon} alt="Arquivo" />
                    <span className={styles.arquivoSpan}>
                        {isVisualizarDocumento(proposta) ? proposta.nome : proposta.name}
                    </span>
                    <span className={styles.arquivoSpanExcluir}
                        onClick={(e) => excluirArquivo(proposta, setProposta)}>&#10006;
                    </span>
                </div>
            )}
        </div>
        <div className={styles.adicionarArquivos}>
            <label htmlFor="enviarContrato">
                <span>Contrato</span>
                <img src={attach} alt="Adicionar arquivo" />
            </label>
            <input 
                type="file"
                id="enviarContrato"
                accept=".pdf"
                onChange={(e) => handleArquivo(e, setContrato)}
                style={{display: 'none'}}
            />
            {contrato  && (
                <div className={styles.anexosEscolhidos}> 
                    <img src={arquivoIcon} alt="Arquivo" />
                    <span className={styles.arquivoSpan}>
                        {isVisualizarDocumento(contrato) ? contrato.nome : contrato.name}
                    </span>
                    <span className={styles.arquivoSpanExcluir}
                        onClick={(e) => excluirArquivo(contrato, setContrato)}>&#10006;
                    </span>
                </div>
            )}
        </div>
          </div>
      ) : (
        <>
          <div className={styles.visualizarResumos}>
            {documentos.map(doc => {
                if (doc.tipo === "resumoPdf" && doc.caminho) {
                    return (
                        <Button
                            key={doc.id}
                            variant="danger"
                            className="mt-3"
                            onClick={() => handleBaixar(doc.id, doc.nome)}
                        >
                            <img className={styles.arquivologo} src={pdflogo} alt="PDF Logo" />
                            Ver resumo pdf
                        </Button>
                    );
                } else if (doc.tipo === "resumoExcel" && doc.caminho) {
                    return (
                        <Button
                            key={doc.id}
                            variant="success"
                            className="mt-3"
                            onClick={() => handleBaixar(doc.id, doc.nome)}
                        >
                            <img className={styles.arquivologo} src={excellogo} alt="Excel Logo" />
                            Ver resumo excel
                        </Button>
                    );
                } else {
                    return null;
                }
            })}
          </div>
          <div className={styles.proposta}>
              <h2 className={styles.arquivosTitulo}> Proposta </h2>
              {documentos.filter(doc => doc.tipo === "proposta" && doc.caminho).length > 0 ? (
                  documentos.filter(doc => doc.tipo === "proposta" && doc.caminho).map(doc => (
            <Button
                key={doc.id}
                variant="primary"
                size="lg"
                className="mt-3"
                onClick={() => handleBaixar(doc.id, doc.nome)}
            >
                Ver proposta
            </Button>
        ))
    ) : (
        <p> Não há nenhuma proposta</p>
    )}
          </div>
          <div className={styles.proposta}>
              <h2 className={styles.arquivosTitulo}> Contrato </h2>
              {documentos.filter(doc => doc.tipo === "contrato" && doc.caminho).length > 0 ? (
                documentos.filter(doc => doc.tipo === "contrato" && doc.caminho).map(doc => (
            <Button
                key={doc.id}
                variant="primary"
                size="lg"
                className="mt-3"
                onClick={() => handleBaixar(doc.id, doc.nome)}
            >
                Ver contrato
            </Button>
        ))
    ) : (
        <p> Não há nenhum contrato</p>
    )}
          </div>
        </>
      )}
          
        {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(id)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default VisualizarProjetoComponent;
