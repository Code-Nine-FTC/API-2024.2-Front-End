import React, { useEffect, useState } from 'react';
import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import ChartComponent from './grafico/chart';
import { buscarSumario } from '../../services/sumario/sumarioservice';
import styles from './sumarioProjeto.module.css';

const SumarioProjetoComponent = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resposta = await buscarSumario();
                if (resposta.status === 200 && resposta.data) {
                    setData(resposta.data);
                } else {
                    setError(resposta.message);
                }
            } catch (error) {
                setError((error as any).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>Erro: {error}</p>;
    }

    return (
        <div>
            <nav className={styles.nav}>
                <Form>
                    <Row className="mb-4">
                        <div className={styles.data}>
                            <Form.Group as={Col} md={2} controlId="ano">
                                <FloatingLabel controlId="ano" label="Ano">
                                    <Form.Select defaultValue="">
                                        <option value="2021">2021</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>

                            <Button
                                type="submit"
                                className={`btn btn-primary ${styles.botaoSubmit}`}
                                style={{
                                    width: "fit-content",
                                    whiteSpace: "nowrap",
                                    wordBreak: "break-word",
                                }}
                            >
                                Procurar
                            </Button>
                        </div>
                    </Row>
                </Form>
            </nav>
            <main>
                {data && <ChartComponent data={data} />}
            </main>
        </div>
    );
};

export default SumarioProjetoComponent;