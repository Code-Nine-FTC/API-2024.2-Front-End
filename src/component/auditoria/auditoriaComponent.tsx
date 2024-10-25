import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import VisualizarMudancasFunction from '../../services/auditoria/vizualizarMudancasService';
import { Mudanca } from '../../interface/auditoria.interface';

interface AuditoriaComponentProps {
    projetoId?: string;
}

const AuditoriaComponent: React.FC<AuditoriaComponentProps> = ({ projetoId }) => {
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

    const renderField = (label: string, value: string | number | undefined | null) => {
        return value ? (
            <>
                <strong>{label}:</strong> {value}<br />
            </>
        ) : null;
    };

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return(
        <div>
            <h1>Auditoria</h1>
            <ul>
                {dados.map((dado) => (
                    <li key={dado.id}>
                        {renderField('Evento', dado.evento)}
                        {renderField('Usuário', dado.usuario)}
                        {renderField('Data', new Date(dado.data).toLocaleString())}
                        {renderField('Projeto', dado.projeto.titulo || 'Título não disponível')}
                        {renderField('Descrição', dado.projeto.descricao)}
                        {renderField('Contratante', dado.projeto.contratante)}
                        {renderField('Valor', dado.projeto.valor != null ? `R$ ${dado.projeto.valor.toFixed(2)}` : null)}
                        {renderField('Integrantes', dado.projeto.integrantes)}
                        {renderField('Status', dado.projeto.status)}
                    </li>
                ))}
            </ul>
        </div>

    )
}

export default AuditoriaComponent