import React from 'react';
import { useParams } from 'react-router-dom';
import EditarProjeto from '../component/buscarProjeto/alterarProjeto';

const AlteraDeletaEdita: React.FC = () => {
  const { projetoId } = useParams<{ projetoId: string }>();

  return (
    <div>
      {projetoId ? (
        <EditarProjeto id={parseInt(projetoId)} />
      ) : (
        <p>ID do projeto não fornecido</p>
      )}
    </div>
  );
};

export default AlteraDeletaEdita;