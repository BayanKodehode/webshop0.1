import React, { useEffect, useState } from "react";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import  CommentSection  from "./CommentSection";
import Likes from './Likes';

export interface IProduct {
  id: string;
  name: string;
  username: string;
  description: string;
  price: number;
  image: string;
  comments: string[];  
}

interface ProductProps {
  product: IProduct;
}

export const Products = (productProps: ProductProps) => {
  const { product } = productProps;
  const [user] = useAuthState(auth);
  const [cart, setCartProduct] = useState<
    { userId: string; productId: string }[] | null
  >(null);
  const cartRef = collection(db, "cart");
  const cartDoc = query(cartRef, where("productId", "==", product.id));

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


  return (
    <div
      className="bg-slate-200 rounded-lg shadow-2xl font-display
                    hover:scale-105 transition-transform delay-150 "
    >
      <div className="font-semibold p-3 text-2xl ">
        <h1> {product?.name}</h1>
        <p> By: {product?.username} </p>
      </div>
      <img src={product?.image} alt={product?.name} />
      <div className="p-3 text-md">
        <p> {product?.description} </p>
      </div>
      <div className="p-3 text-md">
        <Likes product={product}/>
        Rates:
        <button className="text-yellow-600">
          &#9733;&#9733;&#9733;&#9733;&#9734;
        </button>
        <p className="p-3 text-xl">Price : {product?.price}</p>
        <CommentSection product={product} />
        <button
          className="mx-1 px-4 hover:bg-slate-400
                          duration-1000 border border-slate-600 rounded-full"
          onClick={() => addProductToCart()}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
