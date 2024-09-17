import React from 'react';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { getAdminNavigationItems} from './navItens';

interface NavbarComponentProps {
    tipoUsuario: string;
}

const NavbarComponent: React.FC<NavbarComponentProps> = ({tipoUsuario}) => {
    const logado = true
    const getNavigationItems = () => {
        switch (tipoUsuario) {
            case 'admin':
                return getAdminNavigationItems();
            default:
                return [];
        }
    };

    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: 'var(--primary-color)' }} variant='dark'>
            <Container fluid>
                {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */} {/* Podemos usar de botão home depois */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav style={{ fontSize: 'var(--nav-font-size)'}}>
                        <Nav.Link href="/">Home</Nav.Link>
                        {getNavigationItems().map((item, index) => (
                            <Nav.Link key={index} href={item.path}>{item.label}</Nav.Link>
                        ))}
                    </Nav>
                    <Nav className='ms-auto'> 
                        {logado ? <Nav.Link href="#sair">Sair</Nav.Link> 
                        : <Nav.Link href="#entrar">Entrar</Nav.Link>}
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            </Container>
        </Navbar>
    )
}

export default NavbarComponent;