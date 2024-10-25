import { FC, useContext } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import HomeBuscar from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Login from "../pages/loginPage";
import AlteraDeletaVisualiza from "../pages/visualizarProjetos";
import { AuthContext } from '../services/context';
import Dashboard from "../pages/Dashboard";
import Auditoria from "../pages/auditoria";
import AuditoriaPorId from "../pages/auditoriaPorId";

const Rotas: FC = () => {
    const { isAutenticado } = useContext(AuthContext);

    let rotas;

    if (isAutenticado) {
        
          rotas = (
            <>
                {/* Apenas administradores podem adicionar projetos */}
                <Route path="/adicionarprojeto" element={<CriarProjeto />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auditoria/" element={<Auditoria />}/>
                <Route path="/auditoria/:id" element={<AuditoriaPorId/>}/>
            </>
        );  
       }  else {

           rotas = ( 
           <>
            <Route path="*" element={<Navigate to="/" replace />} />;
          </>)
        } 
    return (
        
          <Routes>
            {/* Rotas abertas para todos */}
            <Route path="/" element={<HomeBuscar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/projeto/visualizar/:id" element={<AlteraDeletaVisualiza/>} />
    
            {/* Rotas condicionadas com base no nível de acesso */}
            {rotas}
    
            {/* Redireciona qualquer rota inválida para a página inicial */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        
      );
    }
    
    export default Rotas;