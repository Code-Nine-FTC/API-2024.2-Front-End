import React from 'react';
import { useParams } from 'react-router-dom';
import EditarProjeto from '../component/editarProjeto/editarProjeto';

const AlterarProjeto = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id ? <EditarProjeto id={parseInt(id)} /> : <p>ID do projeto não fornecido</p>}
    </div>
  );
};

export default AlterarProjeto;
