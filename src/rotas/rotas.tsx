import { FC, useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomeBuscar from "../pages/homePage";
import CriarProjeto from "../pages/criarProjeto";
import Login from "../pages/loginPage";
import AlteraDeletaVisualiza from "../pages/visualizarProjetos";
import { AuthContext } from "../services/context";
import Dashboard from "../pages/Dashboard";
import Auditoria from "../pages/auditoria";
import CriarParceiro from "../pages/criarParceiro";
import VisualizaBolsistaPage from "../pages/visualizarBolsistaPage";
import ResultadoProjeto from "../component/resultadoProjeto/resultadoProjetoComponent";
import ListagemBolsistas from "../pages/listagemBolsista";


const Rotas: FC = () => {
  const { isAutenticado } = useContext(AuthContext);
  
  let rotas;

  if (isAutenticado) {
    rotas = (
      <>
        {/* Apenas administradores podem adicionar projetos */}
        <Route path="/adicionarprojeto" element={<CriarProjeto />} />
        <Route path="/adicionarParceiro" element={<CriarParceiro />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auditorias/" element={<Auditoria />}/>
        {/* <Route path="/sumarioProjeto" element={<SumarioProjeto />} /> */}
        <Route path="/visualizarbolsista/:id" element={<VisualizaBolsistaPage />} />
        <Route path="/listagemBolsistas" element={<ListagemBolsistas />} />
        {/* <Route path="/cadastroMaterial" element={<CadastroMaterial/>}/> */}
        {/* <Route path="/prestacaoContas" element={<PrestacaoConta titulo= ''/>} /> */}
        <Route path="/resultadoProjeto" element={<ResultadoProjeto />} />
      </>
    );
  } else {
    rotas = (
      <>
        <Route path="*" element={<Navigate to="/" replace />} />;
      </>
    );
  }
  return (
    <Routes>
      {/* Rotas abertas para todos */}
      <Route path="/" element={<HomeBuscar />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/projeto/visualizar/:id"
        element={<AlteraDeletaVisualiza />}
      />

      {/* Rotas condicionadas com base no nível de acesso */}
      {rotas}

      {/* Redireciona qualquer rota inválida para a página inicial */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default Rotas;
