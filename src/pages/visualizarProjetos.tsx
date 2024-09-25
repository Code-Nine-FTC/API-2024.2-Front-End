import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Mostra from '../component/buscarProjeto/mostraProjeto';


const AlteraDeletaVisualiza: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id ? (
        <Mostra id={Number(id)}/>
      ) : (
        <p>ID do projeto não fornecido</p>
      )}
    </div>
  );
};

export default AlteraDeletaVisualiza;

