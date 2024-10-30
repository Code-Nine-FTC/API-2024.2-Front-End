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

    const fetchMudancas = async () => {
        try {
            const result = await VisualizarMudancasFunction();
            if (result.data) {
                setDados(result.data);
                setFilteredDados(result.data);
                console.log(result.data);
            } else {
                throw new Error("Dados não encontrados.");
            }
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        // Chamada inicial
        fetchMudancas();

        // Configura o intervalo para buscar mudanças a cada 5 segundos
        const intervalId = setInterval(fetchMudancas, 30000);

        // Limpeza do intervalo ao desmontar o componente
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const filtered = dados.filter(dado =>
            dado.referenciaProjeto?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        console.log('Dados filtrados:', filtered); // Log dos dados filtrados
    
        setFilteredDados(filtered);
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
                                <h6 className="card-title">{dado.titulo_antigo || 'Título não disponível'}</h6>
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
                        {selectedDado?.referenciaProjeto || 'Referência não disponível'} - {selectedDado?.dataAlteracao ? new Date(selectedDado.dataAlteracao).toLocaleString() : 'Data não disponível'}
                    </Modal.Title>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {renderField('Título', selectedDado?.titulo_antigo, selectedDado?.titulo_novo)}
                    {renderField('Contratante', selectedDado?.contratante_antigo, selectedDado?.contratante_novo)}
                    {renderField('Descrição', selectedDado?.descricao_antiga, selectedDado?.descricao_novo)}
                    {renderField('Valor', selectedDado?.valor_antigo != null ? `R$ ${selectedDado.valor_antigo.toFixed(2)}` : null, selectedDado?.valor_novo != null ? `R$ ${selectedDado.valor_novo.toFixed(2)}` : null)}
                    {renderField('Data de Início', 
                        selectedDado?.dataInicio_antiga ? new Date(selectedDado.dataInicio_antiga as string).toLocaleDateString() : null, 
                        selectedDado?.dataInicio_novo ? new Date(selectedDado.dataInicio_novo as string).toLocaleDateString() : null
                    )}
                    {renderField('Data de Término', 
                        selectedDado?.dataTermino_antiga ? new Date(selectedDado.dataTermino_antiga as string).toLocaleDateString() : null, 
                        selectedDado?.dataTermino_novo ? new Date(selectedDado.dataTermino_novo as string).toLocaleDateString() : null
                    )} 
                    {renderField('Integrantes', selectedDado?.integrantes_antigos || 'N/A', selectedDado?.integrantes_novo || null)} 
                    {renderField('Links', selectedDado?.links_antigos || 'N/A', selectedDado?.links_novo || null)}
                    {renderField('Objetivo', selectedDado?.objetivo_antigo || 'N/A', selectedDado?.objetivo_novo || null)}
                    {renderField('Status', selectedDado?.status_antigo || 'N/A', selectedDado?.status_novo || null)}
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
