import { FC } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Home from "../pages/homePage";

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
            </Routes>
        </BrowserRouter>
    )
}

export default Rotas