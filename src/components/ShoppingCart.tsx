import React, { useState, useEffect } from "react";
import { db, auth } from "../config/firebase";
import { collection } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from 'firebase/app'; import 'firebase/firestore';
interface ShoppingCartProps {
  addProductToCart: (product: IProduct) => void;
}

const shoppingCartStyle = {
  position: "relative",
};

const cartItemsStyle = {
  display: "none",
  position: "absolute",
  zIndex: 1,
  width: "200px",
  backgroundColor: "white",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  padding: "12px 16px",
};

export function ShoppingCart(props: ShoppingCartProps) {
  const [cart, setCart] = useState<IProduct[]>([]);
  const [showCartItems, setShowCartItems] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
      if (user) {
        // if user is logged in, retrieve their cart items from the Firestore database
        const cartRef = collection(db, 'cart').where('userId', '==', user.uid);          cartRef.onSnapshot((snapshot) => {
          const cartItems = snapshot.docs.map((doc) => {
            const data = doc.data();
            return { id: doc.id, ...data };
          });
          setCart(cartItems);
        });
      }
  }, []);

  const toggleCartItems = () => {
    setShowCartItems(!showCartItems);
  };

  return (
    <div style={shoppingCartStyle}>
      <button onClick={toggleCartItems}>Shopping Cart</button>
      <div style={{ ...cartItemsStyle, display: showCartItems ? "block" : "none" }}>
        <h1>Shopping Cart</h1>
        {cart &&
          cart.map((product) => (
            <div>
              <p>{product.name}</p>
              <p>{product.price}</p>
              <button onClick={() => props.addProductToCart(product)}>
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};
