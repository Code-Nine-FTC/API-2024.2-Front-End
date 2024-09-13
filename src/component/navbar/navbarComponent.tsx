import React from 'react';
import { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

export default function NavbarComponent()  {
    return (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: 'var(--primary-color)' }} variant='light'>
            <Container>
                {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */} {/* Podemos usar de botão home depois */}
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                </Nav>
                <Nav> 
                    <Nav.Link href="#entrar">Entrar</Nav.Link>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}