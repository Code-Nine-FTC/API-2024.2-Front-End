import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegFileLines } from "react-icons/fa6";
import styles from '../../../component/home/Home.module.css'; 
import { VisualizarDemanda } from '../../../interface/demanda.interface'; 
import { getToken } from '../../../services/auth'; 
import api from '../../../services/api';
import { Spinner, Alert } from 'react-bootstrap';

const ListagemDemandas: React.FC = () => {
    const [demandas, setDemandas] = useState<VisualizarDemanda[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const navegarDemanda = (demanda: VisualizarDemanda) => {
        navigate(`/visualizarDemanda/${demanda.id}`);
    };

    const fetchDemandas = async () => {
        setIsFetching(true);
        try {
            const response = await api.get("/classificacao-demanda/listar", {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });
            setDemandas(response.data);
        } catch (err) {
            console.error("Erro ao buscar demandas:", err);
            setError("Erro ao carregar as demandas.");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchDemandas();
    }, []);

    if (isFetching) {
        return (
            <div className={`${styles.container}`}>
                <Spinner animation="border" />
                <p>Carregando demandas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`${styles.container}`}>
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    return (
        <body>
            <p className={styles.titulo}>Resultados Encontrados</p>
            {isFetching ? (
                <p>Carregando...</p>
            ) : (
                demandas.map((demanda) => (
                    <div
                        key={demanda.id}
                        className={styles.projeto}
                        onClick={() => navegarDemanda(demanda)}
                    >
                    <FaRegFileLines style={{ fontSize: 34, marginRight: '10px' }} />
                        <p><strong>Descrição:</strong> {demanda.descricao}</p>
                        <p><strong>Status:</strong> {demanda.statusAtendimento}</p>
                        <p><strong>Tipo:</strong> {demanda.tipo}</p>
                        <p><strong>Prioridade:</strong> {demanda.prioridade}</p>
                    </div>
                ))
            )}
        </body>
    );
};

export default ListagemDemandas;


