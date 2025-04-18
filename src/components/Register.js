import React, { useState } from 'react';
import { Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/register', formData);
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao registrar usuário');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f, #1c1c1c)',
      padding: '20px'
    }}>
      <Card style={{
        width: '700px',
        padding: '50px',
        borderRadius: '16px',
        boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.8)',
        background: 'linear-gradient(145deg, #222222, #292929)',
        color: '#ffffff',
        border: 'none'
      }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{
            fontWeight: 'bold',
            color: '#f8f9fa',
            letterSpacing: '1.5px'
          }}>
            Cadastro de Usuário
          </h2>

          {error && <Alert variant="danger" className="text-center" style={{
            backgroundColor: '#d9534f',
            color: '#fff',
            border: 'none',
            borderRadius: '8px'
          }}>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3' }}>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #444'}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #444'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3' }}>Senha</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #444'}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3' }}>Telefone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{
                      borderRadius: '8px',
                      padding: '12px',
                      backgroundColor: '#2a2a2a',
                      border: '1px solid #444',
                      color: '#ffffff',
                      fontSize: '16px',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                    onBlur={(e) => e.target.style.border = '1px solid #444'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3' }}>Endereço</Form.Label>
              <Form.Control
                as="textarea"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ffffff',
                  fontSize: '16px',
                  minHeight: '100px',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                onBlur={(e) => e.target.style.border = '1px solid #444'}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100" style={{
              padding: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              transition: '0.3s ease-in-out',
              background: 'linear-gradient(90deg, #007bff, #0056b3)',
              border: 'none',
              letterSpacing: '1px',
              boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.5)'
            }}
            onMouseOver={(e) => e.target.style.background = 'linear-gradient(90deg, #0056b3, #003d80)'}
            onMouseOut={(e) => e.target.style.background = 'linear-gradient(90deg, #007bff, #0056b3)'}
            >
              Registrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;
