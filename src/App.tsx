import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './index.css';
import AppRoutes from './rotas/rotas'; // Renomeei para evitar confusão com o Routes do react-router-dom
import NavbarComponent from './component/navbar/navbarComponent';
import { useLocation, BrowserRouter } from 'react-router-dom';

function App() {
  const location = useLocation();

  const hideNavbarRoutes = ['/login'];

  return (
    <div className="divtotal">
      {/* Renderiza condicionalmente a NavbarComponent */}
      {!hideNavbarRoutes.includes(location.pathname) && <NavbarComponent tipoUsuario="admin" />}

      {/* Renderiza as rotas da aplicação */}
      <AppRoutes />
    </div>
  );
}

const MainApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default MainApp;
