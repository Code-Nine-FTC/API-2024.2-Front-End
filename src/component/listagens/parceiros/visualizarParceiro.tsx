import { useNavigate } from "react-router";
import React, { useEffect, useState, SetStateAction, Dispatch } from "react";
import { Button, Form, Alert, Spinner, FloatingLabel, InputGroup, Modal, Card } from "react-bootstrap";
import SweetAlert2 from "sweetalert2";
import ExcluirParceiro from "../../../services/parceiro/excluirParceiroService";
import EditarParceiroService from "../../../services/parceiro/editarParceiroService";
import VisualizarParceiroService from "../../../services/parceiro/visualizarParceiroService";
import styles from "./listagemParceiros.module.css";
import { VisualizarParceiro } from "../../../interface/parceiro.interface";

interface visualizarparceiroprops {
    idparceiro: number;
}

const VisualizarParceiroComponent: React.FC <visualizarparceiroprops> = ({idparceiro}) => {
    const [parceiroOriginal, setParceiroOriginal] = useState<VisualizarParceiro | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [nome, setNome] = useState(parceiroOriginal?.nome || '');
    const [cnpj, setCnpj] = useState(parceiroOriginal?.cnpj || '');
    const [email, setEmail] = useState(parceiroOriginal?.email || '');
    const [telefone, setTelefone] = useState(parceiroOriginal?.telefone|| '');
    const [areaColaboracao, setAreaColaboracao] = useState(parceiroOriginal?.areaColaboracao || '');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchParceiro = async () => {
            try {
                const response = await VisualizarParceiroService(idparceiro);
                if (response.status === 200) {
                    setParceiroOriginal(response.data);
                } else {
                    setError(response.message);
                }
            } catch (error) {
                setError('Erro ao carregar os dados do parceiro');
            } finally {
                setLoading(false);
            }
        }
        fetchParceiro();

    }, [idparceiro]);

    useEffect(() => {
    if (parceiroOriginal) {
        setNome(parceiroOriginal.nome);
        setCnpj(parceiroOriginal.cnpj);
        setEmail(parceiroOriginal.email);
        setTelefone(parceiroOriginal.telefone);
        setAreaColaboracao(parceiroOriginal.areaColaboracao);
    } 
}, [parceiroOriginal]);

const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/parceiro/visualizar/${id}`);
  };

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const camposEditados = {
        nome: nome,
        cnpj: cnpj,
        email: email,
        telefone: telefone,
        areaColaboracao: areaColaboracao,
    }

    console.log("camposEditados:", camposEditados);

    const FormData = {
    nome: camposEditados.nome,
    cnpj: camposEditados.cnpj,
    email: camposEditados.email,
    telefone: camposEditados.telefone,
    areaColaboracao: camposEditados.areaColaboracao,
};
    try {
        const response = await EditarParceiroService(FormData,idparceiro);
        console.log(response)
        if (response.status === 201) {
          SweetAlert2.fire({
            title: "Sucesso!",
            text: "Parceiro atualizado com sucesso.",
            icon: "success",
        }).then(() => {
            navigate(`/listagemParceiros`);
            setIsEditing(false);
        });
      }
      else {
        setError(response.message);
      }
    } catch (error) {
        setError('Erro ao atualizar os dados do parceiro');
    }
}

const handleDelete = async (id: number) => {
    SweetAlert2.fire({
      title: "Tem certeza que deseja excluir o parceiro?",
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
          const exclusaoParceiro = await ExcluirParceiro(id);
          if (exclusaoParceiro.status === 200) {
            navigate("/");
            SweetAlert2.fire({
              icon: "success",
              title: exclusaoParceiro.data,
            });
          }
        } catch (error: any) {
          let errorMessage =
            error.message ||
            "Erro ao excluir o Parceiro. Por favor, tente novamente mais tarde.";
          console.error("Erro ao excluir Parceiro", error);
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

  if (!parceiroOriginal) {
    return <Alert variant="warning">Parceiro não encontrado</Alert>;
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
        <h1 className="titulo">{parceiroOriginal.nome}</h1>
        {!isEditing && (<div className={styles.editarExcluir}>
            <Button variant="primary" onClick={handleEditar} className="mt-3">
              Editar
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(idparceiro)}
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
      <FloatingLabel controlId="validationCustom01" label="Nome" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Nome do Parceiro"
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
              Por favor, insira o nome do parceiro.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Cnpj" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="CNPJ"
              required
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o cnpj do parceiro.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Email" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Email do Parceiro"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o email do parceiro.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Telefone" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Telefone do Parceiro"
              required
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira o telefone do parceiro.
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel controlId="validationCustom01" label="Área de Colaboração" className="flex-grow-1" style={{ color: "#9C9C9C", zIndex: 1, width: '60%', marginBottom: '1%' }}>
            <Form.Control
              type="text"
              placeholder="Durçao da Bolsa"
              required
              value={areaColaboracao}
              onChange={(e) => setAreaColaboracao(e.target.value)}
              readOnly={!isEditing}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            />
            <Form.Control.Feedback type="invalid">
              Por favor, insira a Área de Colaboração.
            </Form.Control.Feedback>
          </FloatingLabel>


       {isEditing && (
          <div className={styles.botoesSalvarVoltar}>
            <Button type="submit" variant="primary">
              Salvar Alterações
            </Button>

            <Button variant="secondary" onClick={() => handleBack(idparceiro)}>
              Descartar Alterações
            </Button>
          </div>
        )}
      </Form>
      </section>
    </>
)

}
export default VisualizarParceiroComponent;