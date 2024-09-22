import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

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
  /* const [modo, setModo] = useState<'visualizar' | 'editar'>('visualizar'); */
  const [sucesso, setSucesso] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const url = api.getUri({url : `/projeto/visualizar/${id}`})
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
    setProjeto((prevProjeto) => prevProjeto ? { ...prevProjeto, [name]: value } : null);
  };

  /* const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (projeto) {
        await axios.put(`jdbc:mysql://localhost:3306/projetotrasparencia/${id}`, projeto);
        setSucesso('Projeto atualizado com sucesso!');
        setModo('visualizar');
      }
    } catch (error) {
      setError('Erro ao atualizar o projeto');
    }
  }; */

  const handleDelete = async () => {
    try {
      const url = api.getUri({url: `projetos/${id}`})
      await axios.delete(`${url}`);
      navigate('/'); 
    } catch (error) {
      setError('Erro ao excluir o projeto');
    }
  };

  const handleEditar = () => {
    navigate(`/projetos/atualizar/${id}`)
  }



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
      <form >
        <label htmlFor="titulo">Título</label>
        <input
          type="text"
          name="titulo"
          value={projeto.titulo}
          onChange={handleChange}
          readOnly
        />

        <label htmlFor="referencia">Referência</label>
        <input
          type="text"
          name="referencia"
          value={projeto.referencia}
          onChange={handleChange}
          readOnly
        />

            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={projeto.empresa}
              onChange={handleChange}
              readOnly
            />

            <label htmlFor="objeto">Objeto</label>
            <input
              type="text"
              name="objeto"
              value={projeto.objeto}
              onChange={handleChange}
              readOnly
            />

            <label htmlFor="descricao">Descrição</label>
            <textarea
              name="descricao"
              value={projeto.descricao}
              onChange={handleChange}
              readOnly
            />

        <label htmlFor="coordenador">Coordenador</label>
        <input
          type="text"
          name="coordenador"
          value={projeto.coordenador}
          onChange={handleChange}
          readOnly
        />

        <div>
          <h3>Arquivos</h3>
          <p>
            <a href={projeto.resumoPdfUrl} target="_blank" rel="noopener noreferrer">Baixar Resumo (PDF)</a>
          </p>
          <p>
            <a href={projeto.resumoExcelUrl} target="_blank" rel="noopener noreferrer">Baixar Resumo (Excel)</a>
          </p>
        </div>

        {isAdmin && (
          <div>
            
                <button type="button" onClick={handleEditar}>Editar</button>
                <button type="button" onClick={handleDelete}>Excluir</button>
          </div>
        )}

        {sucesso && <p>{sucesso}</p>}
      </form>
    </div>
  );
};

export default Mostra;
