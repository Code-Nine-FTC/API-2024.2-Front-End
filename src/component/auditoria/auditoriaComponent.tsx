import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Container, Row, Col, FloatingLabel } from 'react-bootstrap';
import VisualizarMudancasFunction from '../../services/auditoria/vizualizarMudancasService';
import { Mudanca } from '../../interface/auditoria.interface';
import { Auditoria } from '../../interface/auditoria.interface';
import BaixarArquivo from '../../services/projeto/baixarArquivo';
import { parse, format } from 'date-fns';

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
            const result = projetoId
                ? await VisualizarMudancasFunction(projetoId)
                : await VisualizarMudancasFunction();
    
            if (result.data) {
                const dataArray = Array.isArray(result.data) ? result.data : [result.data];
                setDados(dataArray);
                setFilteredDados(dataArray);
                console.log(dataArray);
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
    

    const formatarData = (stringData: string) => {
        const [year, month, day] = stringData.split('-');
        const dataFormatada = `${day}/${month}/${year}`;
        return dataFormatada;
    }
    
const renderField = (label: string, oldValue: string | number | undefined | null , newValue: string | number | undefined | null ) => {
    return (
        <>
            <strong>{label}:</strong> {oldValue ? <span style={{ textDecoration: 'line-through', color: 'red' }}>{oldValue}</span> : 'N/A'} 
            {newValue ? <span style={{ color: 'green' }}> ➜ {newValue}</span> : null}
            <br />
        </>
    );
};
    const formatarValorBR = (valor: number | string): string => {
        if (valor === null || valor === undefined) return "Valor Indisponível";
        // Verifica se o valor é uma string e faz a substituição da vírgula para ponto para conversão
        let numero =
        typeof valor === "string"
            ? parseFloat(valor.replace(/\./g, "").replace(",", "."))
            : valor;
        // Se a conversão não resultar em um número válido, retorna "0,00"
        if (isNaN(numero)) return "Valor Inválido";
        // Retorna o número formatado com vírgula separando os decimais
        return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        }).format(numero);
    };

    const handleOpenModal = (dado: Auditoria) => {
        setSelectedDado(dado);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDado(null);
    };

    const handleBaixar = async (id: number, nome: string) => {
        try {
          await BaixarArquivo(id, nome);
        } catch (error) {
          console.error("Erro ao baixar o arquivo", error);
            setError("Erro ao baixar arquivo"+error);
          };
        }

    const renderTipoAuditoria = (tipoAuditoria: string) => {
        switch (tipoAuditoria) {
            case 'Atualização':
                return (
                    <>
                        {selectedDado?.titulo_novo && renderField('Título', selectedDado?.titulo_antigo, selectedDado?.titulo_novo)}
                        {selectedDado?.contratante_novo && renderField('Contratante', selectedDado?.contratante_antigo, selectedDado?.contratante_novo)}
                        {selectedDado?.descricao_novo && renderField('Descrição', selectedDado?.descricao_antiga, selectedDado?.descricao_novo)}
                        {selectedDado?.valor_novo && renderField('Valor', selectedDado?.valor_antigo != null ? `${formatarValorBR(selectedDado?.valor_antigo)}` : null, selectedDado?.valor_novo != null ? `${formatarValorBR(selectedDado?.valor_novo)}` : null)}
                        {selectedDado?.dataInicio_novo && renderField('Data de Início', 
                            selectedDado?.dataInicio_antiga ? formatarData(selectedDado.dataInicio_antiga) : null, 
                            selectedDado?.dataInicio_novo ? formatarData(selectedDado.dataInicio_novo) : null
                        )}
                        {selectedDado?.dataTermino_novo && renderField('Data de Término', 
                            selectedDado?.dataTermino_antiga ? formatarData(selectedDado.dataTermino_antiga) : null, 
                            selectedDado?.dataTermino_novo ? formatarData(selectedDado.dataTermino_novo) : null
                        )} 
                        {selectedDado?.integrantes_novo && renderField('Integrantes', selectedDado?.integrantes_antigos || 'N/A', selectedDado?.integrantes_novo || null)} 
                        {selectedDado?.links_novo && renderField('Links', selectedDado?.links_antigos || 'N/A', selectedDado?.links_novo || null)}
                        {selectedDado?.objetivo_novo && renderField('Objetivo', selectedDado?.objetivo_antigo || 'N/A', selectedDado?.objetivo_novo || null)}
                        {selectedDado?.status_novo && renderField('Status', selectedDado?.status_antigo || 'N/A', selectedDado?.status_novo || null)}
                        {selectedDado?.documentos_novo && selectedDado.documentos_novo.length > 0 ? (
                            <>
                                <strong>Documentos adicionados:</strong>
                                <ul>
                                    {selectedDado?.documentos_novo.map((doc) => (
                                        <>
                                            <span style={{ color: 'green', cursor: 'pointer'}} onClick={() => handleBaixar(doc.id, doc.nome)}> {doc.nome} </span>
                                            <br />
                                        </>
                                    ))}
                                </ul>
                            </>
                        ): null}
                    </>
                )
                case 'Cadastro':
            // Exibe apenas os campos novos
            return (
                <>
                    <h4><strong>Cadastro de um Novo Projeto</strong></h4>
                    {selectedDado?.titulo_novo && renderField('Título', null, selectedDado?.titulo_novo)}
                    {/* {selectedDado?.titulo_novo && <p><strong>Título:</strong> {selectedDado?.titulo_novo}</p>} */}
                    {selectedDado?.referenciaProjeto && renderField('Referência', null, selectedDado?.referenciaProjeto)}
                    {selectedDado?.contratante_novo && renderField('Contratante', null, selectedDado?.contratante_novo)}
                    {selectedDado?.descricao_novo && renderField('Descrição', null, selectedDado?.descricao_novo)}
                    {selectedDado?.valor_novo && renderField('Valor', null, selectedDado?.valor_novo != null ? `${formatarValorBR(selectedDado?.valor_novo)}` : null)}
                    {selectedDado?.dataInicio_novo && renderField('Data de Início', 
                            null, 
                            selectedDado?.dataInicio_novo ? formatarData(selectedDado.dataInicio_novo) : null
                        )}
                        {selectedDado?.dataTermino_novo && renderField('Data de Término', 
                            null, 
                            selectedDado?.dataTermino_novo ? formatarData(selectedDado.dataTermino_novo) : null
                        )} 
                    {selectedDado?.status_novo && renderField('Status', null, selectedDado?.status_novo || null)}
                    {selectedDado?.integrantes_novo && renderField('Integrantes', null, selectedDado?.integrantes_novo || null)} 
                    {selectedDado?.links_novo && renderField('Links', null, selectedDado?.links_novo || null)}
                </>
            );

            case 'Exclusão':
                return (
                    <>
                        <h4><strong>Exclusão de um projeto</strong></h4>
                        {selectedDado?.titulo_antigo && renderField('Título', selectedDado?.titulo_antigo, null)}
                        {/* {selectedDado?.titulo_novo && <p><strong>Título:</strong> {selectedDado?.titulo_novo}</p>} */}
                        {selectedDado?.referenciaProjeto && renderField('Referência', selectedDado?.referenciaProjeto, null)}
                        {selectedDado?.contratante_antigo && renderField('Contratante', selectedDado?.contratante_antigo, null)}
                        {selectedDado?.descricao_antiga && renderField('Descrição', selectedDado?.descricao_antiga, null)}
                        {selectedDado?.valor_antigo && renderField('Valor', selectedDado?.valor_antigo != null ? `${formatarValorBR(selectedDado?.valor_antigo)}` : null, null)}
                        {selectedDado?.dataInicio_antiga && renderField('Data de Início', 
                                selectedDado?.dataInicio_antiga ? formatarData(selectedDado.dataInicio_antiga) : null, 
                                null
                            )}
                            {selectedDado?.dataTermino_antiga && renderField('Data de Término', 
                                selectedDado?.dataTermino_antiga ? formatarData(selectedDado.dataTermino_antiga) : null, 
                                null
                            )} 
                        {selectedDado?.status_antigo && renderField('Status', selectedDado?.status_antigo || null, null)}
                        {selectedDado?.integrantes_antigos && renderField('Integrantes', selectedDado?.integrantes_antigos || null, null)} 
                        {selectedDado?.links_antigos && renderField('Links', selectedDado?.links_antigos || null, null)}
                        {selectedDado?.documentos_novo && selectedDado.documentos_novo.length > 0 ? (
                            <>
                                <strong>Documentos:</strong>
                                <ul>
                                    {selectedDado?.documentos_novo.map((doc) => (
                                        <>
                                            <span style={{ color: 'red', cursor: 'pointer'}} onClick={() => handleBaixar(doc.id, doc.nome)}> {doc.nome} </span>
                                            <br />
                                        </>
                                    ))}
                                </ul>
                            </>
                        ): null}
                    </>
                );
            case 'Exclusão de arquivo':
                return (
                    <>
                        <strong>Documento excluído:</strong>
                            <ul>
                                {selectedDado?.documentos_novo.map((doc) => (
                                    <>
                                        <span style={{ color: 'red', cursor: 'pointer'}} onClick={() => handleBaixar(doc.id, doc.nome)}> {doc.nome} </span>
                                        <br />
                                    </>
                                ))}
                            </ul>
                    </>
                )
            default:
                return <strong>Evento não disponível</strong>;
        }
    }

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
                                    padding: "0",
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
                                {dado.tipoAuditoria === 'Cadastro' ? (
                                    <h6 className="card-title">{dado.titulo_novo || 'Título não disponível'}</h6>) :
                                    (<h6 className="card-title">{dado.titulo_antigo || 'Título não disponível'}</h6>
                                )}
                                <p className="card-text">{dado.tipoAuditoria || 'Evento não disponível'}</p>
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
                    {renderTipoAuditoria(selectedDado?.tipoAuditoria || '')}
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
