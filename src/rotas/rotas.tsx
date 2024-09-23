import { FC } from "react";
import { Route, Routes } from 'react-router-dom';
import Home from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Login from "../pages/loginPage";
import AlteraDeletaVisualiza from "../pages/visualizarProjetos";
import AlteraDeletaEdita from "../pages/editarProjeto";
const Rotas: FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/adicionarprojeto" element={<CriarProjeto />} />
            <Route path="/projeto/visualizar/:id" element={<AlteraDeletaVisualiza/>} />
            <Route path="/projeto/atualizar/:id" element={<AlteraDeletaEdita/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/editar/{projetoId}" element={<AlteraDeletaEdita />} />
        </Routes>
    );
}

export default Rotas;
