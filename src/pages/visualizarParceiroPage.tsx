import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VisualizarParceiroComponent from '../component/listagens/parceiros/visualizarParceiro';

const VisualizaParceiroPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
      <div>
        {id ? (
          <VisualizarParceiroComponent idparceiro={Number(id)}/>
        ) : (
          <p>ID do Parceiro não fornecido</p>
        )}
      </div>
    );
  };

export default VisualizaParceiroPage;