import React from 'react';
import { useParams } from 'react-router-dom';
import MostrarProjeto from "../component/buscarProjeto/mostrarProjeto";

const BuscarProjeto = () => {
  // pega o id vindo da rota
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {id ? <MostrarProjeto id={parseInt(id)} /> : <p>ID do projeto não fornecido</p>}
    </div>
  );
};

export default BuscarProjeto;
