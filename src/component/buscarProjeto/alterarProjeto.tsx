import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MontarFormDataCadastro from "../../services/projeto/montarFormDataProjetoService";
import {
  Button,
  FloatingLabel,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";

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

interface EditarProjetoProps {
  id: number;
}

const EditarProjeto: React.FC<EditarProjetoProps> = ({ id }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resumoPdf, setResumoPdf] = useState<File | null>(null);
  const [resumoExcel, setResumoExcel] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await axios.get(`/projeto/visualizar/${id}`);
        setProjeto(response.data);
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
      prevProjeto ? { ...prevProjeto, [name]: value } : null
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      if (name === "resumoPdf") setResumoPdf(files[0]);
      if (name === "resumoExcel") setResumoExcel(files[0]);
    }
  };

  const handleDiscardChanges = () => {
    navigate(`/projeto/visualizar/${id}`);
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (projeto) {
      // Conversão do 'id' de number para string antes de passar para MontarFormDataCadastro
      const projetoEditado = {
        ...projeto,
        id: projeto.id.toString(), // Conversão do id para string
      };

      const formData = MontarFormDataCadastro(
        projetoEditado,
        "edicao",
        resumoExcel ? resumoExcel : undefined,
        resumoPdf ? resumoPdf : undefined
      );

      try {
        const resposta = await api.post(`/projeto/atualizar/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (resposta.status === 200) {
          console.log("Projeto atualizado com sucesso", resposta.data);
          navigate("/projetos"); // Redirecionar após a atualização bem-sucedida
        } else {
          setError("Erro ao atualizar o projeto");
        }
      } catch (error) {
        setError("Erro ao atualizar o projeto");
      }
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!projeto) {
    return <p>Projeto não encontrado</p>;
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <FloatingLabel label="Título" className="mb-3">
          <FormControl
            type="text"
            name="titulo"
            value={projeto.titulo}
            onChange={handleChange}
            placeholder="Título"
          />
        </FloatingLabel>

        <FloatingLabel label="Referência" className="mb-3">
          <FormControl
            type="text"
            name="referencia"
            value={projeto.referencia}
            onChange={handleChange}
            placeholder="Referência"
          />
        </FloatingLabel>

        <FloatingLabel label="Empresa" className="mb-3">
          <FormControl
            type="text"
            name="empresa"
            value={projeto.empresa}
            onChange={handleChange}
            placeholder="Empresa"
          />
        </FloatingLabel>

        <FloatingLabel label="Objeto" className="mb-3">
          <FormControl
            type="text"
            name="objeto"
            value={projeto.objeto}
            onChange={handleChange}
            placeholder="Objeto"
          />
        </FloatingLabel>

        <FloatingLabel label="Descrição" className="mb-3">
          <FormControl
            as="textarea"
            name="descricao"
            value={projeto.descricao}
            onChange={handleChange}
            placeholder="Descrição"
          />
        </FloatingLabel>

        <FloatingLabel label="Coordenador" className="mb-3">
          <FormControl
            type="text"
            name="coordenador"
            value={projeto.coordenador}
            onChange={handleChange}
            placeholder="Coordenador"
          />
        </FloatingLabel>

        <InputGroup className="mb-3">
          <FormControl
            type="file"
            name="resumoPdf"
            onChange={handleFileChange}
          />
          <InputGroup.Text>Resumo (PDF)</InputGroup.Text>
        </InputGroup>

        <InputGroup className="mb-3">
          <FormControl
            type="file"
            name="resumoExcel"
            onChange={handleFileChange}
          />
          <InputGroup.Text>Resumo (Excel)</InputGroup.Text>
        </InputGroup>

        <Button variant="primary" type="submit">
          Atualizar Projeto
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={handleDiscardChanges}
        >
          Descartar alterações
        </Button>
      </Form>
    </div>
  );
};

export default EditarProjeto;
