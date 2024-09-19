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

interface MostrarProjetoProps {
  id: number; // ID do projeto que será passado como prop
}

const MostrarProjeto: React.FC<MostrarProjetoProps> = ({ id }) => {
  const [projeto, setProjeto] = useState<Projeto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const response = await axios.get<Projeto>(`jdbc:mysql://localhost:3306/projetotrasparencia`);
        setProjeto(response.data);
      } catch (error) {
        setError('Erro ao carregar os dados do projeto');
      } finally {
        setLoading(false);
      }
    };

    fetchProjeto();
  }, [id]);

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
      <h2>{projeto.titulo}</h2>
      <p><strong>ID:</strong> {projeto.id}</p>
      <p><strong>Referência:</strong> {projeto.referencia}</p>
      <p><strong>Empresa:</strong> {projeto.empresa}</p>
      <p><strong>Objeto:</strong> {projeto.objeto}</p>
      <p><strong>Descrição:</strong> {projeto.descricao}</p>
      <p><strong>Coordenador:</strong> {projeto.coordenador}</p>
      <p><strong>Data de Início:</strong> {new Date(projeto.dt_inicio).toLocaleDateString()}</p>
      <p><strong>Data de Fim:</strong> {new Date(projeto.dt_fim).toLocaleDateString()}</p>

      {/* Links para download dos arquivos PDF e Excel */}
      <div>
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
    </div>
  );
};

export default MostrarProjeto;
