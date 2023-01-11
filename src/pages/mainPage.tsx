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

interface CartItem {
  product: Product;
  quantity: number;
}

export const MainPage = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addProductToCart = (product: Product) => {
    const foundProduct = cart.find((item) => item.product.id === product.id);
    if (foundProduct) {
      setCart(
        cart.map((item) => (item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      );
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };
  
  return (
    <div >
      {products.map((product) => (
        <div key={product.id} className="flex justify-center m-5 p-5">
          <Products product={product} addProductToCart={addProductToCart}/>
        </div>
      ))}
      <ShoppingCart addProductToCart={addProductToCart}/>
    </div>
  );
};

  
 // const [productsList, setProductsList] = useState<Product[] | null>(null);
  // const productsRef = collection(db, "products");
  
  // const getProducts = async () => {
  //   const data = await getDocs(productsRef);
  //   setProductsList(
  //     data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Product[]
  //   );
  // };
  // useEffect(() => {
  //   getProducts();
  // }, []);


   {/* <div className="flex justify-center m-5 p-5">
        {productsList?.map((product, index) => (
          <Products key={index} product={product} />
          
        ))}
      </div> */}