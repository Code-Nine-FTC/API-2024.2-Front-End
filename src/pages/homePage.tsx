import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Calendario from '../component/date/calendarioComponent';
import styles from '../component/home/Home.module.css';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import SweetAlert2 from 'sweetalert2';
import ProcurarProjetoFunction from '../services/buscar/buscarProjetosService';


const Home = () => {
    const [ handleSubmit ] = useState();
    const [ isFormVisible, setIsFormVisible ] = useState(false);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [referenciaProjeto, setReferenciaProjeto] = useState('');
    const [coordenador, setCoordenador] = useState('');
    const [classificacao, setClassificacao] = useState('');
    const [projetosituacao, setProjetoSituacao] = useState('')
    const [projetos, setProjetos] = useState<any[]>([]);

    const toggleFormVisibility = () => {
        setIsFormVisible(!isFormVisible);
    };

    const fetchData = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        event.stopPropagation();
        
        const projeto = {
            referenciaProjeto,
            coordenador,
            classificacao,
            projetosituacao,
            startDate,
            endDate
        };

        try {
            const resposta = await ProcurarProjetoFunction(projeto);
            if (resposta.status === 200) {
                setProjetos(resposta.data)
            } else {
                console.error('Erro ao encontrar projeto', resposta);
                SweetAlert2.fire({
                    icon: 'error',
                    title: 'Erro ao encontrar projeto!',
                    })
                }   
            } catch (error) {
                console.error('Erro ao encontrar projeto', error);
                SweetAlert2.fire({
                    icon: 'error',
                    title: 'Erro ao encontrar projeto!',
                });
            }
    }

    return (
        <body>
            <main className={styles.main}>
                <h1 className={styles.titulo}> Portal de Transparencia </h1>
                <section>
                    { isFormVisible ? (
                    <div className={`${styles.formContainer} ${isFormVisible ? styles.formOpen : styles.formClosed}`}> 
                    <Form className={styles.formLimit} onSubmit={fetchData}>
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
                                <Form.Control 
                                    type="text" 
                                    placeholder="Referência do Projeto" 
                                    value={referenciaProjeto}
                                    onChange={(e)=> setReferenciaProjeto(e.target.value)}
                                />
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
                                <Form.Control 
                                    type="text" 
                                    placeholder="Coordenador"
                                    value={coordenador}
                                    onChange={(e) => setCoordenador(e.target.value)}
                                 />
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
                                <Form.Control 
                                    type="text" 
                                    placeholder="Classificação"
                                    value={classificacao}
                                    onChange={(e) => setClassificacao(e.target.value) }    
                                />
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
                                <Form.Control 
                                    type="text" 
                                    placeholder="Situação do Projeto"
                                    value={projetosituacao}
                                    onChange={(e) => setProjetoSituacao(e.target.value)}
                                />
                            </FloatingLabel>
                            <Calendario 
                                startDate={startDate}
                                endDate={endDate}
                                setStartDate={setStartDate}
                                setEndDate={setEndDate}
                            /> 
                        </div>
                        
                        <div className={styles.lateralform}>
                            <Button onClick={toggleFormVisibility} style={{ cursor: 'pointer'}}>
                                X 
                            </Button>
                            <div className={styles.botaoEnviar}>
                                <Button type="submit">
                                    Procurar
                                </Button>
                            </div>
                        </div>
                    </Form>
                    </div>
                    ):(
                        <div className={styles.botaoFiltro}>
                            <Button onClick={toggleFormVisibility}>
                                Abrir Filtros
                            </Button>
                        </div>)
                    }
                    

                </section>
                <section>
                    <h1>Projetos</h1>
                    <ul>
                        {projetos.map((projeto) => (
                            <li key={projeto.id}>{projeto.nome}</li>
                        ))}
                    </ul>
                </section>
            </main>
        </body>
    )
}
export default Home