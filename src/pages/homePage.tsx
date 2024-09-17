import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Calendario from '../component/date/calendarioComponent';
import styles from '../component/home/Home.module.css';
import { Button } from 'react-bootstrap';

const Home = () => {
    const [ handleSubmit ] = useState();
    const [ isFormVisible, setIsFormVisible ] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    return (
        <body>
            <main className={styles.main}>
                <h1 className={styles.titulo}> Portal de Transparencia </h1>
                <section>
                    { isFormVisible ? (
                    <div className={`${styles.formContainer} ${isFormVisible ? styles.formOpen : styles.formClosed}`}> 
                    <form className={styles.formLimit} onSubmit={ handleSubmit } method="POST">
                        <div className={styles.flexbox}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Referência do Projeto" 
                                className="mb-3"
                                style={{width: '48vw',
                                    color: '#9C9C9C',
                                    zIndex: 1,
                                }}
                            >
                                <Form.Control type="text" placeholder="Referência do Projeto" />
                            </FloatingLabel>
                            <FloatingLabel 
                                label="Coordenador" 
                                controlId="floatingInput"
                                className='mb-3'
                                style={{width: '48vw',
                                    color: '#9C9C9C',
                                    zIndex: 1,
                                }}
                            >
                                <Form.Control type="text" placeholder="Coordenador" />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Classificação"
                                className="mb-3"
                                style={{width: '48vw',
                                    color: '#9C9C9C',
                                    zIndex: 1,
                                }}
                            >
                                <Form.Control type="text" placeholder="Classificação" />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Situação do Projeto"
                                className="mb-3"
                                style={{width: '48vw',
                                    color: '#9C9C9C',
                                    zIndex: 1,
                                }}
                            >
                                <Form.Control type="text" placeholder="Situação do Projeto" />
                            </FloatingLabel>
                            <Calendario 
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}/> 
                        </div>
                        
                        <div className={styles.lateralform}>
                            <Button onClick={toggleFormVisibility} style={{ cursor: 'pointer'}}>
                                X 
                            </Button>
                            {/* Implementar Feat para fechar aba de filtros */}
                            <div className={styles.botaoEnviar}>
                                <Button type="submit">
                                    Procurar
                                </Button>
                            </div>
                        </div>
                    </form>
                    </div>
                    ):(
                        <div className={styles.botaoFiltro}>
                            <Button onClick={toggleFormVisibility}>
                                Abrir Filtros
                            </Button>
                        </div>)
                    }
                    

                </section>

            </main>
        </body>
    )
}
export default Home