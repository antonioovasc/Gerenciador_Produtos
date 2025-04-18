import React, { useState } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      if (response.data.user.role === 'admin') {
        navigate('/admin/products');
      } else {
        navigate('/products');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f0f, #1c1c1c)',
      padding: '20px'
    }}>
      <Card style={{
        width: '400px',
        padding: '50px',
        borderRadius: '16px',
        boxShadow: '0px 15px 30px rgba(0, 0, 0, 0.5)',
        background: 'linear-gradient(145deg, #222222, #292929)',
        color: '#ffffff',
        border: 'none'
      }}>
        <Card.Body>
          <h2 className="text-center mb-4" style={{
            fontWeight: 'bold',
            color: '#f8f9fa',
            letterSpacing: '1.5px',
            fontSize: '26px'
          }}>
            Login
          </h2>

          {error && <Alert variant="danger" className="text-center" style={{
            backgroundColor: '#d9534f',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3', fontSize: '14px' }}>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  borderRadius: '8px',
                  padding: '14px',
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

            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#b3b3b3', fontSize: '14px' }}>Senha</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  borderRadius: '8px',
                  padding: '14px',
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

            <Button variant="primary" type="submit" className="w-100" style={{
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '8px',
              transition: '0.3s ease-in-out',
              background: 'linear-gradient(90deg, #007bff, #0056b3)',
              border: 'none',
              letterSpacing: '1px',
              boxShadow: '0px 4px 10px rgba(0, 123, 255, 0.5)',
              textTransform: 'uppercase'
            }}
            onMouseOver={(e) => e.target.style.background = 'linear-gradient(90deg, #0056b3, #003d80)'}
            onMouseOut={(e) => e.target.style.background = 'linear-gradient(90deg, #007bff, #0056b3)'}
            >
              Entrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
