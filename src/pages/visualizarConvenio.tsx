import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VisualizarConvenioComponent from '../component/listagens/convenio/visualizarConvenio';

const VisualizaConvenioPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    return (
      <div>
        {id ? (
          <VisualizarConvenioComponent idConvenio={Number(id)}/>
        ) : (
          <p>ID do Convenio não fornecido</p>
        )}
      </div>
    );
  };

export default VisualizaConvenioPage;