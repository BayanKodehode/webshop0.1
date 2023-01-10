import { useState, useEffect } from "react";
import { Products }  from "../components/Products";
import ShoppingCart from "../components/ShoppingCart";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export interface Product {
  id: string;
  userId: string;
  name: string;
  username: string;
  description: string;
}

export const MainPage = () => {

  const [productsList, setProductsList] = useState<Product[] | null>(null);
  const productsRef = collection(db, "products");
  
  const getProducts = async () => {
    const data = await getDocs(productsRef);
    setProductsList(
      data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Product[]
    );
  };
  useEffect(() => {
    getProducts();
  }, []);
  
  return (
    <div >
      <div className="flex justify-center m-5 p-5">
        {productsList?.map((product, index) => (
          <Products key={index} product={product} />
        ))}
      </div>
      <ShoppingCart />
    </div>
  );
};

  
