import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Routes from './rotas/rotas';
import NavbarComponent from './component/navbar/navbarComponent';

function App() {
  return (
    <div className="divtotal">
      <NavbarComponent/>
      <Routes/>
    </div>
  );
}

export default App;
