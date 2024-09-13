import React from 'react';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function NavbarComponent()  {
    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: 'var(--primary-color)' }} variant='dark'>
            <Container>
                {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */} {/* Podemos usar de botão home depois */}
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto" style={{ fontSize: 'var(--nav-font-size)'}}>
                        <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                    </Nav>
                    <Nav className="ml-auto"> 
                        <Nav.Link href="#entrar">Entrar</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            </Container>
        </Navbar>
    )
}