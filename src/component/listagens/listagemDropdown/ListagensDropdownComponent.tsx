import React from 'react';
import { Dropdown, Nav } from 'react-bootstrap';
import styles from './ListagensDropdownComponent.module.css';
import { useNavigate } from 'react-router-dom';


interface ListagensDropdownComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListagensDropdownComponent: React.FC<ListagensDropdownComponentProps> = ({ className }) => {
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
                    Listagens
                </Dropdown.Toggle>

                <Dropdown.Menu className={`${styles.dropdownMenu}`}>
                    {/* <Dropdown.Item onClick={() => navigate('/listagemParceiros')} className={styles.dropdownItem}>Parceiros</Dropdown.Item> */}
                    <Dropdown.Item onClick={() => navigate('/listagemBolsistas')} className={styles.dropdownItem}>Bolsistas</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/listagemDemandas')} className={styles.dropdownItem}>Demandas</Dropdown.Item>
                    {/* <Dropdown.Item onClick={() => navigate('/listagemMateriais')} className={styles.dropdownItem}>Materiais</Dropdown.Item> */}
                    {/* <Dropdown.Item onClick={() => navigate ('/listagemConvenio') } className={styles.dropdownItem}>Convênios</Dropdown.Item> */}
                    {/* <Dropdown.Item href="#/action-1" className={styles.dropdownItem}>Classificação de Demanda</Dropdown.Item> */}
                </Dropdown.Menu>
            </Dropdown>
        </Nav.Item>
    );

}

export default ListagensDropdownComponent;
