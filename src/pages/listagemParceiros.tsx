import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaRegFileLines } from "react-icons/fa6";
import styles from '../component/home/Home.module.css';
import { getToken } from '../services/auth';
import { VisualizarParceiro } from '../interface/parceiro.interface';


const ListarParceiros: React.FC = () =>  {
    const [parceiros, setParceiros] = useState<VisualizarParceiro[]>([]); // Corrigido o tipo
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);

    const navegarParceiro = (parceiro: VisualizarParceiro) => {
        navigate(`/visualizarparceiro/${parceiro.id}`);
    };

    const fetchParceiro = async () => {
        setIsFetching(true);
        try {
            const response = await api.get("/parceiro/listar", {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }});
            setParceiros(response.data);
        } catch (error) {
            console.error("Erro ao buscar bolsistas:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchParceiro();
    }, []);

    return (
        <body>
            <p className={styles.titulo}>Resultados Encontrados</p>
            {isFetching ? (
                <p>Carregando...</p>
            ) : (
                parceiros.map((parceiro) => (
                    <div
                        key={parceiro.id}
                        className={styles.projeto}
                        onClick={() => navegarParceiro(parceiro)}
                    >
                        <FaRegFileLines style={{ fontSize: 34 }} />
                        <p>{parceiro.nome}</p>
                        <p>{parceiro.email}</p>
                        <p>{parceiro.telefone}</p>
                    </div>
                ))
            )}
        </body>
    );
};

export default ListarParceiros;