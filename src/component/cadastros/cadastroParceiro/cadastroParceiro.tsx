import { Button, FloatingLabel, Form, InputGroup} from "react-bootstrap";
import React, { useState } from "react";
import Select, { MultiValue, ActionMeta } from "react-select";
import styles from "../../criarProjeto/criarProjeto.module.css";
import SweetAlert2 from "sweetalert2";
import { useNavigate } from "react-router-dom";
import CadastrarParceiro from "../../../services/projeto/cadastrar/cadastrarParceiroService";
import { VisualizarDemanda } from "../../../interface/demanda.interface";
import buscarDemandasService from "../../../services/buscar/buscarDemandasService";

interface CadastroParceiroProps {
  setShowParceiroModal?: (value: boolean) => void;
}

interface OptionType {
  value: number;
  label: string;
  demanda: VisualizarDemanda;
}

const CadastroParceiro = (props: CadastroParceiroProps) => {
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [cnpj, setCNPJ] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [areaColaboracao, setAreaColaboracao] = useState("");
  const [camposValidados, setValidado] = useState(false);
  const [demandas, setDemandas] = useState<VisualizarDemanda[]>([]);
  const [selectedDemandas, setSelectedDemandas] = useState<OptionType[]>([]);
  const [showDemandaModal, setShowDemandaModal] = useState<boolean>(false);

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
      classificacaoDemanda: selectedDemandas.map(option => option.demanda),
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

  async function buscarDemandas() {
    const resposta = await buscarDemandasService();
    if (resposta.status === 200) {
      setDemandas(resposta.data);
      console.log(resposta.data);
    } else {
      console.log(resposta.message);
    }
  }

  const handleDemandasChange = (
    selected: MultiValue<OptionType>,
    actionMeta: ActionMeta<OptionType>
  ) => {
    setSelectedDemandas(selected as OptionType[]);
  };

  const demandaOptions: OptionType[] = demandas.map((demanda) => ({
    value: demanda.id,
    label: demanda.descricao,
    demanda: demanda,
  }));

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      borderColor: "#ced4da",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#86b7fe",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#e9ecef",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#495057",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#495057",
      ":hover": {
        backgroundColor: "#ced4da",
        color: "#495057",
      },
    }),
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
                required
                onChange={(e) => setCNPJ(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o cnpj do parceiro.
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
                required
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
                required
                onChange={(e) => setTelefone(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Por favor, insira o telefone do parceiro.
              </Form.Control.Feedback>
            </FloatingLabel>
            </InputGroup>

            <InputGroup className="mb-3" onClick={buscarDemandas}>
              <FloatingLabel
                label=""
                controlId="validationCustomDemandas"
                className="flex-grow-1"
                style={{ color: "#9C9C9C", zIndex: 1 }}
              >
                <Select
                  styles={customStyles}
                  isMulti
                  options={demandaOptions}
                  value={selectedDemandas}
                  onChange={handleDemandasChange}
                  placeholder="Selecione as demandas"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => "Nenhuma opção disponível"}
                />
                <Form.Control.Feedback type="invalid">
                  Por favor, selecione pelo menos uma demanda.
                </Form.Control.Feedback>
              </FloatingLabel>
            </InputGroup>
            <Button
              variant="outline-secondary"
              onClick={() => setShowDemandaModal(true)}
              style={{ marginLeft: '10px' }}
            >
              Adicionar Demanda
            </Button>
          <div className={styles.botaoEnviar}>
            <Button type="submit">Enviar</Button>
          </div>
        </Form>
      </section>
    </>
  );
};

export default CadastroParceiro;
