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
}

const EditaExcluiMostra: React.FC<EditaExcluiMostraProps> = ({ id }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modo, setModo] = useState<'visualizar' | 'editar' | 'deletar'>('visualizar');
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

  // Renderiza o modo de visualização
  if (modo === 'visualizar') {
    return (
      <div>
        <h2>{projeto.titulo}</h2>
        <p><strong>ID:</strong> {projeto.id}</p>
        <p><strong>Referência:</strong> {projeto.referencia}</p>
        <p><strong>Empresa:</strong> {projeto.empresa}</p>
        <p><strong>Objeto:</strong> {projeto.objeto}</p>
        <p><strong>Descrição:</strong> {projeto.descricao}</p>
        <p><strong>Coordenador:</strong> {projeto.coordenador}</p>
        <p><strong>Data de Início:</strong> {new Date(projeto.dt_inicio).toLocaleDateString()}</p>
        <p><strong>Data de Fim:</strong> {new Date(projeto.dt_fim).toLocaleDateString()}</p>

        <div>
          <h3>Arquivos</h3>
          <p><a href={projeto.resumoPdfUrl} target="_blank" rel="noopener noreferrer">Baixar Resumo (PDF)</a></p>
          <p><a href={projeto.resumoExcelUrl} target="_blank" rel="noopener noreferrer">Baixar Resumo (Excel)</a></p>
        </div>

        <button onClick={() => setModo('editar')}>Alterar</button>
        <button onClick={() => setModo('deletar')}>Excluir</button>
      </div>
    );
  }

  // Renderiza o modo de edição
  if (modo === 'editar') {
    return (
      <div>
        <h2>Editar Projeto</h2>
        {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Título:
            <input type="text" name="titulo" value={projeto.titulo} onChange={handleChange} />
          </label>
          <label>
            Referência:
            <input type="text" name="referencia" value={projeto.referencia} onChange={handleChange} />
          </label>
          <label>
            Empresa:
            <input type="text" name="empresa" value={projeto.empresa} onChange={handleChange} />
          </label>
          <label>
            Objeto:
            <input type="text" name="objeto" value={projeto.objeto} onChange={handleChange} />
          </label>
          <label>
            Descrição:
            <textarea name="descricao" value={projeto.descricao} onChange={handleChange} />
          </label>
          <label>
            Coordenador:
            <input type="text" name="coordenador" value={projeto.coordenador} onChange={handleChange} />
          </label>
          <label>
            Data de Início:
            <input type="date" name="dt_inicio" value={projeto.dt_inicio} onChange={handleChange} />
          </label>
          <label>
            Data de Fim:
            <input type="date" name="dt_fim" value={projeto.dt_fim} onChange={handleChange} />
          </label>
          <button type="submit">Salvar Alterações</button>
          <button onClick={() => setModo('visualizar')}>Cancelar</button>
        </form>
      </div>
    );
  }

  // Renderiza o modo de exclusão com mensagem de confirmação
  if (modo === 'deletar') {
    return (
      <div>
        <h2>Excluir Projeto</h2>
        <p>Tem certeza que deseja excluir o projeto com ID: {id}?</p>
        <button onClick={handleDelete}>Excluir Projeto</button>
        <button onClick={() => setModo('visualizar')}>Cancelar</button>
      </div>
    );
  }

  return null;
};

export default EditaExcluiMostra;
