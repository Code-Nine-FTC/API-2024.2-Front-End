import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import BarGraph from './charts/bar';

const DashboardFormComponent = () => {
  const [contratante, setContratante] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [dataInicio, setDataInicio] = useState('02/01/2021');
  const [dataTermino, setDataTermino] = useState('08/07/2021');
  const [valorMinimo, setValorMinimo] = useState('');
  const [valorMaximo, setValorMaximo] = useState('');
  const [situacaoProjeto, setSituacaoProjeto] = useState('');
  const [tipoBusca, setTipoBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [erroMensagem, setErroMensagem] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dadosRequisicao: any = {
      ...(contratante && { contratante }),
      ...(coordenador && { coordenador }),
      ...(dataInicio && { dataInicio }),
      ...(dataTermino && { dataTermino }),
      ...(valorMinimo && { valorMinimo }),
      ...(valorMaximo && { valorMaximo }),
      ...(situacaoProjeto && situacaoProjeto !== '' && { situacaoProjeto }),
      ...(tipoBusca && { tipoBusca }),
    };
    try {
      console.log('Dados enviados:', dadosRequisicao);
      const resposta = await api.post('/projetos/search', dadosRequisicao);
      setResultados(resposta.data);
    } catch (erro) {
      console.error('Erro ao enviar os dados:', erro);
      setErroMensagem('Ocorreu um erro ao enviar os dados. Tente novamente.');
    }
  };

  const obterOpcoesTipoBusca = () => {
    switch (situacaoProjeto) {
      case 'Em andamento':
        return [
          { value: 'projetosEmAndamentoPorMes', label: 'Quantidade de projetos em andamento por mês' },
          { value: 'projetosEmAndamentoPorAno', label: 'Quantidade de projetos em andamento por ano' },
        ];
      case 'Concluído':
        return [
          { value: 'projetosConcluidosPorMes', label: 'Quantidade de projetos concluídos por mês' },
          { value: 'projetosConcluidosPorAno', label: 'Quantidade de projetos concluídos por ano' },
        ];
      case 'Todos':
        return [
          { value: 'todosProjetosPorMes', label: 'Todos os projetos por mês' },
          { value: 'todosProjetosPorAno', label: 'Todos os projetos por ano' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Dashboard</h2>
      <div className="card shadow-sm p-4" style={{ borderRadius: '10px' }}>
        <Form onSubmit={handleSubmit}>

          {erroMensagem && <div className="alert alert-danger">{erroMensagem}</div>}
     
          <Row className="mb-4">
            <Form.Group as={Col} controlId="floatingInput">
              <FloatingLabel controlId="floatingInput" label="Contratante" style={{ color: "#9C9C9C" }}>
                <Form.Control placeholder="Contratante" type="text" value={contratante} onChange={(e) => setContratante(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="floatingInput">
              <FloatingLabel controlId="floatingInput" label="Coordenador " style={{ color: "#9C9C9C" }} >
                <Form.Control placeholder="Coordenador" type="text" value={coordenador} onChange={(e) => setCoordenador(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="dataInicio" sm={6}>
              <FloatingLabel controlId="dataInicio" label="Data de início">
                <Form.Control type="text" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} controlId="dataTermino" sm={6}>
              <FloatingLabel controlId="dataTermino" label="Data de término">
                <Form.Control type="text" value={dataTermino} onChange={(e) => setDataTermino(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="valorMinimo" sm={6}>
              <FloatingLabel controlId="valorMinimo" label="Valor mínimo" style={{ color: "#9C9C9C" }}>
                <Form.Control placeholder="" type="text" value={valorMinimo} onChange={(e) => setValorMinimo(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} controlId="valorMaximo" sm={6}>
              <FloatingLabel controlId="valorMaximo" label="Valor máximo" style={{ color: "#9C9C9C" }}>
                <Form.Control placeholder="" type="text" value={valorMaximo} onChange={(e) => setValorMaximo(e.target.value)} />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="situacaoProjeto" sm={6}>
              <FloatingLabel controlId="situacaoProjeto" label="Situação do projeto">
                <Form.Select value={situacaoProjeto} onChange={(e) => setSituacaoProjeto(e.target.value)}>
                  <option value="" disabled>Selecione a situação (opcional)</option> 
                  <option>Em andamento</option>
                  <option>Concluído</option>
                  <option>Todos</option>
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
  
            <Form.Group as={Col} controlId="tipoBusca" sm={6}>
              <FloatingLabel controlId="tipoBusca" label="Tipo de busca">
                <Form.Select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
                  <option value="" disabled>Selecione o tipo de busca</option>
                  {obterOpcoesTipoBusca().map((opcao) => (
                    <option key={opcao.value} value={opcao.value}>
                      {opcao.label}
                    </option>
                  ))}
                </Form.Select>
              </FloatingLabel>
            </Form.Group>
          </Row>
          <Row>
            <Col className="text-center">
              <Button variant="secondary" type="submit">Gerar</Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div>
        <BarGraph />
      </div>
    </div>
  );
};

export default DashboardFormComponent;