import { FC } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Home from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Cadastro from "../pages/cadastroUsuario";
import Login from "../pages/login";
const Rotas: FC = () => {
    let rotas
    rotas = (
        <>
        </>
    )
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/adicionarprojeto"element={<CriarProjeto/>} />
                <Route path="/cadastrousuario"element={<Cadastro/>} />
                <Route path="/login"element={<Login/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas