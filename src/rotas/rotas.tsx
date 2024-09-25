import { FC } from "react";
import { Route, Routes } from 'react-router-dom';
import HomeBuscar from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Login from "../pages/loginPage";
import AlteraDeletaVisualiza from "../pages/visualizarProjetos";
const Rotas: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomeBuscar />} />
            <Route path="/adicionarprojeto" element={<CriarProjeto />} />
            <Route path="/projeto/visualizar/:id" element={<AlteraDeletaVisualiza/>} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default Rotas;
