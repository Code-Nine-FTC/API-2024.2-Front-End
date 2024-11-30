import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import MontarFormDataCadastro from "../../services/projeto/utils/montarFormDataProjetoService";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import Select, { SingleValue, ActionMeta } from "react-select";
import { NumericFormat } from 'react-number-format';
import styles from "./mostraProjeto.module.css";
import { getToken, isAuthenticated } from "../../services/auth";
import Calendario from "../date/calendarioComponent";
import arquivoIcon from "../../assets/criarProjeto/arquivo.svg";
import pdflogo from "../../assets/editarProjeto/pdflogo.svg";
import excellogo from "../../assets/editarProjeto/excellogo.svg";
import attach from "../../assets/criarProjeto/attach.svg";
import { VisualizarProjeto } from "../../interface/projeto.interface";
import separarMensagens from "../../functions/separarMensagens";
import ValidadorDeArquivos from "../../functions/validadorDeArquivos";
import isVisualizarDocumento from "../../functions/isVisualizarDocumento";
import isTipoArquivo from "../../functions/isTipoArquivo";
import BaixarArquivo from "../../services/projeto/utils/baixarArquivo";
import ExcluirArquivo from "../../services/projeto/excluir/excluirArquivo";
import SweetAlert2 from "sweetalert2";
import { VisualizarDocumento, FileOrVisualizarDocumento } from "../../interface/documento.interface";
import ExcluirProjeto from "../../services/projeto/excluir/excluirProjetoService";
import EditarProjetoService from "../../services/projeto/editar/editarProjetoService";
import VisualizarProjetoService from "../../services/projeto/visualizar/visualizarProjetoService";
import MontarJsonEditado from "../../services/projeto/utils/montarJsonEditado";
import AuditoriaComponent from "../auditoria/auditoriaComponent";
import { parse, format } from 'date-fns';
import CadastroBolsista from "../cadastros/cadastroBolsista/cadastroBolsista";
import { VisualizarParceiro } from "../../interface/parceiro.interface";
import buscarParceirosService from "../../services/buscar/buscarParceirosService";
import CadastroParceiro from "../cadastros/cadastroParceiro/cadastroParceiro";

interface MensagemValidacao {
  titulo: string;
  texto: string;
}

interface VisualizarProjetoProps {
  id: number;
}

interface OptionTypeParceiro {
  value: number;
  label: string;
  parceiro: VisualizarParceiro;
}

