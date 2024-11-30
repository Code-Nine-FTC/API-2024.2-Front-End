import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import styles from './CadastrosDropdownComponent.module.css';
import { useNavigate } from 'react-router-dom';

interface CadastrosDropdownComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CadastrosDropdownComponent: React.FC<CadastrosDropdownComponentProps> = ({ className }) => {
  const navigate = useNavigate();

  return (
    <Nav.Item className={`${styles.dropdownHover} ${className}`}>
      <Dropdown show={true}>
        <Dropdown.Toggle
          as={Nav.Link}
          variant="link"
          id="nav-dropdown"
          className={`${styles.navLink} ${styles.dropdownToggle}`}
        >
          Cadastrar
        </Dropdown.Toggle>

        <Dropdown.Menu className={`${styles.dropdownMenu}`}>
          <Dropdown.Item onClick={() => navigate('/adicionarProjeto')} className={styles.dropdownItem}>Projeto</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/adicionarParceiro')} className={styles.dropdownItem}>Parceiro</Dropdown.Item>
          {/* <Dropdown.Item onClick={() => navigate('/cadastroMaterial')} className={styles.dropdownItem}>Material</Dropdown.Item> */}
          <Dropdown.Item onClick={() => navigate('/adicionarDemanda')} className={styles.dropdownItem}>Cadastro de Demanda</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav.Item>
  );
};

export default CadastrosDropdownComponent;
