import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  id: number; // ID do projeto a ser editado
}

const EditarProjeto: React.FC<EditarProjetoProps> = ({ id }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);

  // Fetch do projeto atual para preencher os campos
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

  // Função para lidar com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (projeto) {
        await axios.put(`jdbc:mysql://localhost:3306/projetotrasparencia/${id}`, projeto);
        setSucesso('Projeto atualizado com sucesso!');
      }
    } catch (error) {
      setError('Erro ao atualizar o projeto');
    }
  };

  // Função para atualizar os valores dos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjeto((prevProjeto) => prevProjeto ? { ...prevProjeto, [name]: value } : null);
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
      </form>
    </div>
  );
};

export default EditarProjeto;
