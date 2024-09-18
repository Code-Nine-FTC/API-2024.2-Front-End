import{toast } from 'react-toastify';
import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import verificaCPFValido from '../functions/verificaCpf';
import verificaEmailValido from '../functions/verificaEmail';
import styles from '../component/login/login.module.css'
import {useRef, useEffect} from 'react';
import encryptPassword from '../functions/criptografaSenha';
import UserIcon from '../assets/login/userico.svg'

function Login() {
    const navigate = useNavigate()
    const[username, setUsername] = useState("")
    const[password, setPassword] = useState("")


    const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await fetch("URL_DO_BACK", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password })
          });

          const data = await response.json()

          if (response.ok) {
            // Implementar o token de verificação aqui....
            toast.success("Login realizado com sucesso")
          }
          else {
            toast.error('Credenciais inválidas');
          }
          setUsername("")
          setPassword("")

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
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />{" "}
              </div>
                 <br />
                <div className={styles.input_container}>
                  <label htmlFor="">Senha</label> <br />
                  <input type="password"
                  placeholder="Insira sua senha" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />{" "}
                </div>
                <div>
                    <button type="submit" className={styles.submitbutton}>Entrar</button>
                    <br/>
                    <p className=""><Link to="/esquecisenha">Esqueceu a senha?</Link>
                    </p>
                </div>
            </form>
        </div>
      </body>
    )
}

export default Login