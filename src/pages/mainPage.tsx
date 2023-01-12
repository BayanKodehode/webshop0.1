import { useState, useEffect } from "react";
import { Products }  from "../components/Products";
import { ShoppingCart } from "../components/ShoppingCart";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export interface Product {
  id: string;
  userId: string;
  name: string;
  username: string;
  description: string;
  price: number;
}

export const MainPage = () => {

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsRef = collection(db, "products");
    getDocs(productsRef).then((querySnapshot) => {
      const products = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Product;
        return { id: doc.id, ...data };
      });
      setProducts(products);
    });
  }, []);

  
  return (
    <div >
      {products.map((product) => (
        <div key={product.id} className="flex justify-center m-5 p-5">
          <Products product={product}/>
        </div>
      ))}
    <ShoppingCart />
    </div>
  );
};
