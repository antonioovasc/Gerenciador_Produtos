import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Navbar expand="lg" style={{
      background: '#212121', // Dark background for sleek look
      height: '90px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Shadow for depth
    }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{
          color: '#f8f9fa',
          fontWeight: '600',
          fontSize: '24px',
          letterSpacing: '1px',
          transition: 'color 0.3s ease', // Smooth color transition on hover
        }}>
          Bem-vindo ao Big Burguer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/products" style={{
                  color: '#f8f9fa', 
                  fontSize: '16px',
                  fontWeight: '500', 
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  transition: 'color 0.3s ease',
                }}>
                  Produtos
                </Nav.Link>
                <div style={{
                  borderLeft: '1px solid #444', // Vertical separator
                  height: '24px', 
                  margin: '0 10px',
                }} />
                <Nav.Link as={Link} to="/cart" style={{
                  color: '#f8f9fa', 
                  fontSize: '16px',
                  fontWeight: '500', 
                  paddingLeft: '15px',
                  paddingRight: '15px',
                  transition: 'color 0.3s ease',
                }}>
                  <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
                  Carrinho
                </Nav.Link>
                {user.role === 'admin' && (
                  <>
                    <div style={{
                      borderLeft: '1px solid #444', // Vertical separator
                      height: '24px', 
                      margin: '0 10px',
                    }} />
                    <Nav.Link as={Link} to="/admin/products" style={{
                      color: '#f8f9fa', 
                      fontSize: '16px',
                      fontWeight: '500', 
                      paddingLeft: '15px',
                      paddingRight: '15px',
                      transition: 'color 0.3s ease',
                    }}>
                      Gerenciar Produtos
                    </Nav.Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{
                  padding: '8px 16px', 
                  borderRadius: '30px', 
                  border: '2px solid #f8f9fa', 
                  color: '#f8f9fa', 
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  marginLeft: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow for button
                }}>
                  Login
                </Nav.Link>
                <div style={{
                  borderLeft: '1px solid #444', // Vertical separator
                  height: '24px', 
                  margin: '0 10px',
                }} />
                <Nav.Link as={Link} to="/register" style={{
                  padding: '8px 16px', 
                  borderRadius: '30px', 
                  border: '2px solid #f8f9fa', 
                  color: '#f8f9fa', 
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  marginLeft: '15px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow for button
                }}>
                  Registre-se
                </Nav.Link>
              </>
            )}
          </Nav>
          {user && (
            <Nav>
              <Navbar.Text style={{
                color: '#f8f9fa', 
                fontSize: '14px', 
                fontWeight: '400', 
                marginRight: '20px',
                transition: 'color 0.3s ease', // Smooth color transition
              }}>
                Olá, {user.name}
              </Navbar.Text>
              <div style={{
                borderLeft: '1px solid #444', // Vertical separator
                height: '24px', 
                margin: '0 10px',
              }} />
              <Button variant="outline-light" onClick={handleLogout} style={{
                padding: '8px 16px', 
                borderRadius: '30px', 
                border: '2px solid #f8f9fa', 
                color: '#f8f9fa', 
                fontSize: '14px',
                fontWeight: '500',
                marginLeft: '15px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Shadow for button
              }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#000'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sair
              </Button>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
