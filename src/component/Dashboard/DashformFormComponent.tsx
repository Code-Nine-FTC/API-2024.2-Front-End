import React, { useState } from 'react';
import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import BarGraph from './charts/bar';
import { getToken } from '../../services/auth';
import { ChartOptions } from 'chart.js';

const DashboardFormComponent = () => {
  const [contratante, setContratante] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [ano, setAno] = useState('Todos');
  const [valorMinimo, setValorMinimo] = useState('');
  const [valorMaximo, setValorMaximo] = useState('');
  const [situacaoProjeto, setSituacaoProjeto] = useState('Todos');
  const [resultados, setResultados] = useState([]);
  const [erroMensagem, setErroMensagem] = useState('');
   const [mostrarGrafico, setMostrarGrafico] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (valorMinimo && valorMaximo && parseFloat(valorMaximo) < parseFloat(valorMinimo)) {
      setErroMensagem('Valor máximo não pode ser menor que o valor mínimo.');
      return;
    }

    const anoAtual = new Date().getFullYear();
    let dataInicio = '';
    let dataTermino = '';

    if (ano === 'Todos') {
      dataInicio = '2000-01-01';
      dataTermino = new Date().toISOString().split('T')[0];
    } else if (ano) {
      dataInicio = `${ano}-01-01`;
      dataTermino = parseInt(ano) === anoAtual ? new Date().toISOString().split('T')[0] : `${ano}-12-31`;
    }

    const dadosRequisicao: any = {
      ...(contratante && { contratante }),
      ...(coordenador && { coordenador }),
      ...(dataInicio && { dataInicio }),
      ...(dataTermino && { dataTermino }),
      ...(valorMinimo && { valorMinimo }),
      ...(valorMaximo && { valorMaximo }),
      ...(situacaoProjeto && { situacaoProjeto }),
    };

    try {
      console.log('Dados enviados:', dadosRequisicao);
      const params = new URLSearchParams(dadosRequisicao).toString();
      const resposta = await api.get(`/dashboard/projetos/search?${params}`, {
          headers: {
              Authorization: `Bearer ${getToken()} `
          }
      });
      setResultados(resposta.data);
      setMostrarGrafico(true); 
      limparFormulario();
    } catch (erro) {
      console.error('Erro ao enviar os dados:', erro);
      setErroMensagem('Ocorreu um erro ao enviar os dados. Tente novamente.');
    }
  };

  const limparFormulario = () => {
    setContratante('');
    setCoordenador('');
    setAno('Todos');
    setValorMinimo('');
    setValorMaximo('');
    setSituacaoProjeto('Todos');
    setErroMensagem('');
  };

  const obterOpcoesAno = () => {
    const anoAtual = new Date().getFullYear();
    const anos = ['Todos'];

    for (let Ano = 2000; Ano <= anoAtual; Ano++) {
      anos.push(Ano.toString());
    }
    return anos;
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Dashboard</h2>
      <div className="card shadow-sm p-4" style={{ borderRadius: '10px' }}>
        <Form onSubmit={handleSubmit}>

          {erroMensagem && <div className="alert alert-danger">{erroMensagem}</div>}
     
          <Row className="mb-4 ">
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
            <Form.Group as={Col} controlId="ano">
              <FloatingLabel controlId="ano" label="Ano">
                <Form.Select value={ano} onChange={(e) => setAno(e.target.value)}>
                    {obterOpcoesAno().map((Ano) => (
                      <option key={Ano} value={Ano}>
                        {Ano}
                      </option>
                    ))}
                </Form.Select>
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
            <Form.Group as={Col} controlId="situacaoProjeto">
              <FloatingLabel controlId="situacaoProjeto" label="Situação do projeto">
                <Form.Select value={situacaoProjeto} onChange={(e) => setSituacaoProjeto(e.target.value)}>
                  <option>Em andamento</option>
                  <option>Concluído</option>
                  <option>Todos</option>
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

       {mostrarGrafico && (
        <div>
          <BarGraph
            options={{ responsive: true } as ChartOptions<'bar'>}
            data2={Array.isArray(resultados) ? resultados.map((projeto: any) => ({
              month: projeto.mes,
              value: projeto.valor
            })): []}
          />
        </div>
      )}
{/*       <div>
          <BarGraph
            options={{ responsive: true } as ChartOptions<'bar'>}
            data2={Array.isArray(resultados) ? resultados.map((projeto: any) => ({
              month: projeto.mes,
              value: projeto.valor
            })): []}
          />
      </div> */}
    </div>
  );
};

export default DashboardFormComponent;