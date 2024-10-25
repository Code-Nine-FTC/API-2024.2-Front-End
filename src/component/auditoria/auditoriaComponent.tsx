import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import VisualizarMudancasFunction from '../../services/auditoria/vizualizarMudancasService';
import { Mudanca } from '../../interface/auditoria.interface';

interface AuditoriaComponentProps {
    projetoId?: string;
}

const AuditoriaComponent: React.FC<AuditoriaComponentProps> = ({ projetoId }) => {
    const [dados, setDados] = useState<Mudanca[]>([]);
    const [filteredDados, setFilteredDados] = useState<Mudanca[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedDado, setSelectedDado] = useState<Mudanca | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchMudancas = async () => {
            try {
                const result = await VisualizarMudancasFunction();
                setDados(result.data);
                setFilteredDados(result.data);
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchMudancas();
    }, []);

    useEffect(() => {
        setFilteredDados(
            dados.filter(dado =>
                dado.projeto.referencia?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, dados]);

    const renderField = (label: string, value: string | number | undefined | null) => {
        return value ? (
            <>
                <strong>{label}:</strong> {value}<br />
            </>
        ) : null;
    };

    const handleOpenModal = (dado: Mudanca) => {
        setSelectedDado(dado);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDado(null);
    };

    if (error) {
        return <div>Erro: {error}</div>;
    }

    return (
        <div>
            <h1 className="text-center">Auditoria</h1>
            <Form className="mb-4">
                <Form.Group controlId="search">
                    <Form.Control
                        type="text"
                        placeholder="Pesquisar por referência do projeto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form.Group>
            </Form>
            <div className="row">
                {filteredDados.map((dado) => (
                    <div className="col-md-4" key={dado.id}>
                        <div
                            className="card mb-4 shadow"
                            onClick={() => handleOpenModal(dado)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="card-body">
                                <h6 className="card-title">{dado.projeto.titulo || 'Título não disponível'}</h6>
                                <p className="card-text">{dado.evento || 'Evento não disponível'}</p>
                                <div className="d-flex justify-content-between">
                                    <small className="text-muted">
                                        {dado.data ? new Date(dado.data).toLocaleString() : 'Data não disponível'}
                                    </small>
                                    <small className="text-muted">{dado.usuario || 'Usuário não disponível'}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton style={{ backgroundColor: '#00359A', color: 'white' }}>
                    <Modal.Title>
                        {selectedDado?.projeto.referencia || 'Referência não disponível'} - {selectedDado?.data ? new Date(selectedDado.data).toLocaleString() : 'Data não disponível'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5>{selectedDado?.projeto.titulo || 'Título não disponível'} - {selectedDado?.usuario || 'Usuário não disponível'}</h5>
                    {renderField('Evento', selectedDado?.evento)}
                    {renderField('Descrição', selectedDado?.projeto.descricao)}
                    {renderField('Contratante', selectedDado?.projeto.contratante)}
                    {renderField('Valor', selectedDado?.projeto.valor != null ? `R$ ${selectedDado.projeto.valor.toFixed(2)}` : null)}
                    {renderField('Integrantes', selectedDado?.projeto.integrantes)}
                    {renderField('Status', selectedDado?.projeto.status)}
                    {renderField('Data de alteração', selectedDado?.data ? new Date(selectedDado.data).toLocaleString() : 'Data não disponível')}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" style={{ backgroundColor: '#00359A', borderColor: '#00359A' }} onClick={handleCloseModal}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AuditoriaComponent;