const VisualizarProjetoComponent: React.FC<VisualizarProjetoProps> = ({
  id,
}) => {
  const [mensagemValidacao, setMensagemValidacao] = useState<MensagemValidacao>(
    { titulo: "", texto: "" }
  );
  const [autenticado] = useState<boolean>(isAuthenticated());
  const [projetoOriginal, setProjeto] = useState<VisualizarProjeto | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [titulo, setTitulo] = useState(projetoOriginal?.titulo || "");
  const [referencia, setReferencia] = useState(
    projetoOriginal?.referencia || ""
  );
 const [contratante, setContratante] = useState<Number | null>(null);
  const [integrantes, setIntegrantes] = useState(
    projetoOriginal?.integrantes || ""
  );
  const [links, setLinks] = useState(projetoOriginal?.links || "");
  const [status, setStatus] = useState(projetoOriginal?.status || "");
  const [objeto, setObjeto] = useState(projetoOriginal?.objeto || "");
  const [descricao, setDescricao] = useState(projetoOriginal?.descricao || "");
  const [coordenador, setCoordenador] = useState(
    projetoOriginal?.nomeCoordenador || ""
  );
  const [parceiro, setParceiro] = useState(projetoOriginal?.parceiro || null);
  const [demanda, setDemanda] = useState(projetoOriginal?.classificacaoDemanda || null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [valor, setValor] = useState(projetoOriginal?.valor || "");
  const [startDateValid, setStartDateValid] = useState<boolean | null>(null);
  const [hideTitulo, setHideTitulo] = useState(false);
  const [hideReferencia, setHideReferencia] = useState(false);
  const [hideObjeto, setHideObjeto] = useState(false);
  const [hideIntegrantes, setHideIntegrantes] = useState(false);
  const [hideLinks, setHideLinks] = useState(false);
  const [hideDescricao, setHideDescricao] = useState(false);
  const [hideContratante, setHideContratante] = useState(false);
  const [hideCoordenador, setHideCoordenador] = useState(false);
  const [hideValor, setHideValor] = useState(false);
  const [hideStatus, setHideStatus] = useState(false);
  const [endDateValid, setEndDateValid] = useState<boolean | null>(null);
  const [resumoPdf, setResumoPdf] = useState<FileOrVisualizarDocumento | undefined>(
    undefined
  );
  const [resumoExcel, setResumoExcel] =
    useState<FileOrVisualizarDocumento | undefined>(undefined);
  const [proposta, setProposta] = useState<FileOrVisualizarDocumento | null>(
    null
  );
  const [contrato, setContrato] = useState<FileOrVisualizarDocumento | null>(
    null
  );
  const [documentos, setDocumentos] = useState<VisualizarDocumento[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalGasto, setShowModalGasto] = useState(false);
  const [showModalBolsista, setShowModalBolsista] = useState(false);
  const [showModalReceita, setShowModalReceita] = useState(false);
  const [parceiros, setParceiros] = useState<VisualizarParceiro[]>([]);
  const navigate = useNavigate();
  const [showParceiroModal, setShowParceiroModal] = useState<boolean>(false);
  const [selectedParceiro, setSelectedParceiro] = useState<OptionTypeParceiro | null>(null);

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const respostaProjeto = await VisualizarProjetoService(id);
        if (respostaProjeto.status === 200) {
          setProjeto(respostaProjeto.data);
  
          // Verifique se existem campos ocultos salvos no backend
          const camposOcultosBackend = respostaProjeto.data.camposOcultos;
          if (camposOcultosBackend) {
            const camposOcultosArray = camposOcultosBackend.split(", ");
            setHideTitulo(camposOcultosArray.includes("titulo"));
            setHideReferencia(camposOcultosArray.includes("referencia"));
            setHideContratante(camposOcultosArray.includes("contratante"));
            setHideCoordenador(camposOcultosArray.includes("coordenador"));
            setHideValor(camposOcultosArray.includes("valor"));
            setHideStatus(camposOcultosArray.includes("status"));
            setHideDescricao(camposOcultosArray.includes("descricao"));
            setHideIntegrantes(camposOcultosArray.includes("integrantes"));
            setHideLinks(camposOcultosArray.includes("links"));
            setHideObjeto(camposOcultosArray.includes("objetivo"));
          }
        }
      } catch (error: any) {
        let errorMessage =
          error.message ||
          "Erro ao buscar o projeto. Por favor, tente novamente mais tarde.";
        console.error("Erro ao buscar projeto", error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProjeto();
  }, [id]);

  useEffect(() => {
    if (projetoOriginal) {
      setTitulo(projetoOriginal.titulo || "");
      setReferencia(projetoOriginal.referencia || "");
      // setContratante(projetoOriginal.contratante || "");
      setObjeto(projetoOriginal.objeto || "");
      setDescricao(projetoOriginal.descricao || "");
      setCoordenador(projetoOriginal.nomeCoordenador || "");
      setIntegrantes(projetoOriginal.integrantes || "");
      setLinks(projetoOriginal.links || "");
      setStatus(projetoOriginal.status || "");
      setValor(projetoOriginal.valor || "");
      setStartDate(parse(projetoOriginal.dataInicio, 'yyyy-MM-dd', new Date()));
      setEndDate(parse(projetoOriginal.dataTermino, 'yyyy-MM-dd', new Date()));
      setParceiro(projetoOriginal.parceiro || null);
      // setValor(formatarValorBR(projetoOriginal.valor?.toString() || ""));
      setDocumentos(projetoOriginal.documentos);
      projetoOriginal.documentos.forEach((doc) => {
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
        icon: "error",
        title: mensagemValidacao.titulo,
        text: mensagemValidacao.texto,
      });
    }
  }, [mensagemValidacao]);

  const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/projeto/visualizar/${id}`);
  };

  const validarDatas = () => {
    setStartDateValid(startDate !== null);
    setEndDateValid(endDate !== null && (!startDate || endDate >= startDate));
  };

  const dataInicioString = startDate ? format(startDate, 'yyyy-MM-dd') : null;
  const dataTerminoString = endDate ? format(endDate, 'yyyy-MM-dd') : null;

  async function buscarParceiros() {
    const resposta = await buscarParceirosService();
    if (resposta.status === 200) {
      setParceiros(resposta.data);
      console.log(resposta.data);
    } else {
      console.log(resposta.message);
    }
  }
  
  const parceiroOptions: OptionTypeParceiro[] = parceiros.map((parceiro) => ({
    value: parceiro.id,
    label: parceiro.nome,
    parceiro: parceiro,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: '38px', // Altura padrão do Form.Control
      height: '38px',
      borderColor: "#ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#86b7fe",
      },
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: '38px',
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: '38px',
      padding: '0 6px', // Ajuste o padding conforme necessário
    }),
    input: (provided: any) => ({
      ...provided,
      margin: '0',
      padding: '0',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#495057",
      lineHeight: '38px', // Alinha verticalmente o texto
    }),
    menu: (provided: any) => ({
      ...provided,
      zIndex: 9999,
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      padding: '0 8px',
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      padding: '0 8px',
    }),
  };

  const handleParceirosChange = (
    selected: SingleValue<OptionTypeParceiro>,
    actionMeta: ActionMeta<OptionTypeParceiro>
  ) => {
    setSelectedParceiro(selected);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const camposOcultos = [];
    if (hideTitulo) camposOcultos.push("titulo");
    if (hideReferencia) camposOcultos.push("referencia");
    if (hideContratante) camposOcultos.push("contratante");
    if (hideCoordenador) camposOcultos.push("coordenador");
    if (hideValor) camposOcultos.push("valor");
    if (hideStatus) camposOcultos.push("status");
    if (hideDescricao) camposOcultos.push("descricao");
    if (hideIntegrantes) camposOcultos.push("integrantes");
    if (hideLinks) camposOcultos.push("links");
    if (hideObjeto) camposOcultos.push("objetivo");

    let camposOcultosString = camposOcultos.join(", ");
    if (camposOcultosString == "") {
      camposOcultosString = "nenhum";
    }

    const camposEditados = {
      titulo: titulo,
      referencia: referencia,
      // contratante: contratante,
      objeto: objeto,
      descricao: descricao,
      nomeCoordenador: coordenador,
      integrantes: integrantes,
      links: links,
      status: status,
      dataInicio: dataInicioString,
      dataTermino: dataTerminoString,
      camposOcultos: camposOcultosString,
      valor: valor.toString(),
      parceiro: selectedParceiro ? selectedParceiro.parceiro : undefined, 
    };

    console.log("camposEditados:", camposEditados);

    const projetoInicial = MontarJsonEditado(projetoOriginal, camposEditados);

    console.log("projetoInicial:", projetoInicial);

    if (projetoInicial.links) {
      console.log("Links:", projetoInicial.links);
    } else {
      console.log("Links não encontrados no projetoInicial");
    }

    if (projetoInicial.integrantes) {
      console.log("Integrantes:", projetoInicial.integrantes);
    } else {
      console.log("Integrantes não encontrados no projetoInicial");
    }

    const hasChanges =
      Object.keys(projetoInicial).length > 0 ||
      resumoPdf ||
      resumoExcel ||
      proposta ||
      contrato;

    if (!hasChanges) {
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
      isTipoArquivo(contrato)
    );
    try {
      console.log(getToken());
      const resposta = await EditarProjetoService(formData, id);

      if (resposta.status === 200) {
        setIsEditing(false);

        SweetAlert2.fire({
          title: "Sucesso!",
          text: "Projeto editado com sucesso.",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            // Recarrega a página
            window.location.reload();
          }
        });
      } else {
        setError("Erro ao atualizar o projeto");
      }
    } catch (error) {
      setError("Erro ao atualizar o projeto");
    }
  };

  const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir o projeto?",
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
          const exclusaoProjeto = await ExcluirProjeto(id);
          if (exclusaoProjeto.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoProjeto.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir o projeto. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir projeto", error);
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

  if (!projetoOriginal) {
    return <Alert variant="warning">Projeto não encontrado</Alert>;
  }

  const atualizarMensagem = (mensagens: string) => {
    const [tituloErro, ...textoErro] = mensagens.split(". ");
    const text = textoErro.join(". ");
    setMensagemValidacao({ titulo: tituloErro, texto: text });
    return;
  };

  const handleArquivo = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState?: Dispatch<SetStateAction<FileOrVisualizarDocumento | null>>
  ) => {
    const arquivo = event.target.files ? event.target.files[0] : null;

    if (!arquivo) {
      return;
    }

    switch (setState) {
      case setProposta:
        if (proposta) {
          setMensagemValidacao({
            titulo: "Apenas um arquivo pode ser adicionado.",
            texto: "Por favor, remova o arquivo atual para adicionar outro.",
          });
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
            icon: "success",
            title: "Arquivo adicionado com sucesso",
          });
          return;
        }

      case setContrato:
        if (contrato) {
          setMensagemValidacao({
            titulo: "Apenas um arquivo pode ser adicionado.",
            texto: "Por favor, remova o arquivo atual para adicionar outro.",
          });
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
            icon: "success",
            title: "Arquivo adicionado com sucesso",
          });
          return;
        }

      default:
        if (resumoPdf && resumoExcel) {
          setMensagemValidacao({
            titulo: "Apenas 2 arquivos podem ser adicionados nessa categoria.",
            texto: "Por favor, remova um arquivo para adicionar outro.",
          });
          return;
        }
        const arquivosValidados = ValidadorDeArquivos([arquivo]);
        const mensagens = separarMensagens(arquivosValidados);
        if (mensagens) {
          atualizarMensagem(mensagens);
          return;
        } else {
          if (arquivo.type === "application/pdf") {
            if (resumoPdf !== undefined) {
              setMensagemValidacao({
                titulo: "Apenas um arquivo PDF pode ser adicionado.",
                texto:
                  "Por favor, remova o arquivo atual para adicionar outro.",
              });
              return;
            } else {
              setResumoPdf(arquivo);
              SweetAlert2.fire({
                icon: "success",
                title: "Arquivo adicionado com sucesso",
              });
            }
          }
          if (
            arquivo.type === "application/vnd.ms-excel" ||
            arquivo.type ===
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          ) {
            if (resumoExcel !== undefined) {
              setMensagemValidacao({
                titulo: "Apenas um arquivo Excel pode ser adicionado.",
                texto:
                  "Por favor, remova o arquivo atual para adicionar outro.",
              });
              return;
            } else {
              setResumoExcel(arquivo);
              SweetAlert2.fire({
                icon: "success",
                title: "Arquivo adicionado com sucesso",
              });
            }
          }
        }
    }

    event.target.value = "";
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
      if (arquivoExcluir.type === "application/pdf") {
        setResumoPdf(undefined);
      }
      if (
        arquivoExcluir.type === "application/vnd.ms-excel" ||
        arquivoExcluir.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ) {
        setResumoExcel(undefined);
      }
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleOpenModalGasto = () => setShowModalGasto(true);
  const handleCloseModalGasto = () => setShowModalGasto(false);
  const handleOpenModalBolsista = () => setShowModalBolsista(true);
  const handleCloseModalBolsista = () => setShowModalBolsista(false);
  const handleOpenModalReceita = () => setShowModalReceita(true);
  const handleCloseModalReceita = () => setShowModalReceita(false);
  const handleOpenModalParceiro = () => setShowParceiroModal(true);
  const handleCloseModalParceiro = () => setShowParceiroModal(false);

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
    <section className={styles.formMain}>
      <Form onSubmit={handleSubmit}>
        {isEditing && (
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
            os usuários comuns.
          </Form.Text>
        )}
  
        {/* Titulo */}
        <InputGroup className="mb-3">
          <FloatingLabel controlId="validationCustom01" label="Titulo" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Titulo do projeto"
              required
              value={(!autenticado && hideTitulo) ? "" : titulo}
              onChange={(e) => setTitulo(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o título do projeto.
            </Form.Control.Feedback>
          </FloatingLabel>
          {/* {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideTitulo}
              onChange={(e) => setHideTitulo(e.target.checked)}
            />
          )} */}
        </InputGroup>
  
        {/* Referencia */}
        <InputGroup className="mb-3">
          <FloatingLabel controlId="validationCustom01" label="Referência" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Referencia"
              required
              value={(!autenticado && hideReferencia) ? "" : referencia}
              onChange={(e) => setReferencia(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a referencia do projeto.
            </Form.Control.Feedback>
          </FloatingLabel>
          {/* {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for following text input"
              checked={hideReferencia}
              onChange={(e) => setHideReferencia(e.target.checked)}
            />
          )} */}
        </InputGroup>

       {/* Contratante */}
      <InputGroup className="mb-3">
        <FloatingLabel controlId="validationCustom01" label={!isEditing && "Parceiro"} className="flex-grow-1" style={{ color: "#9C9C9C"}}>
        {!isEditing ? (
            // Display parceiro.nome in a read-only field when not editing
            <Form.Control
              type="text"
              placeholder="Parceiro"
              required
              value={(!autenticado && hideContratante) ? "" : parceiro?.nome}
              readOnly
              onClick={buscarParceiros}
            />
          ) : (
            // Display a select dropdown when editing
            <Select
                  styles={customStyles}
                  options={parceiroOptions}
                  value={selectedParceiro}
                  onChange={handleParceirosChange}
                  placeholder={"Selecione um parceiro"}
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Nenhuma opção disponível"}
                  required
                />
          )}
          <Form.Control.Feedback type="invalid">
            Por favor, insira o contratante do projeto.
          </Form.Control.Feedback>
        </FloatingLabel>
        {isEditing && (
          <InputGroup.Checkbox
            aria-label="Checkbox for following text input"
            checked={hideContratante}
            onChange={(e) => setHideContratante(e.target.checked)}
          />
        )}
      </InputGroup>

        {/* Situação do Projeto */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationcustom01"
            label="Situação do Projeto"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Select
              aria-label="Floating label select example"
              required
              value={(!autenticado && hideStatus) ? "" : status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!isEditing}
              style={{ fontSize: 14, color: "#9C9C9C", zIndex: 1 }}
            >
              <option disabled selected>
                Selecionar uma Situação
              </option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluído">Concluído</option>
            </Form.Select>
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding status"
              checked={hideStatus}
              onChange={(e) => setHideStatus(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Objetivo */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom01"
            label="Objetivo"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              as="textarea"
              name="objeto"
              value={(!autenticado && hideObjeto) ? "" : objeto}
              onChange={(e) => setObjeto(e.target.value)}
              readOnly={!isEditing}
            />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding objetivo"
              checked={hideObjeto}
              onChange={(e) => setHideObjeto(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Descrição */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom04"
            label="Descrição"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              as="textarea"
              name="descricao"
              value={(!autenticado && hideDescricao) ? "" :descricao}
              onChange={(e) => setDescricao(e.target.value)}
              readOnly={!isEditing}
            />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding descricao"
              checked={hideDescricao}
              onChange={(e) => setHideDescricao(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Valor */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom01"
            label="Valor"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <NumericFormat
              className="form-control"
              thousandSeparator="."
              decimalSeparator=","
              prefix="R$ "
              decimalScale={2}
              fixedDecimalScale={true}
              allowNegative={false}
              placeholder="Valor"
              value={(!autenticado && hideValor) ? "" :valor}
              onValueChange={(values) => setValor(values.value)}
              readOnly={!isEditing}
          />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding valor"
              checked={hideValor}
              onChange={(e) => setHideValor(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Integrantes */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom01"
            label="Integrantes"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              type="text"
              name="integrantes"
              value={(!autenticado && hideIntegrantes) ? "" :integrantes}
              onChange={(e) => {
                setIntegrantes(e.target.value); // Atualiza o estado corretamente
                console.log("Integrantes:", e.target.value); // Verifique se o valor está sendo capturado
              }}
              readOnly={!isEditing}
            />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding integrantes"
              checked={hideIntegrantes}
              onChange={(e) => setHideIntegrantes(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Links */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom01"
            label="Links"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              type="text"
              name="links"
              value={(!autenticado && hideLinks) ? "" : links}
              onChange={(e) => {
                setLinks(e.target.value); 
                console.log("Links:", e.target.value); 
              }}
              readOnly={!isEditing}
            />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding links"
              checked={hideLinks}
              onChange={(e) => setHideLinks(e.target.checked)}
            />
          )}
        </InputGroup>

        {/* Coordenador */}
        <InputGroup className="mb-3">
          <FloatingLabel
            controlId="validationCustom01"
            label="Coordenador"
            className="flex-grow-1"
            style={{ color: "#9C9C9C", zIndex: 1 }}
          >
            <Form.Control
              type="text"
              name="Coordenador"
              value={(!autenticado && hideCoordenador) ? "" :coordenador}
              onChange={(e) => setCoordenador(e.target.value)}
              readOnly={!isEditing}
            />
          </FloatingLabel>
          {isEditing && (
            <InputGroup.Checkbox
              aria-label="Checkbox for hiding coordenador"
              checked={hideCoordenador}
              onChange={(e) => setHideCoordenador(e.target.checked)}
            />
          )}
        </InputGroup>
        <InputGroup className="mb-3">
        <Calendario
          startDate={startDate ? startDate : null}
          endDate={endDate ? endDate : null}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          startDateValid={startDateValid}
          endDateValid={endDateValid}
          validarDatas={validarDatas}
          cadastro={true}
        />
        </InputGroup>

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
              style={{ display: "none" }}
            />
            {resumoPdf && (
              <div className={styles.arquivosEscolhidos}>
                <img src={arquivoIcon} alt="Arquivo" />
                <span className={styles.arquivoSpan}>
                  {isVisualizarDocumento(resumoPdf)
                    ? resumoPdf.nome
                    : resumoPdf.name}
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
                  {isVisualizarDocumento(resumoExcel)
                    ? resumoExcel.nome
                    : resumoExcel.name}
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
                style={{ display: "none" }}
              />
              {proposta && (
                <div className={styles.anexosEscolhidos}>
                  <img src={arquivoIcon} alt="Arquivo" />
                  <span className={styles.arquivoSpan}>
                    {isVisualizarDocumento(proposta)
                      ? proposta.nome
                      : proposta.name}
                  </span>
                  <span
                    className={styles.arquivoSpanExcluir}
                    onClick={(e) => excluirArquivo(proposta, setProposta)}
                  >
                    &#10006;
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
                style={{ display: "none" }}
              />
              {contrato && (
                <div className={styles.anexosEscolhidos}>
                  <img src={arquivoIcon} alt="Arquivo" />
                  <span className={styles.arquivoSpan}>
                    {isVisualizarDocumento(contrato)
                      ? contrato.nome
                      : contrato.name}
                  </span>
                  <span
                    className={styles.arquivoSpanExcluir}
                    onClick={(e) => excluirArquivo(contrato, setContrato)}
                  >
                    &#10006;
                  </span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className={styles.visualizarResumos}>
              {documentos.map((doc) => {
                if (doc.tipo === "resumoPdf" && doc.caminho) {
                  return (
                    <Button
                      key={doc.id}
                      variant="danger"
                      className="mt-3"
                      onClick={() => handleBaixar(doc.id, doc.nome)}
                    >
                      <img
                        className={styles.arquivologo}
                        src={pdflogo}
                        alt="PDF Logo"
                      />
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
                      <img
                        className={styles.arquivologo}
                        src={excellogo}
                        alt="Excel Logo"
                      />
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
              {documentos.filter(
                (doc) => doc.tipo === "proposta" && doc.caminho
              ).length > 0 ? (
                documentos
                  .filter((doc) => doc.tipo === "proposta" && doc.caminho)
                  .map((doc) => (
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
              {documentos.filter(
                (doc) => doc.tipo === "contrato" && doc.caminho
              ).length > 0 ? (
                documentos
                  .filter((doc) => doc.tipo === "contrato" && doc.caminho)
                  .map((doc) => (
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
      </section>
    <div>
      {autenticado &&(
          <div className={styles.botoes}>
            <div className="d-flex justify-content-center pb-3">
              <Card 
                onClick={handleOpenModal} 
                className="text-center border-light shadow-sm" 
                style={{ cursor: 'pointer', width: '200px', marginRight: '3%' }}
              >
                <Card.Body className="bg-white">
                  <Card.Text className="text-primary fw-bold">
                    Auditoria
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
              
            <Modal 
              show={showModal} 
              onHide={handleCloseModal} 
              size="xl" 
              aria-labelledby="contained-modal-title-vcenter" 
              centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Auditoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AuditoriaComponent projetoId={id ? id.toString() : ''} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>

          {/* <div className="d-flex justify-content-center pb-3">
            <Card 
              onClick={handleOpenModalGasto} 
              className="text-center border-light shadow-sm" 
              style={{ cursor: 'pointer', width: '200px', marginRight: '3%' }}
            >
              <Card.Body className="bg-white">
                <Card.Text className="text-primary fw-bold">
                  Adicionar Gastos
                </Card.Text>
              </Card.Body>
            </Card>

          </div> */}
            
            {/* <Modal 
                show={showModalGasto} 
                onHide={handleCloseModalGasto} 
                size="xl" 
                aria-labelledby="contained-modal-title-vcenter" 
                centered
              >
                  <Modal.Header style={{backgroundColor: "#00359A"}} closeButton closeVariant="white">
                      <Modal.Title style={{color: "white"}}>Auditoria</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <FormCadastrarGasto projetoId={id ? id.toString() : '' }/>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModalGasto}>
                          Fechar
                      </Button>
                  </Modal.Footer>
            </Modal> */}

            <div className="d-flex justify-content-center pb-3">
            <Card 
              onClick={handleOpenModalBolsista} 
              className="text-center border-light shadow-sm" 
              style={{ cursor: 'pointer', width: '200px',marginRight: '3%' }}
            >
              <Card.Body className="bg-white">
                <Card.Text className="text-primary fw-bold">
                  Adicionar Bolsista
                </Card.Text>
              </Card.Body>
            </Card>

          </div>
            
            <Modal 
                show={showModalBolsista} 
                onHide={handleCloseModalBolsista} 
                size="xl" 
                aria-labelledby="contained-modal-title-vcenter" 
                centered
              >
                  <Modal.Header style={{backgroundColor: "#00359A"}} closeButton closeVariant="white">
                      <Modal.Title style={{color: "white"}}>Bolsista</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <CadastroBolsista idProjeto={id ? id.toString() : '' }/>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModalBolsista}>
                          Fechar
                      </Button>
                  </Modal.Footer>
            </Modal>
          {/* <div className="d-flex justify-content-center pb-3">
            <Card 
              onClick={handleOpenModalReceita} 
              className="text-center border-light shadow-sm" 
              style={{ cursor: 'pointer', width: '200px' }}
            >
              <Card.Body className="bg-white">
                <Card.Text className="text-primary fw-bold">
                  Adicionar Receita
                </Card.Text>
              </Card.Body>
            </Card>
          </div> */}
            {/* <Modal 
                show={showModalReceita} 
                onHide={handleCloseModalReceita} 
                size="xl" 
                aria-labelledby="contained-modal-title-vcenter" 
                centered
              >
                  <Modal.Header style={{backgroundColor: "#00359A"}} closeButton closeVariant="white">
                      <Modal.Title style={{color: "white"}}>Receita</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                      <CadastroReceita projetoId={id ? id.toString() : '' }/>
                  </Modal.Body>
                  <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModalReceita}>
                          Fechar
                      </Button>
                  </Modal.Footer>
            </Modal> */}

          <Modal
            show={showParceiroModal}
            onHide={handleCloseModalParceiro}
            size="xl"
            aria-labelledby="cadastrar-parceiro-modal"
            centered
          >
            <Modal.Header style={{ backgroundColor: "#00359A" }} closeButton closeVariant="white">
              <Modal.Title style={{ color: "white" }}>Cadastrar Parceiro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Pass the handler to close the modal after successful registration */}
              <CadastroParceiro setShowParceiroModal={handleCloseModalParceiro} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalParceiro}>
                Fechar
              </Button>
            </Modal.Footer>
          </Modal>
          </div>
        )}
      </div>
    </>
  );
};

export default VisualizarProjetoComponent;
