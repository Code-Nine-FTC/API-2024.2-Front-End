import { useState, useEffect} from "react"
import { useNavigate } from "react-router"
import styles from "../component/login/login.module.css"
import { FloatingLabel, Form, Button } from "react-bootstrap"
import LoginAdminService from "../services/administrador/loginService"
import { useContext } from 'react';
import criptografarSenha from "../functions/criptografaSenha"
import { AuthContext } from "../services/context"
import { login } from "../services/auth"
import avatar from "../assets/login/Avatar Placeholder.svg"
import SweetAlert from 'sweetalert2'

const LoginPage = () => {
    const navigate = useNavigate()
    const[email, setEmail] = useState("")
    const[senha, setSenha] = useState("")
    const[erro, setErro] = useState("")
    const[camposValidados, setValidado] = useState(false)
    const { setAutenticado, setToken } = useContext(AuthContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget;

        if (form.checkValidity() === false) {
            setValidado(true);
            return
          }

        setValidado(true);

        let dados = {
            login: email,
            password: senha
        }

        console.log(dados)

        try {
            const resposta = await LoginAdminService(dados);
  
            if (resposta.status === 200) {
              setErro("")
              login(resposta.data.token, setAutenticado, setToken)
                SweetAlert.fire({
                    icon: 'success',
                    title: 'Login realizado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                })
              navigate('/')
            }
            else {
              setErro(resposta.message)
            }
  
            setEmail("")
            setSenha("")
  
          } catch (error:any) {
            let errorMessage = error.message || 'Erro ao realizar o login, tente novamente mais tarde.';
            setErro(errorMessage)
            }
        }

    return (
        <main className={styles.body}>
            <div className="tituloSetaVoltar">
                <span className="setaVoltarBranca" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}> &#x2190;</span>
            </div>
            <section className={styles.mainbody}>
                <div className={styles.tituloImagem}>
                    <img src={avatar} alt="Icone representando avatar de usuário"></img>
                    <h1 className={styles.titulo}>Login</h1>
                </div>
                <Form noValidate validated={camposValidados} className="bg-light p-5 rounded col-md-12" onSubmit={handleSubmit}>
                    <FloatingLabel
                        controlId="validateCustom01"
                        label="Email"
                        className="mb-3"
                        style={{width: '27vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira o seu email.
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <FloatingLabel
                        controlId="validateCustom02"
                        label="Senha"
                        className="mb-3"
                        style={{width: '27vw',
                            color: '#9C9C9C',
                            zIndex: 1,
                        }}
                    >
                        <Form.Control
                            type="password"
                            placeholder="Senha"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, insira sua senha
                        </Form.Control.Feedback>
                    </FloatingLabel>
                    <div className="d-flex justify-content-center">
                        <Button type="submit">
                            Enviar
                        </Button>
                    </div>
                    {erro && (
                        <p className={styles.erro}>
                            {erro}
                        </p>
                    )}
                </Form>
            </section>
        </main>
    )
}

export default LoginPage