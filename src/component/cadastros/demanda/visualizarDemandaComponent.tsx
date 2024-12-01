import { useNavigate } from "react-router";
import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import styles from "../../listagens/bolsistas/visualizarBolsistas.module.css";
import { VisualizarDemanda } from "../../../interface/demanda.interface";
import VisualizarDemandaService from "../../../services/demanda/buscarDemanda";
import ExcluirDemandaService from "../../../services/demanda/excluirDemanda";
import EditarDemandaService from "../../../services/demanda/editarDemanda";
interface VisualizarDemandaProps {
    idDemanda: number;
}

const VisualizarDemandaComponent: React.FC <VisualizarDemandaProps> = ({idDemanda}) => {
    const [demandaOriginal, setDemandaOriginal] = useState<VisualizarDemanda | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [descricao, setDescricao] = useState("");
    const [statusAtendimento, setStatusAtendimento] = useState("");
    const [tipo, setTipo] = useState("");
    const [prioridade, setPrioridade] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchDemanda = async () => {
            try {
                const response = await VisualizarDemandaService(idDemanda);
                if (response.status === 200) {
                    setDemandaOriginal(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError('Erro ao carregar os dados da demanda');
            } finally {
                setLoading(false);
            }
        }
        fetchDemanda();

    }, [idDemanda]);

    useEffect(() => {
    if (demandaOriginal) {
        setDescricao(demandaOriginal.descricao);
        setStatusAtendimento(demandaOriginal.statusAtendimento);
        setTipo(demandaOriginal.tipo);
        setPrioridade(demandaOriginal.prioridade);
    } 
}, [demandaOriginal]);

const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/bolsista/visualizar/${id}`);
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const camposEditados = {
        descricao: descricao,
        statusAtendimento: statusAtendimento,
        tipo: tipo,
        prioridade: prioridade,
    }

    console.log("camposEditados:", camposEditados);

    const FormData = {
    descricao: descricao,
    statusAtendimento: statusAtendimento,
    tipo: tipo,
    prioridade: prioridade
};
    try {
        const response = await EditarDemandaService(idDemanda, FormData);
        console.log(response)
        if (response.status === 200) {
          SweetAlert2.fire({
            title: "Sucesso!",
            text: "Demanda atualizada com sucesso.",
            icon: "success",
        }).then(() => {
            navigate(`/listagemDemandas`);
            setIsEditing(false);
        });
      }
      else {
        setError(response.message);
      }
    } catch (error) {
        setError('Erro ao atualizar os dados da demanda');
    }
}

const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir a demanda?",
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
          const exclusaoDemanda = await ExcluirDemandaService(id);
          if (exclusaoDemanda.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoDemanda.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir a demanda. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir demanda", error);
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

  if (!demandaOriginal) {
    return <Alert variant="warning">Demanda não encontrada</Alert>;
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
        <h1 className="titulo">{demandaOriginal.descricao}</h1>
        {!isEditing && (<div className={styles.editarExcluir}>
            <Button variant="primary" onClick={handleEditar} className="mt-3">
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(idDemanda)}
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
      <FloatingLabel controlId="validationCustom01" label="Descrição" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Descrição da demanda"
              required
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a descrição da demanda.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Status do atendimento" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
              <Form.Select
                aria-label="Selecione o status"
                value={statusAtendimento}
                onChange={(e) => setStatusAtendimento(e.target.value)}
                required
              >
                <option disabled value="">
                  Selecione o status
                </option>
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluído">Concluído</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, selecione o status do atendimento.
              </Form.Control.Feedback>
            </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Tipo" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Tipo"
              required
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o tipo da demanda.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Duracao" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Select>
                <option value="alta"></option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Por favor, insira a duração da bolsa.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Area" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
              <Form.Select
                aria-label="Selecione a prioridade"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                required
              >
                <option disabled value="">
                  Selecione a prioridade
                </option>
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Por favor, selecione a prioridade da demanda.
              </Form.Control.Feedback>
            </FloatingLabel>

       {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(idDemanda)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
      </section>
    </>
)

}
export default VisualizarDemandaComponent;