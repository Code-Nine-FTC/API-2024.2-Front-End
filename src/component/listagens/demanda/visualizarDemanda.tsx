import React, { useEffect, useState } from "react";
import { Button, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import SweetAlert2 from "sweetalert2";
import { VisualizarDemanda } from "../../../interface/demanda.interface"; // Corrigido o nome da interface
import ListarDemandasService from "../../../services/demanda/visualizarDemanda"; // Serviço para listar as demandas
import ExcluirDemandaService from "../../../services/demanda/excluirDemanda"; // Serviço para excluir uma demanda
import styles from "./listagemDemandas.module.css";

const ListagemDemandasComponent: React.FC = () => {
  const [demandas, setDemandas] = useState<VisualizarDemanda[]>([]); // Corrigido para VisualizarDemanda
  const [loading, setLoading] = useState<boolean>(true); // Estado de loading
  const [error, setError] = useState<string | null>(null); // Estado de erro
  const navigate = useNavigate(); // Navegação

  // Carrega as demandas ao carregar o componente
  useEffect(() => {
    const fetchDemandas = async () => {
      try {
        const response = await ListarDemandasService(); // Chama o serviço de listagem de demandas
        if (response.status === 200) {
          setDemandas(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError('Erro ao carregar as demandas');
      } finally {
        setLoading(false);
      }
    };
    fetchDemandas();
  }, []);

  // Função para excluir demanda
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
          const response = await ExcluirDemandaService(id);
          if (response.status === 200) {
            setDemandas(demandas.filter(demanda => demanda.id !== id)); // Remove a demanda da lista
            SweetAlert2.fire({
              icon: "success",
              title: "Demanda excluída com sucesso!",
            });
          } else {
            SweetAlert2.fire({
              icon: "error",
              title: "Erro ao excluir demanda",
              text: response.message,
            });
          }
        } catch (error) {
          SweetAlert2.fire({
            icon: "error",
            title: "Erro ao excluir demanda",
            text: "Erro ao excluir a demanda, tente novamente mais tarde.",
          });
        }
      }
    });
  };

  // Função para navegar até a tela de edição
  const handleEdit = (id: number) => {
    // Navega para a página de edição
    navigate(`/demanda/editar/${id}`);
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <div>
      <h1 className="titulo">Listagem de Demandas</h1>
      <Row>
        {demandas.map((demanda) => (
          <Col key={demanda.id} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title>{demanda.descricao}</Card.Title>
                <Card.Text>
                  <strong>Status:</strong> {demanda.statusAtendimento}
                  <br />
                  <strong>Tipo:</strong> {demanda.tipo}
                  <br />
                  <strong>Prioridade:</strong> {demanda.prioridade}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleEdit(demanda.id)}
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  className="ms-2"
                  onClick={() => handleDelete(demanda.id)}
                >
                  Excluir
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ListagemDemandasComponent;
