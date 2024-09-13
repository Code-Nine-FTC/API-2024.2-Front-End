import { FC } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Home from "../pages/homePage";
import CreateProj from "../pages/createProjeto";

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
                <Route path="/criarprojeto"element={<CreateProj/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas