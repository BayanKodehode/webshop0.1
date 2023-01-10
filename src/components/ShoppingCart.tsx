import React from 'react';
import firebase from 'firebase';

const ShoppingCart = () => {
  const [cart, setCart] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const snapshot = await firebase.firestore().collection('cart').get();
      const data = snapshot.docs.map(doc => doc.data());
      setCart(data);
    };
    fetchData();
  }, []);

  const handleAddToCart = product => {
    setCart([...cart, product]);
    firebase.firestore().collection('cart').add(product);
  };

  const handleRemoveFromCart = productId => {
    setCart(cart.filter(product => product.id !== productId));
    firebase.firestore().collection('cart').doc(productId).delete();
  };

  return (
    <div>
      {cart.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <button onClick={() => handleRemoveFromCart(product.id)}>Remove from Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ShoppingCart;
