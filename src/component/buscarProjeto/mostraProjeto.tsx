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
import { EditarProjeto } from "../../interface/projeto.interface";
import separarMensagens from "../../functions/separarMensagens";
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import SweetAlert2 from "sweetalert2";

interface MensagemValidacao {
    titulo: string
    texto: string
}

interface EditaExcluiMostraProps {
  id: number;
}

const Mostra: React.FC<EditaExcluiMostraProps> = ({ id }) => {
  const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>({titulo: '', texto: ''});
  const [autenticado, setAutenticado] = useState<boolean>(isAuthenticated());
  const [projeto, setProjeto] = useState<EditarProjeto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [titulo, setTitulo] = useState(projeto?.titulo || "")
  const [referencia, setReferencia] = useState(projeto?.referencia || "")
  const [contratante, setContratante] = useState(projeto?.contratante || "")
  const [objeto, setObjeto] = useState(projeto?.objeto || "")
  const [descricao, setDescricao] = useState(projeto?.descricao || "")
  const [coordenador, setCoordenador] = useState(projeto?.coordenador || "")
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [valor, setValor] = useState(projeto?.valor || "")
  const [startDateValid, setStartDateValid] = useState<boolean | null>(null);
  const [endDateValid, setEndDateValid] = useState<boolean | null>(null);
  const [resumoPdf, setResumoPdf] = useState<File | undefined>(undefined);
  const [resumoExcel, setResumoExcel] = useState<File | undefined>(undefined);
  const [proposta, setProposta] = useState<File | undefined>(undefined);
  const [contrato, setContrato] = useState<File | undefined>(undefined);
  const [resumoPdfUrl, setResumoPdfUrl] = useState(projeto?.resumoPdfUrl || "") 
  const [resumoExcelUrl, setResumoExcelUrl] = useState(projeto?.resumoExcelUrl || "")
  const [propostaUrl, setPropostaUrl] = useState(projeto?.resumopropostaUrl)
  const [contratoUrl, setContratoUrl] = useState(projeto?.resumocontratoUrl)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await api.get(`/projeto/visualizar/${id}`);
        setProjeto(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Erro ao carregar os dados do projeto", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

  useEffect(() => {
    if (projeto) {
      setTitulo(projeto.titulo || "");
      setReferencia(projeto.referencia || "");
      setContratante(projeto.contratante || "");
      setObjeto(projeto.objeto || "");
      setDescricao(projeto.descricao || "");
      setCoordenador(projeto.coordenador || "");
      setStartDate(projeto.dataInicio ? new Date(projeto.dataInicio) : null);
      setEndDate(projeto.dataTermino ? new Date(projeto.dataTermino) : null);
      setValor(projeto.valor || "");
      setResumoPdfUrl(projeto.resumoPdfUrl || "");
      setResumoExcelUrl(projeto.resumoExcelUrl || "");
      setPropostaUrl(projeto.resumopropostaUrl || "");
      setContratoUrl(projeto.resumocontratoUrl || "");
    }
  }, [projeto]);

  useEffect(() => {
    if (mensagemValidacao.titulo && mensagemValidacao.texto) {
        SweetAlert2.fire({
            icon: 'error',
            title: mensagemValidacao.titulo,
            text: mensagemValidacao.texto,
        });
    }
  },[mensagemValidacao]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setProjeto((prevProjeto) =>
  //     prevProjeto ? { ...prevProjeto, [name]: value } : undefined
  //   );
  // };

  const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/projeto/visualizar/${id}`);
  };

  const validarDatas = () => {
    setStartDateValid(startDate !== null);
    setEndDateValid(endDate !== null && (!startDate || endDate >= startDate));
};

  const dataInicioString = startDate?.toISOString();
  const dataTerminoString = endDate?.toISOString();

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   if (projeto) {
  //     const projetoEditado = {
  //       ...projeto,
  //       id: projeto.id.toString(),
  //     };

  //     const formData = MontarFormDataCadastro(
  //       projeto,
  //       "edicao",
  //       resumoExcel,
  //       resumoPdf,
  //       proposta,
  //       contrato
  //     );
  //     try {
  //       console.log(getToken());
  //       const resposta = await api.put(`/projeto/atualizar/${id}`, formData, {
  //         headers: {
  //           Authorization: `Bearer ${getToken()}`,
  //         },
  //       });

  //       if (resposta.status === 200) {
  //         setIsEditing(false);
  //       } else {
  //         setError("Erro ao atualizar o projeto");
  //       }
  //     } catch (error) {
  //       setError("Erro ao atualizar o projeto");
  //     }
  //   }
  // };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/projeto/deletar/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Projeto deletado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao deletar o projeto:", error);
    }
  };

  const handleEditar = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsEditing(true);
  };

  /* const handleDownload = (data: string, fileType: string) => {
    const link = document.createElement('a');
    link.href = `data:application/${fileType};base64,${data}`;
    link.download = `arquivo.${fileType === 'pdf' ? 'pdf' : 'xlsx'}`;
    document.body.appendChild(link);
    link.click();
  }; */

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!projeto) {
    return <Alert variant="warning">Projeto não encontrado</Alert>;
  }

  const atualizarMensagem = (mensagens: string) => {
        const [tituloErro, ...textoErro] = mensagens.split('. ');
            const text = textoErro.join('. ');
            setMensagemValidacao({titulo: tituloErro, texto: text});
            return;
    }

    const handleArquivo = (event: React.ChangeEvent<HTMLInputElement>, setState?: Dispatch<SetStateAction<File | undefined>>) => {
        const arquivo = event.target.files ? event.target.files[0] : null;

        if (!arquivo) {
            setMensagemValidacao({titulo: 'Nenhum arquivo selecionado.', texto: 'Por favor, selecione um arquivo.'});
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

    const excluirArquivo = (arquivoExcluir: File, setState?: Dispatch<SetStateAction<File | undefined>>) => {
        if (setState) {
            setState(undefined);
        }
        else {
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
            <h1 className="titulo"> {projeto.titulo} </h1>
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

      <Form>
        {/* Campos do projeto */}
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
            as="textarea"
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
            as="textarea"
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
        <>
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
          </div>
          {resumoPdf && (
            <div className={styles.arquivosEscolhidos}>
              <img src={arquivoIcon} alt="Arquivo" />
              <span className={styles.arquivoSpan}>
                {resumoPdf.name}
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
                {resumoExcel.name}
              </span>
              <span
                className={styles.arquivoSpanExcluir}
                onClick={() => excluirArquivo(resumoExcel)}
              >
                &#10006;
              </span>
            </div>
          )}
        </>
      ) : (
        <div className={styles.visualizarResumos}>
          <Button
            variant="danger"
            className="mt-3"
          >
            <img className={styles.arquivologo} src={pdflogo} alt="PDF Logo" />
            Ver resumo pdf
          </Button>
          <Button
            variant="success"
            className="mt-3"
          >
            <img className={styles.arquivologo} src={excellogo} alt="Excel Logo" />
            Ver resumo excel
          </Button>
        </div>
      )}
          
          {/* {isEditing? (
            
              )
          : (
            <Button className="bg-alert">
              Ver resumo pdf
            </Button>
          )} */}
          {/* {resumoPdfUrl && (
            <div className={styles.arquivosEscolhidos}> 
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                    {resumoPdf.name}
                </span>
                <span className={styles.arquivoSpanExcluir}
                    onClick={(e) => excluirArquivo(resumoPdf)}>&#10006;
                </span>
            </div>
            )}
        {resumoExcelUrl && (
            <div className={styles.arquivosEscolhidos}> 
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                    {resumoExcel.name}
                </span>
                <span className={styles.arquivoSpanExcluir}
                    onClick={(e) => excluirArquivo(resumoExcel)}>&#10006;
                </span>
            </div>
            )} */}

        {/* {isEditing && (
          <div className={styles.arquivosEscolhidos}>
            <h3>Arquivos</h3>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resumoExcel">Resumo Excel</Form.Label>
              <Form.Control
                type="file"
                name="resumoExcel"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setResumoExcel(target.files ? target.files[0] : undefined);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resumoPdf">Resumo PDF</Form.Label>
              <Form.Control
                type="file"
                name="r esumoPdf"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setResumoPdf(target.files ? target.files[0] : undefined);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resumocontrato">Contrato</Form.Label>
              <Form.Control
                type="file"
                name="resumocontrato"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setResumocontrato(target.files ? target.files[0] : undefined);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="resumoproposta">Proposta</Form.Label>
              <Form.Control
                type="file"
                name="resumoproposta"
                onChange={(e) => {
                  const target = e.target as HTMLInputElement;
                  setResumoproposta(target.files ? target.files[0] : undefined);
                }}
              />
            </Form.Group>
          </div>
        )} */}

        {/* Links de download */}

        {/* !isEditing && (
          <div className={styles.downloadLinks}>
            <h4>Arquivos disponíveis para download:</h4>
            <ul>
              {projeto.resumoPdfUrl ? (
                <li>
                  <Button
                    variant="link"
                    onClick={() => handleDownload(projeto.resumoPdfUrl, "pdf")}
                  >
                    Resumo PDF
                  </Button>
                </li>
              ) : (
                <li>Nenhum resumo PDF disponível.</li>
              )}

              {projeto.resumoExcelUrl ? (
                <li>
                  <Button
                    variant="link"
                    onClick={() =>
                      handleDownload(
                        projeto.resumoExcelUrl,
                        "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      )
                    }
                  >
                    Resumo Excel
                  </Button>
                </li>
              ) : (
                <li>Nenhum resumo Excel disponível.</li>
              ) */}

              {/* projeto.resumocontratoUrl ? (
                <li>
                  <Button
                    variant="link"
                    onClick={() =>
                      handleDownload(projeto.resumocontratoUrl, "pdf")
                    }
                  >
                    Contrato
                  </Button>
                </li>
              ) : (
                <li>Nenhum contrato disponível.</li>
              ) */}

              {/* projeto.resumopropostaUrl ? (
                <li>
                  <Button
                    variant="link"
                    onClick={() =>
                      handleDownload(projeto.resumopropostaUrl, "pdf")
                    }
                  >
                    Proposta
                  </Button>
                </li>
              ) : (
                <li>Nenhuma proposta disponível.</li>
              ) */}
            {/* </ul>
          </div> */}
        

        {isEditing && (
          <Button type="submit" variant="primary">
            Salvar Alterações
          </Button>
        )}

        {isEditing && (
          <Button variant="secondary" onClick={() => handleBack(id)}>
            Descartar Alterações
          </Button>
        )}
      </Form>
    </div>
  );
};

export default Mostra;
