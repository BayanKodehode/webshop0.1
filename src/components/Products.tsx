import React, { useEffect, useState } from "react";
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth, storage } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import CommentSection from "./CommentSection";
import Likes from "./Likes";
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

export interface IProduct {
  id: string;
  name: string;
  username: string;
  description: string;
  price: number;
  productImages: string[];
}

interface ProductProps {
  product: IProduct;
}

export const Products = (productProps: ProductProps) => {
  const { product } = productProps;
  const [user] = useAuthState(auth);
  const [cart, setCartProduct] = useState<{ userId: string; productId: string }[] | null>(null);
  const cartRef = collection(db, "cart");
  const cartDoc = query(cartRef, where("productId", "==", product.id));
  
  const [imageUrls, setImageUrls] = useState([]);

  const addProductToCart = async () => {
    try {
      const newCartDoc = await addDoc(cartRef, {
        userId: user?.uid,
        productId: product?.id,
      });
      if (user) {
        setCartProduct((prev) =>
          prev
            ? [...prev, { userId: user.uid, productId: product?.id }]
            : [{ userId: user.uid, productId: product.id }]
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imagesListRef = ref(storage, "productImages/");
  useEffect(() => {
      listAll(imagesListRef).then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item).then((url) => {
            setImageUrls((prev) => [...prev, url]);
          });
        });
      });
    }, [product.productImages]);

  
  return (
    <div 
      className="bg-slate-200 rounded-lg shadow-2xl font-display p-1 m-1 
                    hover:scale-105 transition-transform delay-150 "
    >
      <div className="font-semibold p-3 text-xl ">
        <h1> {product?.name}</h1>
        <p> By: {product?.username} </p>
      </div>
      
      {product.productImages.map((imgURL, index) => {
        return <img key={index} src={imgURL} alt={product.name}/>
      })}

      <div className="p-2 m-2 max-h-20 w-fitt text-md overflow-x-auto rounded-xl custom-scrollbar">
        <p> {product?.description} </p>
      </div>
      <div className="p-3 text-md">
        <Likes product={product} />
        Rates:
        <button className="text-yellow-600">&#9733;&#9733;&#9733;&#9733;&#9734;</button>
        <p className="p-3 text-xl">Price : {product?.price}</p>
        <CommentSection product={product} />
        <button
          className="m-1 px-3 hover:bg-slate-400
                          duration-1000 border border-slate-600 rounded-full"
          onClick={() => addProductToCart()}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
