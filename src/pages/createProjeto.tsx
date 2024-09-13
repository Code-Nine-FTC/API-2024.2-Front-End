import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const CreateProj = () => {
    return (
        <body>
            <h1>Criar Projeto</h1>
            <main>
                <section>
                    <form>
                        <FloatingLabel
                            controlId="floatingTextarea"
                            label="Coordenador"
                            className="mb-3"
                            style={{width: '48vw',
                                color: '#9C9C9C',
                            }}
                        >
                            <Form.Control type="text" placeholder="Nome do Coordenador" />
                        </FloatingLabel>
                        <FloatingLabel 
                            label="Nome Projeto" 
                            controlId="floatingTextarea"
                            style={{width: '100%',
                                color: '#9C9C9C',
                            }}
                        >
                            <Form.Control type="text" placeholder="Nome do Projeto" />
                        </FloatingLabel>
                    </form>
                </section>
                <aside>
                </aside>
            </main>
        </body>
    )
}

export default CreateProj