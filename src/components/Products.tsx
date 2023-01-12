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

export interface ProductProps {
  product: IProduct;
}

interface CartItem {
  userId: string;
  productId: string;
}

interface Like {
  likeId: string;
  userId: string;
}

interface IProduct {
  id: string;
  name: string;
  username: string;
  description: string;
  price: number;
}

export const Products = (productProps: ProductProps) => {
  const { product } = productProps;
  const [user] = useAuthState(auth);
  const [cart, setCartProduct] = useState<CartItem[] | null>(null);

  const cartRef = collection(db, "cart");
  const cartDoc = query(cartRef, where("productId", "==", product.id));
  
  const addProductToCart = async () => {
    try {
        const newCartDoc = await addDoc(cartRef,{
            userId: user?.uid,
            productId: product.id
        });
        if (user) {
            setCartProduct((prev) =>
              prev
                ? [...prev, { userId: user.uid, productId: product.id}]
                : [{ userId: user.uid, productId: product.id}]
            );
        }
    } catch (error) {
      console.log(error);
    }
};


  // likes
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");

  const likesDoc = query(likesRef, where("productId", "==", product.id));

  const getLikes = async () => {
    const data = await getDocs(likesDoc);
    setLikes(
      data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id }))
    );
  };
  const addLike = async () => {
    try {
      const newDoc = await addDoc(likesRef, {
        userId: user?.uid,
        productId: product.id,
      });
      if (user) {
        setLikes((prev) =>
          prev
            ? [...prev, { userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };
  const removeLike = async () => {
    try {
      const likeToDeleteQuery = query(
        likesRef,
        where("productId", "==", product.id),
        where("userId", "==", user?.uid)
      );

      const likeToDeleteData = await getDocs(likeToDeleteQuery);
      const likeId = likeToDeleteData.docs[0].id;
      const likeToDelete = doc(db, "likes", likeId);
      await deleteDoc(likeToDelete);
      if (user) {
        setLikes(
          (prev) => prev && prev.filter((like) => like.likeId !== likeId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

  React.useEffect(() => {
    getLikes();
  }, []);

  return (
    <div className="bg-slate-200 rounded-lg ">
      <div className="font-semibold p-5 text-2xl">
        <h1> {product.name}</h1>
        <p> By: {product.username} </p>
      </div>
      <div className="p-5 text-base">
        <p> {product.description} </p>
      </div>
      <div className="p-5 text-xl">
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p> Likes: {likes?.length} </p>}
        <p>Price : {product.price}</p>

        <button onClick={() => addProductToCart(product)}>Add to Cart</button>
      </div>
    </div>
  );
};
