import React from "react";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

const ShoppingCart = () => {
  // const [cart, setCart] = React.useState([]);

  // React.useEffect(() => {
  //   const fetchData = async () => {
  //     const snapshot = await collection(db, "cart").get();
  //     const data = snapshot.docs.map((doc) => doc.data());
  //     setCart(data);
  //   };
  //   fetchData();
  // }, []);

  // const handleAddToCart = (product) => {
  //   setCart([...cart, product]);
  //   collection(db, "cart").add(product);
  // };

  // const handleRemoveFromCart = (productId) => {
  //   setCart(cart.filter((product) => product.id !== productId));
  //   collection(db, "cart").doc(productId).delete();
  // };

  // return (
  //   <div>
  //     {cart.map((product) => (
  //       <div key={product.id}>
  //         <h2>{product.name}</h2>
  //         <button onClick={() => handleRemoveFromCart(product.id)}>
  //           Remove from Cart
  //         </button>
  //       </div>
  //     ))}
  //   </div>
  // );
};

export default ShoppingCart;
