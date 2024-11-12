import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import styles from './CadastrosDropdownComponent.module.css';

interface CadastrosDropdownComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CadastrosDropdownComponent: React.FC<CadastrosDropdownComponentProps> = ({ className }) => {
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
          <Dropdown.Item href="#/action-1" className={styles.dropdownItem}>Gastos</Dropdown.Item>
          <Dropdown.Item href="#/action-2" className={styles.dropdownItem}>Receitas</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav.Item>
  );
};

export default CadastrosDropdownComponent;
