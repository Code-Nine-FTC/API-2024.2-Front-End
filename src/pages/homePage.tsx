import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Calendario from '../component/date/calendarioComponent';
import styles from '../component/home/Home.module.css';
import { Button } from 'react-bootstrap';

const Home = () => {
    const [ isFormVisible, setIsFormVisible ] = useState(false);

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
                    <form className={styles.formLimit}>
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
                            <Calendario /> 
                        </div>
                        
                        <div className={styles.lateralform}>
                            <p onClick={toggleFormVisibility} style={{ cursor: 'pointer'}}>
                                Fechar filtros X 
                            </p>
                            {/* Implementar Feat para fechar aba de filtros */}
                            <div className={styles.botaoEnviar}>
                                <Button type="submit">
                                    Enviar
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