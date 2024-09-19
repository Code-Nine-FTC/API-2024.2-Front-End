import React from 'react';
import { useParams } from 'react-router-dom';
import EditaExcluiMostra from '../component/buscarProjeto/excluiEditaMostra';

const AlteraDeletaVisualiza: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id ? <EditaExcluiMostra id={parseInt(id)} /> : <p>ID do projeto não fornecido</p>}
    </div>
  );
};

export default AlteraDeletaVisualiza;
