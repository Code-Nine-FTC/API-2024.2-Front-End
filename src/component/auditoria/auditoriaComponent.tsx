import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import VisualizarMudancasFunction from '../../services/auditoria/vizualizarMudancasService';
import { Mudanca } from '../../interface/auditoria.interface';
import { Auditoria } from '../../interface/auditoria.interface';

interface AuditoriaComponentProps {
    projetoId?: string;
}

const AuditoriaComponent: React.FC<AuditoriaComponentProps> = ({ projetoId }) => {
    const [dados, setDados] = useState<Auditoria[]>([]);
    const [filteredDados, setFilteredDados] = useState<Auditoria[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [selectedDado, setSelectedDado] = useState<Auditoria | null>(null);
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
        }

        fetchMudancas();
    }, []);

    useEffect(() => {
        setFilteredDados(
            dados.filter(dado =>
                dado.referencia?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, dados]);
    

const renderField = (label: string, oldValue: string | number | undefined | null, newValue: string | number | undefined | null) => {
    return (
        <>
            <strong>{label}:</strong> {oldValue ? <span style={{ textDecoration: 'line-through', color: 'red' }}>{oldValue}</span> : 'N/A'} 
            {newValue ? <span style={{ color: 'green' }}> ➜ {newValue}</span> : null}
            <br />
        </>
    );
};

    const handleOpenModal = (dado: Auditoria) => {
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
            <Row className='justify-content-center my-4'>
                <h2 className="text-center">Auditoria</h2>
            </Row>

            {projetoId ? null : (
                <Container className="mb-4">
                    <Row className="justify-content-center mb-5">
                        <Col md={6}> {/* Ajusta a largura em telas médias */}
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Referência"
                                style={{
                                    color: "#9C9C9C",
                                    zIndex: 1,
                                    backgroundColor: "#fff",
                                    borderRadius: "8px",    
                                }}
                            >
                                <Form.Control
                                    type="text"
                                    placeholder="Palavra-chave"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        padding: '1rem'
                                    }}
                                />
                            </FloatingLabel>
                        </Col>
                    </Row>
                </Container>
            )}
            <div className="row">
                <div className="row justify-content-center">
                    {filteredDados.map((dado) => (
                        <div className="col-md-11" key={dado.id}>
                            <div
                                className="card mb-4"
                                onClick={() => handleOpenModal(dado)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-body">
                                <h6 className="card-title">{dado.tituloAntigo || 'Título não disponível'}</h6>
                                {/* <p className="card-text">{dado.evento || 'Evento não disponível'}</p> */}
                                    <div className="d-flex justify-content-between">
                                    <small className="text-muted">
                                            {dado.dataAlteracao ? new Date(dado.dataAlteracao).toLocaleString() : 'Data não disponível'}
                                        </small>
                                        <small className="text-muted">{dado.nomeCoordenador || 'Usuário não disponível'}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Modal 
                show={showModal} 
                onHide={handleCloseModal} 
                size='lg' 
                centered
            >
                <Modal.Header closeButton style={{ backgroundColor: '#00359A', color: 'white' }}>
                    <Modal.Title>
                    <Modal.Title>
                        {selectedDado?.referencia || 'Referência não disponível'} - {selectedDado?.dataAlteracao ? new Date(selectedDado.dataAlteracao).toLocaleString() : 'Data não disponível'}
                    </Modal.Title>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderField('Título', selectedDado?.tituloAntigo, selectedDado?.tituloNovo)}
                    {renderField('Contratante', selectedDado?.contratanteAntigo, selectedDado?.contratanteNovo)}
                    {renderField('Descrição', selectedDado?.descricaoAntiga, selectedDado?.descricaoNovo)}
                    {renderField('Valor', selectedDado?.valorAntigo != null ? `R$ ${selectedDado.valorAntigo.toFixed(2)}` : null, selectedDado?.valorNovo != null ? `R$ ${selectedDado.valorNovo.toFixed(2)}` : null)}
                    {renderField('Data de Início', selectedDado?.dataInicioAntiga ? new Date(selectedDado.dataInicioAntiga).toLocaleDateString() : null, selectedDado?.dataInicioNovo ? new Date(selectedDado.dataInicioNovo).toLocaleDateString() : null)}
                    {renderField('Data de Término', selectedDado?.dataTerminoAntiga ? new Date(selectedDado.dataTerminoAntiga).toLocaleDateString() : null, selectedDado?.dataTerminoNovo ? new Date(selectedDado.dataTerminoNovo).toLocaleDateString() : null)}
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
