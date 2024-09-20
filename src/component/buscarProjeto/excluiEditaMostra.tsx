import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const EditaExcluiMostra: React.FC<EditaExcluiMostraProps> = ({ id, isAdmin }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modo, setModo] = useState<'visualizar' | 'editar'>('visualizar');
  const [sucesso, setSucesso] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await axios.get<Projeto>(`jdbc:mysql://localhost:3306/projetotrasparencia/${id}`);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`jdbc:mysql://localhost:3306/projetotrasparencia/${id}`);
      navigate('/'); // Redireciona para a homepage após exclusão
    } catch (error) {
      setError('Erro ao excluir o projeto');
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
      <form onSubmit={handleSubmit}>
        <h2>{modo === 'visualizar' ? projeto.titulo : 'Editar Projeto'}</h2>

        <label htmlFor="titulo">Título</label>
        <input
          type="text"
          name="titulo"
          value={projeto.titulo}
          onChange={handleChange}
          readOnly={modo === 'visualizar'}
        />

        <label htmlFor="referencia">Referência</label>
        <input
          type="text"
          name="referencia"
          value={projeto.referencia}
          onChange={handleChange}
          readOnly={modo === 'visualizar'}
        />

        {modo === 'editar' && (
          <>
            <label htmlFor="empresa">Empresa</label>
            <input
              type="text"
              name="empresa"
              value={projeto.empresa}
              onChange={handleChange}
            />

            <label htmlFor="objeto">Objeto</label>
            <input
              type="text"
              name="objeto"
              value={projeto.objeto}
              onChange={handleChange}
            />

            <label htmlFor="descricao">Descrição</label>
            <textarea
              name="descricao"
              value={projeto.descricao}
              onChange={handleChange}
            />
          </>
        )}

        <label htmlFor="coordenador">Coordenador</label>
        <input
          type="text"
          name="coordenador"
          value={projeto.coordenador}
          onChange={handleChange}
          readOnly={modo === 'visualizar'}
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
            {modo === 'visualizar' ? (
              <>
                <button type="button" onClick={() => setModo('editar')}>Editar</button>
                <button type="button" onClick={handleDelete}>Excluir</button>
              </>
            ) : (
              <>
                <button type="submit">Salvar Alterações</button>
                <button type="button" onClick={() => setModo('visualizar')}>Cancelar</button>
              </>
            )}
          </div>
        )}

        {sucesso && <p>{sucesso}</p>}
      </form>
    </div>
  );
};

export default EditaExcluiMostra;
