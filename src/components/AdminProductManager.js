import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Container
} from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { formatPrice, ensureNumber } from '../utils/format';

const AdminProductManager = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Garantir que os preços sejam números
      const productsWithNumberPrice = response.data.map(product => ({
        ...product,
        price: ensureNumber(product.price)
      }));
      setProducts(productsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar produtos');
    }
  };

  const handleShowModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: null
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      image: null
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setFormData(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', ensureNumber(formData.price));
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      if (editingProduct) {
        await axios.put(
          `http://localhost:3001/api/products/${editingProduct.id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/products',
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      setError('Erro ao salvar produto');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchProducts();
      } catch (error) {
        setError('Erro ao excluir produto');
      }
    }
  };

  return (
    <Container 
    className="p-4" 
    style={{
      maxWidth: '170vw',
      backgroundColor: '#1e1e1e', 
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.5)', 
      borderRadius: '',  // Bordas arredondadas para suavizar o contorno
      padding: '20px',
    }}
  >
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h2 
        className="text-light font-bold" 
        style={{ 
          letterSpacing: '1px', 
          textAlign: 'center', 
          width: '100%', 
          fontSize: '24px', // Tamanho da fonte ajustado
          fontWeight: '700',
         
        }}
      >
        Produtos Adicionados
      </h2>
      <Button
        onClick={() => handleShowModal()}
        style={{
          background: 'linear-gradient(90deg, rgb(29, 52, 180), rgb(23, 73, 180))',
          border: 'none',
          height: '9vh',
          padding: '20px 20x',
          fontWeight: 'bold',
          color: 'white',
          borderRadius: '30px',
          
      
          boxShadow: '0px 4px 5px rgba(32, 29, 29, 0.14)',
          marginLeft: 'auto', // Alinha o botão à direita
        }}
        className="btn-custom"
      >
        <FontAwesomeIcon icon={faPlus} className="me-2" />
        Novo Produto
      </Button>
    </div>
  
    {error && <Alert variant="danger" className="text-center">{error}</Alert>}
  
    <Table responsive className="shadow-sm" hover variant="dark" style={{
      borderRadius: '8px',
    }}>
      <thead>
        <tr style={{ backgroundColor: '#333', color: '#f8f9fc' }}>
          <th>Imagem</th>
          <th>Nome</th>
          <th>Descrição</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} style={{ backgroundColor: '#2c2c2c' }}>
            <td>
              <img
                src={`http://localhost:3001/uploads/${product.image}`}
                alt={product.name}
                style={{
                  width: '50px',
                  height: '50px',
                  objectFit: 'cover',
                  borderRadius: '10px',
                }}
              />
            </td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>R$ {formatPrice(product.price)}</td>
            <td>
              <Button
                variant="warning"
                size="sm"
                className="me-2"
                onClick={() => handleShowModal(product)}
                style={{
                  backgroundColor: '#ffbb33', 
                  border: 'none', 
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(product.id)}
                style={{
                  border: 'none',
                  boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: '6px',
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  
    <Modal show={showModal} onHide={handleCloseModal} centered>
  <Modal.Header closeButton style={{
    backgroundColor: '#333',
    color: '#f8f9fa',
    borderBottom: '1px solid #444', // Sutil linha de separação
    borderTopLeftRadius: '10px',   // Bordas arredondadas superiores
    borderTopRightRadius: '10px',
    padding: '20px',
  }}>
    <Modal.Title style={{
      fontWeight: 'bold',
      fontSize: '22px',
      letterSpacing: '1px',
      textTransform: 'uppercase',  // Para um toque mais moderno
    }}>
      {editingProduct ? 'Editar Produto' : 'Novo Produto'}
    </Modal.Title>
  </Modal.Header>
  
  <Form onSubmit={handleSubmit}>
    <Modal.Body style={{ backgroundColor: '#2c2c2c', padding: '30px',}}>
      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#f8f9fa', fontWeight: '500' }}>Nome</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={{

            backgroundColor: '#444',
            color: '#f8f9fa',
            borderColor: '#555',
            padding: '12px',
            fontSize: '16px',
          }}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#f8f9fa', fontWeight: '500' }}>Descrição</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          style={{
            backgroundColor: '#444',
            color: '#f8f9fa',
            borderColor: '#555',
            padding: '12px',
            fontSize: '16px',
          }}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#f8f9fa', fontWeight: '500' }}>Preço</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          step="0.01"
          min="0"
          required
          style={{
            backgroundColor: '#444',
            color: '#f8f9fa',
            borderColor: '#555',
            padding: '12px',
            fontSize: '16px',
          }}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ color: '#f8f9fa', fontWeight: '500' }}>Imagem</Form.Label>
        <Form.Control
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          required={!editingProduct}
          style={{
            backgroundColor: '#444',
            color: '#f8f9fa',
            borderColor: '#555',
            padding: '12px',
          }}
        />
      </Form.Group>
    </Modal.Body>

    <Modal.Footer style={{
      backgroundColor: '#333',
      borderTop: '1px solid #444',
    
    }}>
      <Button 
        variant="secondary" 
        onClick={handleCloseModal}
        style={{
          backgroundColor: '#555',
          borderColor: '#444',
          borderRadius: '',
          padding: '10px 20px',
        }}
      >
        Cancelar
      </Button>
      <Button 
        variant="primary" 
        type="submit"
        style={{
          backgroundColor: '#007bff',
          borderColor: '#0056b3',
          borderRadius: '',
          padding: '10px 20px',
          fontWeight: '600',
        }}
      >
        Salvar
      </Button>
    </Modal.Footer>
  </Form>
</Modal>

  </Container>
  
  );
};

export default AdminProductManager;
