import { Button, FloatingLabel, Form, InputGroup, Modal, Accordion, Card, Row, Col } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import Select, { SingleValue, MultiValue, ActionMeta } from "react-select";
import { NumberFormatValues, NumericFormat} from 'react-number-format';
import styles from "./criarProjeto.module.css";
import SweetAlert2 from "sweetalert2";
import CadastrarProjetoFunction from "../../services/projeto/cadastrar/cadastarProjetoService";
import Calendario from "../date/calendarioComponent";
import { useNavigate } from "react-router-dom";
import { parse, format, set } from 'date-fns';
import buscarParceirosService from "../../services/buscar/buscarParceirosService";
import { VisualizarParceiro } from "../../interface/parceiro.interface";
import CadastroParceiro from "../cadastros/cadastroParceiro/cadastroParceiro";
import CadastroDemandasComponent from "../cadastros/demanda/formCadastrarDemanda";
import CadastroBolsista from "../cadastros/cadastroBolsista/cadastroBolsista";
import { VisualizarDemanda } from "../../interface/demanda.interface";
import buscarDemandasService from "../../services/buscar/buscarDemandasService";
import { VisualizarBolsista } from "../../interface/bolsistas.interface";
import buscarBolsistasService from "../../services/buscar/buscarBolsistasService";

interface MensagemValidacao {
  titulo: string;
  texto: string;
}

interface OptionTypeParceiro {
  value: number;
  label: string;
  parceiro: VisualizarParceiro;
}

interface OptionTypeDemanda {
  value: number;
  label: string;
  demanda: VisualizarDemanda;
}

interface OptionTypeBolsista {
  value: number | string; 
  label: string;
  bolsista: VisualizarBolsista;
}

