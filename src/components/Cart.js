import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filtrar itens com quantidade maior que 0 antes de atualizar o estado
      const itemsWithNumberPrice = response.data
        .filter(item => item.quantity > 0)
        .map(item => ({
          ...item,
          price: Number(item.price)
        }));

      setCartItems(itemsWithNumberPrice);
      calculateTotal(itemsWithNumberPrice);
    } catch (error) {
      setError('Erro ao carregar itens do carrinho');
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
    setTotal(sum);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setError('Quantidade inválida');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      await axios.put(
        `http://localhost:3001/api/cart/update/${productId}`,
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setCartItems(prevItems => {
        const updatedItems = prevItems.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        calculateTotal(updatedItems); // Agora calcula corretamente
        return updatedItems;
      });
    } catch (error) {
      setError('Erro ao atualizar quantidade');
      console.error('Erro ao atualizar quantidade', error);
    }
  };
  

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedItems = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      // Se a quantidade do item for 0, remova-o completamente
      const filteredItems = updatedItems.filter(item => item.quantity > 0);

      // Atualizando o carrinho e recalculando o total
      setCartItems(filteredItems);
      calculateTotal(filteredItems);

      // Se o carrinho ficar vazio, limpar a mensagem de erro
      if (filteredItems.length === 0) {
        setError('');
      }

      // Atualizar a quantidade no backend
      await axios.put(
        `http://localhost:3001/api/cart/update/${productId}`,
        { quantity: updatedItems.find(item => item.id === productId).quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError('Erro ao remover item do carrinho');
      console.error('Erro ao remover item do carrinho', error);
    }
  };

  const handleClearCart = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('http://localhost:3001/api/cart/clear', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems([]);
      setTotal(0);
    } catch (error) {
      setError('Erro ao limpar carrinho');
    }
  };

  const handleCheckout = () => {
    const message = cartItems
      .map(item => `${item.name} - ${item.quantity}x - R$ ${(Number(item.price) * item.quantity).toFixed(2)}`)
      .join('\n');
    
    const whatsappNumber = '5585996633627'; // Substitua pelo número do WhatsApp
    const whatsappMessage = encodeURIComponent(
      `Olá! Gostaria de fazer um pedido:\n\n${message}\n\nTotal: R$ ${total.toFixed(2)}`
    );
    
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');
  };

  const formatPrice = (price) => {
    const numericPrice = Number(price);
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  if (cartItems.length === 0) {
    return (
      <Container className="mt-5 text-center" style={{ backgroundColor: '#212529', color: '#fff', padding: '50px 20px', borderRadius: '10px' }}>
        <FontAwesomeIcon icon={faShoppingCart} size="3x" className="mb-3" />
        <h3>Seu carrinho está vazio</h3>
      </Container>
    );
  }

  return (
    <Container className="mt-4" style={{ backgroundColor: '#343a40', color: '#000', padding: '30px', borderRadius: '10px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)' }}>
      <h2 className="mb-4" style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#f8f9fa' }}>Seu Carrinho</h2>
      {error && <Alert variant="danger" style={{ borderRadius: '8px' }}>{error}</Alert>}
      
      <Table responsive striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>R$ {formatPrice(item.price)}</td>
              <td>
                <input 
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="form-control"
                  style={{ width: '80px', borderRadius: '5px' }}
                />
              </td>
              <td>R$ {formatPrice(item.price * item.quantity)}</td>
              <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id)}
                  style={{
                    borderRadius: '50%',
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    border: 'none'
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <div>
          <h4 style={{ fontFamily: 'Arial, sans-serif', fontWeight: '600', color: '#f8f9fa' }}>Total: R$ {formatPrice(total)}</h4>
          <Button
            variant="danger"
            onClick={handleClearCart}
            style={{
              backgroundColor: '#dc3545',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 'bold'
            }}
          >
            Limpar Carrinho
          </Button>
        </div>
        <Button
          variant="success"
          onClick={handleCheckout}
          style={{
            backgroundColor: '#28a745',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold'
          }}
        >
          Finalizar Compra
        </Button>
      </div>
    </Container>
  );
};

export default Cart;
