import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import api from '../../services/api';
import BarGraph from './charts/bar';
import { getToken } from '../../services/auth';
import { ChartOptions } from 'chart.js';
import { NumericFormat} from 'react-number-format';
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';

// Definindo a interface para os resultados
/* interface ResultadoProjeto {
  month: string;
  value: number;
} */

type Resultados = Record<string, string>

const DashboardFormComponent = () => {
  const [contratante, setContratante] = useState('');
  const [coordenador, setCoordenador] = useState('');
  const [ano, setAno] = useState('Todos');
  const [valorMinimo, setValorMinimo] = useState('');
  const [valorMaximo, setValorMaximo] = useState('');
  const [situacaoProjeto, setSituacaoProjeto] = useState('Todos');
  const [resultados, setResultados] = useState<Resultados>({}); // Usando o tipo definido
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

    const params = new URLSearchParams(dadosRequisicao).toString();

    console.log('Query Params:', params); // Log para verificar a query string

    try {
      console.log('Dados enviados:', dadosRequisicao);
      const resposta = await api.get(`/dashboard/projetos/search?${params}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setResultados(resposta.data);
      setMostrarGrafico(true); 
      limparFormulario();
    } catch (erro: any) {
      console.error('Erro ao enviar os dados:', erro.response ? erro.response : erro);
      setErroMensagem('Ocorreu um erro ao enviar os dados. Tente novamente.');
    }
  };

  useEffect(() => {
    console.log(resultados);
  }, [resultados]);

  type Resultados = { [key: string]: number };

  const gerarPDF = (dados: Resultados) => {
    const document = new jsPDF();
    let yPosition = 10;

    Object.entries(dados).forEach(([mesAno, quantidade]: [string, number]) => {

      document.text(`Mês/Ano: ${mesAno} - Quantidade: ${quantidade}`, 20, yPosition);
      
      yPosition += 10;
    });

    return document;
  };

   const handleDownloadPDF = () => {
    const document = gerarPDF(resultados);
    document.save('relatorio_projetos.pdf');
  }; 

  const gerarExcel = (dados: Resultados) => {
    const worksheetData = Object.entries(dados).map(([mesAno, quantidade]) => ({
      'Mês/Ano': mesAno,
      'Quantidade': quantidade,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');

    return workbook;
  };

  const handleDownloadExcel = () => {
    const workbook = gerarExcel(resultados);
    XLSX.writeFile(workbook, 'relatorio_projetos.xlsx');
  };

  const formatarValorBR = (valor: number | string): string => {
    // Verifica se o valor é uma string e faz a substituição da vírgula para ponto para conversão
    let numero = typeof valor === "string" ? parseFloat(valor.replace(/\./g, '').replace(',', '.')) : valor;
    // Se a conversão não resultar em um número válido, retorna "0,00"
    if (isNaN(numero)) return "0,00";
    // Converte o número para ter sempre duas casas decimais
    const [inteira, decimal] = numero.toFixed(2).split(".");
    // Formata a parte inteira para incluir pontos a cada três dígitos
    const inteiraFormatada = inteira.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    // Retorna o número formatado com vírgula separando os decimais
    return `R$: ${inteiraFormatada},${decimal}`;
  };

  const limparFormulario = () => {
    setContratante('');
    setCoordenador('');
    setAno('Todos');
    setValorMinimo(''/* formatarValorBR('') */);
    setValorMaximo(''/* formatarValorBR('') */);
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

          <Row className="mb-4">
            <Form.Group as={Col} controlId="floatingInput">
              <FloatingLabel controlId="floatingInput" label="Contratante" style={{ color: '#9C9C9C' }}>
                <Form.Control
                  placeholder="Contratante"
                  type="text"
                  value={contratante}
                  onChange={(e) => setContratante(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
          </Row>

          <Row className="mb-4">
            <Form.Group as={Col} controlId="floatingInput">
              <FloatingLabel controlId="floatingInput" label="Coordenador" style={{ color: '#9C9C9C' }}>
                <Form.Control
                  placeholder="Coordenador"
                  type="text"
                  value={coordenador}
                  onChange={(e) => setCoordenador(e.target.value)}
                />
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
              <FloatingLabel controlId="valorMinimo" label="Valor mínimo" style={{ color: '#9C9C9C' }}>
              <NumericFormat
                className="form-control"
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                placeholder="Valor"
                value={valorMinimo}
                onValueChange={(values) => setValorMinimo(values.value)}
              />
              </FloatingLabel>
            </Form.Group>
            <Form.Group as={Col} controlId="valorMaximo" sm={6}>
              <FloatingLabel controlId="valorMaximo" label="Valor máximo" style={{ color: '#9C9C9C' }}>
              <NumericFormat
                className="form-control"
                thousandSeparator="."
                decimalSeparator=","
                prefix="R$ "
                decimalScale={2}
                fixedDecimalScale={true}
                allowNegative={false}
                placeholder="Valor"
                value={valorMaximo}
                onValueChange={(values) => setValorMaximo(values.value)}
              />
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
              <Button variant="secondary" type="submit">
                Gerar
              </Button>
            </Col>
          </Row>
        </Form>
      </div>

      {mostrarGrafico && (
          <div className="container my-4">
              <div 
                  className="card shadow-sm" // Adicionando a classe de sombra
                  style={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #ccc', // Cor da borda
                      borderRadius: '10px', // Cantos arredondados
                      padding: '20px' // Espaçamento interno
                  }}
              >
                  <BarGraph
                      options={{ responsive: true } as ChartOptions<'bar'>}
                      data2={Object.entries(resultados).map(([year, value]) => ({
                          month: year,
                          value: value
                      }))}
                  />
              </div>
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="submit"
                  className="btn btn-primary mt-4 mb-4"
                  onClick={handleDownloadPDF}
                >
                  Baixar PDF
                </button>
                <button
                  type="submit"
                  className="btn btn-primary mt-4 mb-4"
                  onClick={handleDownloadExcel}
                >
                  Baixar Excel
                </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default DashboardFormComponent;