const CriarProjetoComponent = () => {
  const navigate = useNavigate();

  const [mensagemValidacao] = useState<MensagemValidacao>(
    { titulo: "", texto: "" }
  );
  const [camposValidados, setValidado] = useState(false);
  const [tituloProjeto, setTituloProjeto] = useState("");
  const [referenciaProjeto, setReferenciaProjeto] = useState("");
  const [contratante, setContratante] = useState<Number | null>(null);;
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
  const [valorValid, setValorValid] = useState<boolean | null>(null);
  const [parceiros, setParceiros] = useState<VisualizarParceiro[]>([]);
  const [demandas, setDemandas] = useState<VisualizarDemanda[]>([]);
  const [bolsistas, setBolsistas] = useState<VisualizarBolsista[]>([]);
  const [showParceiroModal, setShowParceiroModal] = useState(false);
  const [showDemandaModal, setShowDemandaModal] = useState<boolean>(false);
  const [selectedParceiro, setSelectedParceiro] = useState<OptionTypeParceiro | null>(null);
  const [selectedDemanda, setSelectedDemanda] = useState<OptionTypeDemanda | null>(null);
  const [selectedBolsistas, setSelectedBolsistas] = useState<OptionTypeBolsista[]>([]);
  const [newBolsistas, setNewBolsistas] = useState<VisualizarBolsista[]>([]);

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

    const dataInicioString = startDate ? format(startDate, 'yyyy-MM-dd') : null;
    const dataTerminoString = endDate ? format(endDate, 'yyyy-MM-dd') : null;

    const camposOcultos = [];
    if (hideTitulo) camposOcultos.push("titulo");
    if (hideReferencia) camposOcultos.push("referencia");
    if (hideContratante) camposOcultos.push("contratante");
    if (hideCoordenador) camposOcultos.push("coordenador");
    if (hideValor) camposOcultos.push("valor");
    if (hideStatus) camposOcultos.push("status");

    const camposOcultosString = camposOcultos.join(", ");

    // Extrair bolsistas selecionados (existentes)
  const bolsistasSelecionados = selectedBolsistas.map(option => ({
    id: option.bolsista.id,
    nome: option.bolsista.nome,
    documento: option.bolsista.documento,
    rg: option.bolsista.rg,
    tipoBolsa: option.bolsista.tipoBolsa,
    duracao: option.bolsista.duracao,
    areaAtuacao: option.bolsista.areaAtuacao,
    // Outros campos conforme necessário
  }));

  // Bolsistas novos (remover o campo 'id')
  const bolsistasNovos = newBolsistas.map(bolsista => ({
    nome: bolsista.nome,
    documento: bolsista.documento,
    rg: bolsista.rg,
    tipoBolsa: bolsista.tipoBolsa,
    duracao: bolsista.duracao,
    areaAtuacao: bolsista.areaAtuacao,
    // Não incluir 'id'
  }));

  // Combinar ambas as listas
  const todosBolsistas = [...bolsistasSelecionados, ...bolsistasNovos];

    const projeto = {
      titulo: tituloProjeto,
      referencia: referenciaProjeto,
      nomeCoordenador: nomeCoordenador,
      dataInicio: dataInicioString || "",
      valor: valorFloat,
      status: status,
      dataTermino: dataTerminoString || "",
      // contratante: "",
      camposOcultos: camposOcultosString,
      parceiro: selectedParceiro ? selectedParceiro.parceiro : undefined, 
      classificacaoDemanda: selectedDemanda ? selectedDemanda.demanda : undefined, 
      bolsistas: todosBolsistas,
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

  async function buscarDemandas() {
    const resposta = await buscarDemandasService();
    if (resposta.status === 200) {
      setDemandas(resposta.data);
      console.log(resposta.data);
    } else {
      console.log(resposta.message);
    }
  }

  const demandaOptions: OptionTypeDemanda[] = demandas.map((demanda) => ({
    value: demanda.id,
    label: demanda.descricao,
    demanda: demanda,
  }));

  useEffect (() => {
    async function buscarBolsistas() {
      const resposta = await buscarBolsistasService();
      if (resposta.status === 200) {
        setBolsistas(resposta.data);
        console.log(resposta.data);
      } else {
        console.log(resposta.message);
      }
    }
    buscarBolsistas();
  }, []);

  const bolsistaOptions: OptionTypeBolsista[] = bolsistas
    .filter(bolsista => bolsista.id !== undefined) // Filtrar bolsistas sem id
    .map((bolsista) => ({
      value: bolsista.id as number, // Assegura que id não é undefined
      label: bolsista.nome,
      bolsista: bolsista,
    }));
  
  const novosBolsistasOptions: OptionTypeBolsista[] = newBolsistas.map((bolsista, index) => ({
    value: `novo-${index}`,
    label: bolsista.nome || `Novo Bolsista ${index + 1}`,
    bolsista: bolsista,
  }));
  
  // // Combinar ambas as listas se necessário
  // const todasBolsistasOptions: OptionTypeBolsista[] = [...bolsistaOptions, ...novosBolsistasOptions];

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
    placeholder: (provided: any, state: any) => ({
      ...provided,
      fontSize: window.innerWidth < 576 ? '0.75em' : '1em', // Ajuste responsivo
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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
  
  const handleDemandasChange = (
    selected: SingleValue<OptionTypeDemanda>,
    actionMeta: ActionMeta<OptionTypeDemanda>
  ) => {
    setSelectedDemanda(selected);
  };

  const addNewBolsista = () => {
    const novoBolsista: VisualizarBolsista = {
      id: Date.now(),
      nome: "",
      documento: "",
      rg: "",
      tipoBolsa: "",
      duracao: "",
      areaAtuacao: "",
      // Outros campos conforme necessário
    };
    setNewBolsistas([...newBolsistas, novoBolsista]);
  };
  
  // Remover um bolsista pelo índice
  const removeNewBolsista = (index: number) => {
    const updatedBolsistas = [...newBolsistas];
    updatedBolsistas.splice(index, 1);
    setNewBolsistas(updatedBolsistas);
  };
  
  // Atualizar um campo de um novo bolsista
  const handleNewBolsistaChange = (
    index: number,
    field: keyof VisualizarBolsista,
    value: string
  ) => {
    const updatedBolsistas = [...newBolsistas];
    updatedBolsistas[index] = { ...updatedBolsistas[index], [field]: value };
    setNewBolsistas(updatedBolsistas);
  };

  const handleOpenModalParceiro = () => setShowParceiroModal(true);
  const handleCloseModalParceiro = () => setShowParceiroModal(false);
  const handleOpenModalDemanda = () => setShowDemandaModal(true);
  const handleCloseModalDemanda = () => setShowDemandaModal(false);

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
          </InputGroup>
          <InputGroup className="mb-3">
            <FloatingLabel
              label="Referência de projeto"
              controlId="validationCustom02"
              className="flex-grow-1"
              style={{ color: "#9C9C9C"}}
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

          <div className="mb-3 position-relative">
            <InputGroup onClick={buscarParceiros}>
              <FloatingLabel
                label=""
                controlId="validationCustom03"
                className="flex-grow-1"
                style={{ color: "#9C9C9C" }}
              >
                <Select
                  styles={{
                    ...customStyles,
                    control: (provided: any) => ({
                      ...provided,
                      borderColor:
                        camposValidados && !selectedParceiro? "#dc3545" : provided.borderColor,
                      "&:hover": {
                        borderColor:
                          camposValidados && !selectedParceiro? "#dc3545" : "#86b7fe",
                      },
                    }),
                  }}
                  options={parceiroOptions}
                  value={selectedParceiro}
                  onChange={handleParceirosChange}
                  placeholder={ "Selecione um parceiro"}
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Nenhuma opção disponível"}
                  required
                  // isInvalid={camposValidados && !selectedParceiro}
                />
              </FloatingLabel>
              <InputGroup.Checkbox
                aria-label="Checkbox para ocultar contratante"
                checked={hideContratante}
                onChange={(e) => setHideContratante(e.target.checked)}
                style={{ marginLeft: '10px' }}
              />
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowParceiroModal(true)}
              >
                Adicionar Parceiro
              </Button>
            </InputGroup>
            {camposValidados && !selectedParceiro && (
              <div className="text-danger" style={{ position: "relative", top: "100%", left: 0, marginTop: "5px" }}>
                Por favor, selecione um parceiro.
              </div>
            )}
          </div>
          
          <div className="mb-3 position-relative">
            <InputGroup onClick={buscarDemandas}>
              <FloatingLabel
                label=""
                controlId="validationCustom03"
                className="flex-grow-1"
                style={{ color: "#9C9C9C" }}
              >
                <Select
                  styles={{
                    ...customStyles,
                    control: (provided: any) => ({
                      ...provided,
                      borderColor:
                        camposValidados && !selectedDemanda ? "#dc3545" : provided.borderColor,
                      "&:hover": {
                        borderColor:
                          camposValidados && !selectedDemanda? "#dc3545" : "#86b7fe",
                      },
                    }),
                  }}
                  options={demandaOptions}
                  value={selectedDemanda}
                  onChange={handleDemandasChange}
                  placeholder={ "Selecione uma demanda"}
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Nenhuma opção disponível"}
                  required
                  // isInvalid={camposValidados && !selectedParceiro}
                />
              </FloatingLabel>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowDemandaModal(true)}
              >
                Adicionar Demanda
              </Button>
            </InputGroup>
            {camposValidados && !selectedDemanda && (
              <div className="text-danger" style={{ position: "relative", top: "100%", left: 0, marginTop: "5px" }}>
                Por favor, selecione uma demanda.
              </div>
            )}
          </div>

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

          <Form.Group className="mb-3">
      <Form.Label>Bolsistas Existentes</Form.Label>
      <Select
        isMulti
        styles={customStyles}
        options={bolsistaOptions}
        value={selectedBolsistas}
        onChange={(selectedOptions) =>
          setSelectedBolsistas(selectedOptions as OptionTypeBolsista[])
        }
        placeholder="Selecione bolsistas já cadastrados"
        classNamePrefix="react-select"
        noOptionsMessage={() => "Nenhuma opção disponível"}
      />
      {/* Validação de erros, se necessário */}
      {/* {camposValidados && selectedBolsistas.length === 0 && (
        <div className="text-danger">
          Por favor, selecione pelo menos um bolsista ou adicione um novo.
        </div>
      )} */}
    </Form.Group>

    {/* Accordion para cadastrar novos bolsistas */}
    <Accordion defaultActiveKey="0" className="mb-3">
      <Accordion.Item eventKey="0">
        <Accordion.Header>Cadastrar Novos Bolsistas</Accordion.Header>
        <Accordion.Body>
          {newBolsistas.length === 0 && (
            <p>Nenhum bolsista adicionado. Clique em "Adicionar Bolsista" para começar.</p>
          )}
          {newBolsistas.map((bolsista, index) => (
            <Card key={index} className="mb-3">
              <Card.Header>
                <strong>Bolsista {index + 1}</strong>
                <Button
                  variant="danger"
                  size="sm"
                  className="float-end"
                  onClick={() => removeNewBolsista(index)}
                >
                  Excluir
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaNome-${index}`} className="mb-3">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o nome do bolsista"
                        value={bolsista.nome}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "nome", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaDocumento-${index}`} className="mb-3">
                      <Form.Label>Documento</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o documento do bolsista"
                        value={bolsista.documento}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "documento", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaRG-${index}`} className="mb-3">
                      <Form.Label>RG</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o RG do bolsista"
                        value={bolsista.rg}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "rg", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                {/* Adicione outros campos conforme necessário */}
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaTipoBolsa-${index}`} className="mb-3">
                      <Form.Label>Tipo de Bolsa</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite o tipo de bolsa"
                        value={bolsista.tipoBolsa}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "tipoBolsa", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaDuracao-${index}`} className="mb-3">
                      <Form.Label>Duração</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite a duração da bolsa"
                        value={bolsista.duracao}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "duracao", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId={`newBolsistaAreaAtuacao-${index}`} className="mb-3">
                      <Form.Label>Área de Atuação</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Digite a área de atuação"
                        value={bolsista.areaAtuacao}
                        onChange={(e) =>
                          handleNewBolsistaChange(index, "areaAtuacao", e.target.value)
                        }
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}

          {/* Botão para adicionar mais bolsistas */}
          <Button variant="primary" onClick={addNewBolsista}>
            Adicionar Bolsista
          </Button>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>

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
                as={NumericFormat}
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale
                allowNegative={false}
                placeholder="Valor"
                value={valor}
                isInvalid={valorValid === false}
                isValid={valorValid === true}
                onValueChange={(values: NumberFormatValues) => setValor(values.value)}
                required
                name="valor"
                id="valor"
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
            startDate={startDate ? startDate: null}
            endDate={endDate ? endDate: null}
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
      <Modal 
          show={showParceiroModal} 
          onHide={handleOpenModalParceiro} 
          size="xl" 
          aria-labelledby="contained-modal-title-vcenter" 
          centered
        >
            <Modal.Header style={{backgroundColor: "#00359A"}} closeButton closeVariant="white">
                <Modal.Title style={{color: "white"}}>Cadastrar parceiro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CadastroParceiro setShowParceiroModal={handleCloseModalParceiro}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalParceiro}>
                    Fechar
                </Button>
            </Modal.Footer>
      </Modal>
      <Modal 
          show={showDemandaModal} 
          onHide={handleOpenModalDemanda} 
          size="xl" 
          aria-labelledby="contained-modal-title-vcenter" 
          centered
        >
            <Modal.Header style={{backgroundColor: "#00359A"}} closeButton closeVariant="white">
                <Modal.Title style={{color: "white"}}>Cadastrar demanda</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CadastroDemandasComponent setShowDemandaModal={handleCloseModalDemanda}/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalDemanda}>
                    Fechar
                </Button>
            </Modal.Footer>
      </Modal>
    </>
  );
};

export default CriarProjetoComponent;
