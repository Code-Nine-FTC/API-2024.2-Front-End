import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import './index.css';
import AppRoutes from './rotas/rotas'; // Renomeei para evitar confusão com o Routes do react-router-dom
import NavbarComponent from './component/navbar/navbarComponent';
import { useLocation, BrowserRouter } from 'react-router-dom';
import { isAuthenticated, getToken } from "./services/auth";
import { useEffect, useState } from 'react';
import { AuthContext } from './services/context';

function App() {
  const location = useLocation();
  const [isAutenticado, setAutenticado] = useState(isAuthenticated());
  const [token, setToken] = useState(getToken() || '');
  

  useEffect(() => {
    setAutenticado(isAuthenticated());
    setToken(getToken() || '');
    
  }, [isAutenticado,  token]);

  const hideNavbarRoutes = ['/login'];

  return (
    <AuthContext.Provider value={{ isAutenticado, token, setAutenticado, setToken }}>
      <div className="divtotal">
        {/* Renderiza condicionalmente a NavbarComponent */}
        {!hideNavbarRoutes.includes(location.pathname) && <NavbarComponent/>}

        {/* Renderiza as rotas da aplicação */}
        <AppRoutes />
      </div>
    </AuthContext.Provider>
  );
}

const MainApp = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default MainApp;
