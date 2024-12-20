import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaRegFileLines } from "react-icons/fa6";
import styles from '../component/home/Home.module.css';
import { ConvenioVisualizacao } from '../interface/cadastros/convenio.interface';
import { getToken } from '../services/auth';

const ListagemConvenio: React.FC = () => {
    const [convenios, setConvenios] = useState<ConvenioVisualizacao[]>([]); // Corrigido o tipo
    const navigate = useNavigate();
    const [isFetching, setIsFetching] = useState(false);

    const navegarConvenio = (convenio: ConvenioVisualizacao) => {
        navigate(`/visualizarConvenio/${convenio.id}`);
    };

    const fetchConvenios = async () => {
        setIsFetching(true);
        try {
            const response = await api.get("/convenio/listar", {
            headers: {
                Authorization: `Bearer ${getToken()} `
            }});
            setConvenios(Array.isArray(response.data) ? response.data : []);
            console.log(response.data)
        } catch (error) {
            console.error("Erro ao buscar convenios:", error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchConvenios();
    }, []);

    return (
        <body>
            <p className={styles.titulo}>Convenios</p>
            {isFetching ? (
                <p>Carregando...</p>
            ) : (
                convenios.reverse().map((convenio) => (
                    <div
                        key={convenio.id}
                        className={styles.projeto}
                        onClick={() => navegarConvenio(convenio)}
                    >
                        <FaRegFileLines style={{ fontSize: 34 }} />
                        <p>{convenio.nomeInstituicao}</p>
                        <p>Data inicial: {convenio.dataInicial}</p>
                        <p>Data final: {convenio.dataFinal}</p>
                    </div>
                ))
            )}
        </body>
    );
};

export default ListagemConvenio;
