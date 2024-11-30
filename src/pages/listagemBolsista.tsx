import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaRegFileLines } from "react-icons/fa6";
import styles from '../component/home/Home.module.css';
import { VisualizarBolsista } from '../interface/bolsistas.interface';
import { getToken } from '../services/auth';

const ListagemBolsistas: React.FC = () => {
    const [bolsistas, setBolsistas] = useState<VisualizarBolsista[]>([]); // Corrigido o tipo
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);

    const navegarBolsista = (bolsista: VisualizarBolsista) => {
        navigate(`/visualizarbolsista/${bolsista.id}`);
    };

    const fetchBolsistas = async () => {
        setIsFetching(true);
        try {
            const response = await api.get("/bolsista/listar", {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }});
            setBolsistas(response.data);
        } catch (error) {
            console.error("Erro ao buscar bolsistas:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchBolsistas();
    }, []);

    return (
        <body>
            <p className={styles.titulo}>Resultados Encontrados</p>
            {isFetching ? (
                <p>Carregando...</p>
            ) : (
                bolsistas.map((bolsista) => (
                    <div
                        key={bolsista.id}
                        className={styles.projeto}
                        onClick={() => navegarBolsista(bolsista)}
                    >
                        <FaRegFileLines style={{ fontSize: 34 }} />
                        <p>{bolsista.nome}</p>
                        <p>{bolsista.rg}</p>
                    </div>
                ))
            )}
        </body>
    );
};

export default ListagemBolsistas;
