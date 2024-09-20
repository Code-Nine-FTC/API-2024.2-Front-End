import { FC } from "react";
import { Route, Routes } from 'react-router-dom';
import Home from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Login from "../pages/loginPage";

const Rotas: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adicionarprojeto" element={<CriarProjeto />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default Rotas;
