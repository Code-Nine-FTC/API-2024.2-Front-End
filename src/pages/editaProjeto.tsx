import React from 'react';
import { useParams } from 'react-router-dom';
import EditarProjeto from '../component/buscarProjeto/alterarProjeto';

const AlteraDeletaEdita: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id ? (
        <EditarProjeto id={parseInt(id)} />
      ) : (
        <p>ID do projeto não fornecido</p>
      )}
    </div>
  );
};

export default AlteraDeletaEdita;