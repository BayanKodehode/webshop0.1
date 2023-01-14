import { useState, useEffect } from "react";
import { Products }  from "../components/Products";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase";


export const MainPage = () => {
  const [products, setProducts] = useState<[]>([]);

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
    <div className="flex flex-row items-center justify-center">
      {products.map((product) => (
        <div key={product.id} className="w-60 m-5 pt-20">
          <Products product={product} />
        </div>
      ))}
    </div>
  );
};
