import{toast } from 'react-toastify';
import React, { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";


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
        <div className="">
            <h1>Login</h1>
            <form className="" onSubmit={handleSubmit}>
                <label htmlFor="">Email</label> <br />
                <input type="text"
                placeholder="Insira seu email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />{" "} <br />
                <label htmlFor="">Senha</label> <br />
                <input type="password"
                placeholder="Insira sua senha" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />{" "}
                <div>
                    <button type="submit" className="">Entrar</button>
                    <br/>
                    <p className=""><Link to="/esquecisenha">Esqueceu a senha?</Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default Login