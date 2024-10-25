import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import VisualizarMudancasFunction from '../../services/auditoria/vizualizarMudancasService';
import { Mudanca } from '../../interface/auditoria.interface';

const AuditoriaComponent = () => {
    const [dados, setDados] = useState<Mudanca[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(()=>{
        const fetchMudancas = async () => {
            try {
                const result = await VisualizarMudancasFunction();
                setDados(result.data);
                console.log(dados)
            } catch (err) {
                setError((err as Error).message)
            }
        }

        fetchMudancas()
    }, [])

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return(
        <div>
            <h1>Lista de Mudanças</h1>
            <ul>
                {dados.map((dado) => (
                    <li key={dado.id}>
                        <strong>Evento:</strong> {dado.evento}<br />
                        <strong>Data:</strong> {new Date(dado.data).toLocaleString()}<br />
                        <strong>Projeto:</strong> {dado.projeto.titulo}<br />
                        {dado.projeto.descricao && (
                            <>
                                <strong>Descrição:</strong> {dado.projeto.descricao}<br />
                            </>
                        )}
                        <strong>Contratante:</strong> {dado.projeto.contratante}<br />
                        <strong>Status:</strong> {dado.projeto.status}<br />
                        <strong>Valor:</strong> R$ {dado.projeto.valor?.toFixed(2)}<br />
                        <strong>Integrantes:</strong> {dado.projeto.integrantes}<br />
                        {dado.projeto.links && (
                            <a href={dado.projeto.links} target="_blank" rel="noopener noreferrer">
                                Ver mais
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default AuditoriaComponent