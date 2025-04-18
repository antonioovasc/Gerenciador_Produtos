import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FaSearch } from 'react-icons/fa'; 

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      const productsWithNumberPrice = response.data.map(product => ({
        ...product,
        price: Number(product.price),
      }));
      setProducts(productsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar produtos');
    }
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3001/api/cart/add',
        {
          productId: selectedProduct.id,
          quantity: parseInt(quantity),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowModal(false);
      setQuantity(1);
    } catch (error) {
      setError('Erro ao adicionar ao carrinho');
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  return (
    <div
      className="container-fluid p-4"
      style={{
        background: 'linear-gradient(135deg, #1e1e1e, #333333)',
        width: '100vw',
        minHeight: '100vh',
        color: '#ffffff',
      }}
    >
      {/* Campo de Busca */}
    

      <Form.Group className="mb-4">
  <div style={{ position: 'relative' }}>
    <Form.Control
      type="text"
      placeholder="Buscar item..."
      value={search}
      onChange={handleSearchChange}
      style={{
        borderRadius: '50px',  // Bordas mais arredondadas
        padding: '12px 40px 12px 16px',  // Ajustando o padding para o ícone
        backgroundColor: '#333',  // Fundo mais elegante
        border: '1px solid #555',  // Borda mais suave
        color: '#ffffff',
        fontSize: '16px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',  // Sombra sutil para dar profundidade
        transition: 'all 0.3s ease',  // Transição suave para interações
      }}
    />
    <FaSearch
      style={{
        position: 'absolute',
        top: '50%',
        right: '16px',
        transform: 'translateY(-50%)',
        color: '#ffffff',
        fontSize: '18px',
      }}
    />
  </div>
</Form.Group>

<style jsx>{`
  input::placeholder {
    color: #bbb;  // Placeholder com cor suave
  }

  input:focus {
    border-color: #007bff;  // Borda azul ao focar no campo
    outline: none;  // Remover o contorno padrão do navegador
    box-shadow: 0 0 12px rgba(0, 123, 255, 0.5);  // Efeito de foco com sombra azul
  }
`}</style>


      {error && (
        <Alert
          variant="danger"
          style={{
            backgroundColor: '#ff4d4d',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            marginBottom: '20px',
          }}
        >
          {error}
        </Alert>
      )}

      <Row xs={1} sm={2} md={3} lg={4} xl={5} className="g-4">
        {filteredProducts.map((product) => (
          <Col key={product.id}>
            <Card
              style={{
                backgroundColor: '#424242',
                border: 'none',
                borderRadius: '18px',
                boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              className="hover-card"
            >
              <Card.Img
                variant="top"
                src={`http://localhost:3001/uploads/${product.image}`}
                alt={product.name}
                style={{
                  height: '300px',
                  objectFit: 'cover',
                  borderTopLeftRadius: '18px',
                  borderTopRightRadius: '18px',
                }}
              />
              <Card.Body>
                <Card.Title
                  style={{
                    color: '#f8f9fa',
                    fontSize: '18px',
                    fontWeight: '500',
                    marginBottom: '15px',
                  }}
                >
                  {product.name}
                </Card.Title>
                <Card.Text
                  style={{
                    color: '#bbb',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    marginBottom: '15px',
                  }}
                >
                  {product.description}
                </Card.Text>
                <Card.Text className="h5 text-warning">
                  R$ {formatPrice(product.price)}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowModal(true);
                  }}
                  style={{
                    background: 'linear-gradient(90deg, #007bff, #0056b3)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '16px',
                    letterSpacing: '1px',
                    boxShadow: '0px 6px 15px rgba(0, 123, 255, 0.6)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  }}
                  className="w-100"
                >
                  <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                  Adicionar ao Carrinho
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: '#333333' }}>
          <Modal.Title style={{ color: '#f8f9fa' }}>Adicionar ao Carrinho</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#424242' }}>
          <Form>
            <Form.Group>
              <Form.Label style={{ color: '#bbb' }}>Quantidade</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: '#2a2a2a',
                  border: '1px solid #444',
                  color: '#ffffff',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => e.target.style.border = '1px solid #007bff'}
                onBlur={(e) => e.target.style.border = '1px solid #444'}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: '#333333' }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{
              background: '#6c757d',
              color: '#fff',
              borderRadius: '10px',
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleAddToCart}
            style={{
              background: 'linear-gradient(90deg, #007bff, #0056b3)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '16px',
              letterSpacing: '1px',
              boxShadow: '0px 6px 15px rgba(0, 123, 255, 0.5)',
              transition: '0.3s ease-in-out',
            }}
          >
            Adicionar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
