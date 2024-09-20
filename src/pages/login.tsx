import{toast } from 'react-toastify';
import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import verificaCPFValido from '../functions/verificaCpf';
import verificaEmailValido from '../functions/verificaEmail';
import styles from '../component/login/login.module.css'
import {useRef, useEffect} from 'react';
import encryptPassword from '../functions/criptografaSenha';
import UserIcon from '../assets/login/userico.svg'
import LoginAdminService from '../services/administrador/loginService';
import { LoginAdm } from '../interface/adminstrador.interface';

function Login() {
    const navigate = useNavigate()
    const[email, setEmail] = useState("")
    const[senha, setSenha] = useState("")
    const[erro, setErro] = useState("")

    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let dados = {
            email: email,
            senha: senha
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
      <body className={styles.body}>
        <div className={styles.mainBody}>
            <img src={UserIcon} className={styles.userico}/>
            <h1 className={styles.text}>Login</h1>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
              <div className={styles.input_container}>
                <label htmlFor="">Email</label> <br />
                <input type="text"
                placeholder="Insira seu email" 
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                />{" "}
              </div>
                 <br />
                <div className={styles.input_container}>
                  <label htmlFor="">Senha</label> <br />
                  <input type="password"
                  placeholder="Insira sua senha" 
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  />{" "}
                </div>
                <div>
                    <button type="submit" className={styles.submitbutton}>Entrar</button>
                    <br/>
                    {/* <p className=""><Link to="/esquecisenha">Esqueceu a senha?</Link>
                    </p> */}
                    {erro && (
                      <p className={styles.erro}>{erro}</p>
                    )}
                </div>
            </form>
        </div>
      </body>
    )
}

export default Login