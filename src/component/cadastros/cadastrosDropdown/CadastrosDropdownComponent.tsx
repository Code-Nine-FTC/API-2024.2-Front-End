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
          <Dropdown.Item href="#/action-1" className={styles.dropdownItem}>Parceiros</Dropdown.Item>
          <Dropdown.Item href="#/action-2" className={styles.dropdownItem}>Bolsistas</Dropdown.Item>
          <Dropdown.Item onClick={() => navigate('/cadastroMaterial')} className={styles.dropdownItem}>Materiais</Dropdown.Item>
          <Dropdown.Item href="#/action-2" className={styles.dropdownItem}>Classificação de Demandas</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav.Item>
  );
};

export default CadastrosDropdownComponent;
