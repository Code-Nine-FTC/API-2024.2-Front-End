import { useState, useEffect} from "react"
import { useNavigate } from "react-router"
import styles from "../component/login/login.module.css"
import { FloatingLabel, Form, Button } from "react-bootstrap"
import LoginAdminService from "../services/administrador/loginService"
import{ toast } from 'react-toastify';
import criptografarSenha from "../functions/criptografaSenha"

const LoginPage = () => {
    const navigate = useNavigate()
    const[email, setEmail] = useState("")
    const[senha, setSenha] = useState("")
    const[erro, setErro] = useState("")
    const[camposValidados, setValidado] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let dados = {
            email: email,
            senha: criptografarSenha(senha)
        }

        try {
            const resposta = await LoginAdminService(dados);
  
            if (resposta.status === 200) {
              toast.success("Login realizado com sucesso")
              setErro("")
            }
            else {
              setErro(resposta.message)
            }
  
            setEmail("")
            setSenha("")
  
          } catch(error) {
              console.error("Erro ao fazer login:", error);
              toast.error('Erro ao fazer login');
          }
    }

    return (
        <main className={styles.body}>
            <div className="tituloSetaVoltar">
                <span className="setaVoltarBranca" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}> &#x2190;</span>
            </div>
            <section className={styles.mainbody}>
                <Form noValidate validated={camposValidados} onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="validateCustom01"
                        label="Email"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback>
                            Por favor, insira o seu email.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="validateCustom02"
                        label="Senha"
                        className="mb-3"
                        style={{width: '48vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control
                            type="text"
                            placeholder="Senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <Form.Control.Feedback>
                            Por favor, insira sua senha
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    {erro && (
                        <p className={styles.erro}>
                            {erro}
                        </p>
                    )}
                    <div className={styles.botaoEnviar}>
                        <Button type="submit">
                            Enviar
                        </Button>
                    </div>
                </Form>
            </section>
        </main>
    )
}

export default LoginPage