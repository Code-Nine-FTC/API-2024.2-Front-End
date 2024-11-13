import { Button, FloatingLabel, Form, Row, Col } from 'react-bootstrap';
import ChartComponent from './grafico/chart';
import styles from './sumarioProjeto.module.css';

const SumarioProjetoComponent = () => {
    return (
        <body>
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
                <ChartComponent />
            </main>
        </body>
    );
};

export default SumarioProjetoComponent;