import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VisualizarBolsistaComponent from '../component/listagens/bolsistas/visualizarBolsista';

const VisualizaBolsistaPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
      <div>
        {id ? (
          <VisualizarBolsistaComponent idbolsista={Number(id)}/>
        ) : (
          <p>ID do Bolsista não fornecido</p>
        )}
      </div>
    );
  };

export default VisualizaBolsistaPage;