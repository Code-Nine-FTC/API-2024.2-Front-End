import { useNavigate } from "react-router";
import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import { VisualizarBolsista } from "../../../interface/bolsistas.interface";
import VisualizarBolsistaService from "../../../services/bolsista/visualizarBolsistaService";
import EditarBolsistaService from "../../../services/bolsista/editarBolsistaService";
import ExcluirBolsista from "../../../services/bolsista/excluirBolsistaService";
import styles from "./visualizarBolsistas.module.css";
interface visualizarbolsistaprops {
    idbolsista: number;
}

const VisualizarBolsistaComponent: React.FC <visualizarbolsistaprops> = ({idbolsista}) => {
    const [bolsistaOriginal, setBolsistaOriginal] = useState<VisualizarBolsista | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [nome, setNome] = useState(bolsistaOriginal?.nome || '');
    const [documento, setDocumento] = useState(bolsistaOriginal?.documento || '');
    const [rg, setRG] = useState(bolsistaOriginal?.rg || '');
    const [tipoBolsa, setTipoBolsa] = useState(bolsistaOriginal?.tipoBolsa || '');
    const [duracaoBolsa, setDuracaoBolsa] = useState(bolsistaOriginal?.duracao || '');
    const [areaAtuacao, setAreaAtuacao] = useState(bolsistaOriginal?.areaAtuacao || '');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchBolsista = async () => {
            try {
                const response = await VisualizarBolsistaService(idbolsista);
                if (response.status === 200) {
                    setBolsistaOriginal(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError('Erro ao carregar os dados do bolsista');
            } finally {
                setLoading(false);
            }
        }
        fetchBolsista();

    }, [idbolsista]);

    useEffect(() => {
    if (bolsistaOriginal) {
        setNome(bolsistaOriginal.nome);
        setDocumento(bolsistaOriginal.documento);
        setRG(bolsistaOriginal.rg);
        setTipoBolsa(bolsistaOriginal.tipoBolsa);
        setDuracaoBolsa(bolsistaOriginal.duracao);
        setAreaAtuacao(bolsistaOriginal.areaAtuacao);
    } 
}, [bolsistaOriginal]);

const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/bolsista/visualizar/${id}`);
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const camposEditados = {
        nome: nome,
        documento: documento,
        rg: rg,
        tipoBolsa: tipoBolsa,
        duracao: duracaoBolsa,
        areaAtuacao: areaAtuacao,
    }

    console.log("camposEditados:", camposEditados);

    const FormData = {
    nome: camposEditados.nome,
    documento: camposEditados.documento,
    rg: camposEditados.rg,
    tipoBolsa: camposEditados.tipoBolsa,
    duracao: camposEditados.duracao,
    areaAtuacao: camposEditados.areaAtuacao,
};
    try {
        const response = await EditarBolsistaService(FormData,idbolsista);
        console.log(response)
        if (response.status === 201) {
          SweetAlert2.fire({
            title: "Sucesso!",
            text: "Bolsista atualizado com sucesso.",
            icon: "success",
        }).then(() => {
            navigate(`/listagemBolsistas`);
            setIsEditing(false);
        });
      }
      else {
        setError(response.message);
      }
    } catch (error) {
        setError('Erro ao atualizar os dados do bolsista');
    }
}

const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir o bolsita?",
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
          const exclusaoBolsista = await ExcluirBolsista(id);
          if (exclusaoBolsista.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoBolsista.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir o Bolsista. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir Bolsista", error);
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

  if (!bolsistaOriginal) {
    return <Alert variant="warning">Bolsista não encontrado</Alert>;
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
        <h1 className="titulo">{bolsistaOriginal.nome}</h1>
        {!isEditing && (<div className={styles.editarExcluir}>
            <Button variant="primary" onClick={handleEditar} className="mt-3">
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(idbolsista)}
              className="mt-3"
            >
              Deletar
            </Button>
          </div>
        )}
        </div>
        <section className={styles.formMain}>
      <Form onSubmit={handleSubmit}>
      <FloatingLabel controlId="validationCustom01" label="Nome" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Nome do Bolsista"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o nome do bolsista.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Documento" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="CPF ou CNPJ"
              required
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o cpf ou cnpj do bolsista.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="rg" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="RG do Bolsista"
              required
              value={rg}
              onChange={(e) => setRG(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o rg do bolsista.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="tipo" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Tipo Bolsa"
              required
              value={tipoBolsa}
              onChange={(e) => setTipoBolsa(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o tipo da bolsa.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Duracao" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Durçao da Bolsa"
              required
              value={duracaoBolsa}
              onChange={(e) => setDuracaoBolsa(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a duração da bolsa.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Area" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1 }}>
            <Form.Control
              type="text"
              placeholder="Área de Atuação"
              required
              value={areaAtuacao}
              onChange={(e) => setAreaAtuacao(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a área de atuação do bolsista.
            </Form.Control.Feedback>
          </FloatingLabel>

       {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(idbolsista)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
      </section>
    </>
)

}
export default VisualizarBolsistaComponent;