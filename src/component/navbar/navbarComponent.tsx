import React from 'react';
import { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { getAdminNavigationItems } from './navItens';
import { logout, isAuthenticated } from '../../services/auth';
import { useNavigate } from "react-router";
import Notifications from '../notificacao/notificacaoComponente';
import styles from './navbar.module.css';

const NavbarComponent = () => {
    const navigate = useNavigate();
    const [logado, setLogado] = useState(isAuthenticated());
    const getNavigationItems = () => {
        if (logado) {
            return getAdminNavigationItems();
        }
        else {
            return [];
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: 'var(--primary-color)' }} variant='dark'>
            <Container fluid>
                <div className={styles.notificationMobile}>
                    {logado && <Notifications />}
                </div>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav style={{ fontSize: 'var(--nav-font-size)'}}>
                        <Nav.Link href="/">Home</Nav.Link>
                        {getNavigationItems().map((item, index) => (
                            <Nav.Link key={index} href={item.path}>{item.label}</Nav.Link>
                        ))}
                    </Nav>
                    <Nav className='ms-auto'> 
                    {logado ? (
                            <>
                                <div className={styles.notificationDesktop}>
                                    <Notifications />
                                </div>
                                <Nav.Link onClick={handleLogout}>Sair</Nav.Link>
                            </>
                        ) : (
                            <Nav.Link href="/login">Entrar</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;