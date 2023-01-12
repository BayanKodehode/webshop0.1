import React from "react";
import {  
  collection,
  query,
  where,
  doc,
  getDocs,
 } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface CartItem {
  userId: string;
  productId: string;
}

interface IProduct {
  id: string;
  name: string;
  username: string;
  description: string;
  price: number;
}

const shoppingCartStyle = {
  position: "relative",
};

const cartStyle = {
  display: "none",
  position: "absolute",
  zIndex: 1,
  width: "200px",
  backgroundColor: "white",
  boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
  padding: "12px 16px",
};

export function ShoppingCart() {
  const [showCartItems, setShowCartItems] = React.useState(false);
  const [user] = useAuthState(auth);
  const [cart, setCart] = React.useState<CartItem[]>(null);
  const cartRef = collection(db, "cart");
  const [product, setProduct] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

 const getProduct = (productId: string) => {
    const productRef = db.collection('products').doc(productId);
    return productRef.onSnapshot((doc) => {
      if (doc.exists) {
        setProduct(doc.data());
      } else {
        console.log("No such document!");
      }
    });
  }

React.useEffect(() => {
    if (!user) {
      return;
    }
    let subscription
    setLoading(true);
    const getCartItems = async () => {
      try {
        // const data = await getDocs(query(db.collection("cart"), where("userId", "==", user.uid)));
        const data = await collection(db,"cart");
        const cartItems = data.docs.map((doc) => doc.data());
        setCart(cartItems);
        let products = []
        for (const item of cartItems) {
          const product = await getProduct(item.productId);
          if (product) {
            products.push(product);
          }
        }
        setProduct(products)
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getCartItems();
    return () => subscription && subscription()
  }, [user]);


  
  
  const toggleCartItems = () => {
    setShowCartItems(!showCartItems);
  };

  return (
    <div style={shoppingCartStyle}>
      <button onClick={toggleCartItems}>
        <>&#128722;</>
      </button>
      <div
        style={{ ...cartStyle, display: showCartItems ? "block" : "none" }}
      >
        {!loading ? (
          <div>
            {product && !loading && product.map((p) => (
              <div key={p.id}>
                <p>Name: {p.name}</p>
                <p>Description: {p.description}</p>
                <p>Price: {p.price}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
