import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Estilos para a página de erro ou redirecionamento
  const errorStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f0f0f, #1c1c1c)',
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
  };

  if (!token || !user) {
    return (
      <div style={errorStyle}>
        <p>Você não está autenticado. Redirecionando para o login...</p>
        <Navigate to="/login" />
      </div>
    );
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <div style={errorStyle}>
        <p>Acesso restrito! Você não tem permissão para acessar esta página.</p>
        <Navigate to="/products" />
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
