import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import MontarFormDataCadastro from '../../services/projeto/montarFormDataProjetoService';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import styles from './mostraProjeto.module.css'; // Importe o CSS Module

interface Projeto {
  id: number;
  titulo: string;
  referencia: string;
  empresa: string;
  objeto: string;
  descricao: string;
  coordenador: string;
  dt_inicio: string;
  dt_fim: string;
  resumoPdfUrl: string;
  resumoExcelUrl: string;
}

interface EditaExcluiMostraProps {
  id: number;
  isAdmin: boolean;
}

const Mostra: React.FC<EditaExcluiMostraProps> = ({ id, isAdmin }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const url = api.getUri({ url: `/projeto/visualizar/${id}` });
        const response = await axios.get<Projeto>(url);
        setProjeto(response.data);
      } catch (error) {
        setError('Erro ao carregar os dados do projeto');
      } finally {
        setLoading(false);
      }
    };
    fetchProjeto();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjeto((prevProjeto) => (prevProjeto ? { ...prevProjeto, [name]: value } : null));
  };

  const handleDiscardChanges = () => {
    navigate(`/projeto/visualizar/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (projeto) {
      const projetoEditado = {
        ...projeto,
        id: projeto.id.toString(),
      };

      const formData = MontarFormDataCadastro(projetoEditado, "edicao");
      try {
        const resposta = await api.put(`/projeto/atualizar/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (resposta.status === 200) {
          navigate(`/projeto/visualizar/${id}`);
          setIsEditing(false);
        } else {
          setError('Erro ao atualizar o projeto');
        }
      } catch (error) {
        setError('Erro ao atualizar o projeto');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const url = api.getUri({ url: `projetos/${id}` });
      await axios.delete(`${url}`);
      navigate('/');
    } catch (error) {
      setError('Erro ao excluir o projeto');
    }
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

  if (!projeto) {
    return <Alert variant="warning">Projeto não encontrado</Alert>;
  }

  return (
    <div className={styles.formMain}>
      <Form onSubmit={handleSubmit} className={styles.adicionarArquivos}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="titulo">Título</Form.Label>
          <Form.Control
            type="text"
            name="titulo"
            value={projeto.titulo}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="referencia">Referência</Form.Label>
          <Form.Control
            type="text"
            name="referencia"
            value={projeto.referencia}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="empresa">Empresa</Form.Label>
          <Form.Control
            type="text"
            name="empresa"
            value={projeto.empresa}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="objeto">Objeto</Form.Label>
          <Form.Control
            type="text"
            name="objeto"
            value={projeto.objeto}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="descricao">Descrição</Form.Label>
          <Form.Control
            as="textarea"
            name="descricao"
            value={projeto.descricao}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="coordenador">Coordenador</Form.Label>
          <Form.Control
            type="text"
            name="coordenador"
            value={projeto.coordenador}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <div className={styles.arquivosEscolhidos}>
          <h3>Arquivos</h3>
          <p>
            <a href={projeto.resumoPdfUrl} target="_blank" rel="noopener noreferrer">
              Baixar Resumo (PDF)
            </a>
          </p>
          <p>
            <a href={projeto.resumoExcelUrl} target="_blank" rel="noopener noreferrer">
              Baixar Resumo (Excel)
            </a>
          </p>
        </div>

        {isAdmin && (
          <div className={styles.botaoEnviar}>
            {isEditing ? (
              <>
                <Button type="submit" variant="primary">Salvar</Button>
                <Button type="button" variant="secondary" onClick={handleDiscardChanges}>Cancelar</Button>
              </>
            ) : (
              <>
                <Button type="button" variant="warning" onClick={handleEditar}>Editar</Button>
                <Button type="button" variant="danger" onClick={handleDelete}>Excluir</Button>
              </>
            )}
          </div>
        )}
      </Form>
    </div>
  );
};

export default Mostra;
