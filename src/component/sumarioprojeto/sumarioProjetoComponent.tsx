// import React, { useEffect, useState } from 'react';
// import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
// import ChartComponent from './grafico/chart'
// import { buscarSumario } from '../../services/sumario/sumarioservice';
// import { processarDados } from './utils/processarDados';
// import { obterOpcoesAno } from './utils/obterOpcoesAno';
// import styles from './sumarioProjeto.module.css';

// const SumarioProjetoComponent = () => {
//     const [data, setData] = useState<any>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [error, setError] = useState<string | null>(null);
//     const [ano, setAno] = useState('Todos');

//     const fetchData = async (ano?: string) => {
//         try {
//             console.log('Buscando sumário para o ano:', ano); // Log do ano
//             const resposta = await buscarSumario(ano);
//             if (resposta.status === 200 && resposta.data) {
//                 console.log('Dados recebidos:', resposta.data); // Log dos dados recebidos
//                 const dadosProcessados = processarDados(resposta.data, ano);
//                 setData(dadosProcessados);
//             } else {
//                 console.error('Erro na resposta:', resposta.message); // Log do erro na resposta
//                 setError(resposta.message);
//             }
//         } catch (error) {
//             console.error('Erro ao buscar sumário:', error); // Log do erro
//             setError((error as any).message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData();
//     }, []);

//     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();
//         setLoading(true);
//         fetchData(ano === 'Todos' ? undefined : ano);
//     };

//     if (loading) {
//         return <p>Carregando...</p>;
//     }

//     if (error) {
//         return <p>Erro: {error}</p>;
//     }

//     return (
//         <div>
//             <nav className={styles.nav}>
//                 <Form className={styles.form} onSubmit={handleSubmit}>
//                     <Row>
//                         <Form.Group as={Col} md={8} controlId="ano">
//                             <FloatingLabel controlId="ano" label="Ano">
//                                 <Form.Select value={ano} onChange={(e) => setAno(e.target.value)}>
//                                     {obterOpcoesAno().map((Ano) => (
//                                         <option key={Ano} value={Ano}>
//                                             {Ano}
//                                         </option>
//                                     ))}
//                                 </Form.Select>
//                             </FloatingLabel>
//                         </Form.Group>
//                         <Button
//                             type="submit"
//                             className={`btn btn-primary ${styles.botaoSubmit}`}
//                             style={{
//                                 width: "fit-content",
//                                 whiteSpace: "nowrap",
//                                 wordBreak: "break-word",
//                             }}
//                         >
//                             Procurar
//                         </Button>
//                     </Row>
//                 </Form>
//             </nav>
//             <main>
//                 {data && <ChartComponent data={data} />}
//             </main>
//         </div>
//     );
// };

// export default SumarioProjetoComponent;

export default function vazia () {
}
