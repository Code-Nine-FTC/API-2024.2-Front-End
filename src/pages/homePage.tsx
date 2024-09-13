import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Calendario from '../component/date/calendarioComponent';
import styles from '../component/home/Home.module.css';

const Home = () => {
    return (
        <body>
            <header className={styles.navbox}>
                <h1>NavBar</h1>  {/* Método provisório */}
            </header>
            <main className={styles.main}>
                <section>
                    <form className={styles.formLimit}>
                        <div className={styles.flexbox}>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Referência do Projeto" 
                                className="mb-3"
                                style={{width: '44vw',
                                    color: '#000000',
                                    zIndex: 1,
                                    opacity: 0.5,
                                }}
                            >
                                <Form.Control type="text" placeholder="Referência do Projeto" />
                            </FloatingLabel>
                            <FloatingLabel 
                                label="Coordenador" 
                                controlId="floatingInput"
                                className='mb-3'
                                style={{width: '44vw',
                                    color: '#000000',
                                    zIndex: 1,
                                    opacity: 0.5,
                                }}
                            >
                                <Form.Control type="text" placeholder="Coordenador" />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Classificação"
                                className="mb-3"
                                style={{width: '44vw',
                                    color: '#000000',
                                    zIndex: 1,
                                    opacity: 0.5,
                                }}
                            >
                                <Form.Control type="text" placeholder="Classificação" />
                            </FloatingLabel>
                            <FloatingLabel
                                controlId="floatingInput"
                                label="Situação do Projeto"
                                className="mb-3"
                                style={{width: '44vw',
                                    color: '#000000',
                                    zIndex: 1,
                                    opacity: 0.5,
                                }}
                            >
                                <Form.Control type="text" placeholder="Situação do Projeto" />
                            </FloatingLabel>
                            <Calendario />    
                        </div>
                        
                    </form>
                </section>
            </main>
        </body>
    )
}
export default Home