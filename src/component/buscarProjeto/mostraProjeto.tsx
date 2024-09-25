import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MontarFormDataCadastro from "../../services/projeto/montarFormDataProjetoService";
import { Button, Form, Alert, Spinner } from "react-bootstrap";
import styles from "./mostraProjeto.module.css"; // Importe o CSS Module
import { getToken } from "../../services/auth";
interface Projeto {
  id: number;
  titulo: string;
  referencia: string;
  contratante: string;
  objeto: string;
  descricao: string;
  nomeCoordenador: string;
  dataInicio: string;
  dataTermino: string;
  valor: number;
  resumoPdfUrl: string; // Altere para string para download
  resumoExcelUrl: string; // Altere para string para download
  resumopropostaUrl: string; // Altere para string para download
  resumocontratoUrl: string; // Altere para string para download
}

interface EditaExcluiMostraProps {
  id: number;
  isAdmin: boolean;
}

const Mostra: React.FC<EditaExcluiMostraProps> = ({ id, isAdmin }) => {
  const [projeto, setProjeto] = useState<Projeto | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [resumoExcel, setResumoExcel] = useState<File | undefined>(undefined);
  const [resumoPdf, setResumoPdf] = useState<File | undefined>(undefined);
  const [resumocontrato, setResumocontrato] = useState<File | undefined>(
    undefined
  );
  const [resumoproposta, setResumoproposta] = useState<File | undefined>(
    undefined
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const url = api.getUri({ url: `/projeto/visualizar/${id}` });
        const response = await axios.get<Projeto>(url);
        setProjeto(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Erro ao carregar os dados do projeto");
      } finally {
        setLoading(false);
      }
    };
    fetchProjeto();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjeto((prevProjeto) =>
      prevProjeto ? { ...prevProjeto, [name]: value } : undefined
    );
  };

  const handleBack = (id: number) => {
    setIsEditing(false);
    navigate(`/projeto/visualizar/${id}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (projeto) {
      const projetoEditado = {
        ...projeto,
        id: projeto.id.toString(),
      };

      const formData = MontarFormDataCadastro(
        projetoEditado,
        "edicao",
        resumoExcel,
        resumoPdf,
        resumoproposta,
        resumocontrato
      );
      try {
        console.log(getToken());
        const resposta = await api.put(`/projeto/atualizar/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (resposta.status === 200) {
          setIsEditing(false);
        } else {
          setError("Erro ao atualizar o projeto");
        }
      } catch (error) {
        setError("Erro ao atualizar o projeto");
      }
    }
  };

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

  return (
    <div className={styles.formMain}>
      <Form onSubmit={handleSubmit} className={styles.adicionarArquivos}>
        {/* Campos do projeto */}
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
          <Form.Label htmlFor="contratante">Contratante</Form.Label>
          <Form.Control
            type="text"
            name="contratante"
            value={projeto.contratante}
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
          <Form.Label htmlFor="valor">Valor</Form.Label>
          <Form.Control
            type="text"
            name="valor"
            value={projeto.valor}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="nomeCoordenador">Coordenador</Form.Label>
          <Form.Control
            type="text"
            name="nomeCoordenador"
            value={projeto.nomeCoordenador}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dataInicio">Data de Início</Form.Label>
          <Form.Control
            type="date"
            name="dataInicio"
            value={projeto.dataInicio}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="dataTermino">Data de Fim</Form.Label>
          <Form.Control
            type="date"
            name="dataTermino"
            value={projeto.dataTermino}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </Form.Group>

        {/* Se está editando, exibe campos de upload de arquivos */}
        {isEditing && (
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
                name="resumoPdf"
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
        )}

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

      {isAdmin && !isEditing && (
        <div>
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
  );
};

export default Mostra;
