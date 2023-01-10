import React from 'react';
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
import { Product as IProduct } from "../pages/mainPage";

interface ProductProps {
  product: IProduct;
}

interface Like {
  likeId: string;
  userId: string;
}

const Likes = (productProps: ProductProps) => {
  const { product } = productProps;
  const [likes, setLikes] = React.useState<Like[] | null>(null);

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

  useEffect(() => {
    getLikes();
  }, []);

  return(
      <div className="">
        <p> @{product.username} </p>
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p> Likes: {likes?.length} </p>}
      </div>
  )
};

export default Likes;



  // const [likes, setLikes] = React.useState(product.likes || 0);

  // const handleLike = () => {
  //   setLikes(likes + 1);
  //   collection(db, 'products').doc(product.id).update({ likes: likes + 1 });
  // };

  // const handleDislike = () => {
  //   setLikes(likes - 1);
  //   collection(db, 'products').doc(product.id).update({ likes: likes - 1 });
  // };

  // return (
  //   <div>
  //     <button onClick={handleLike}>Like</button>
  //     <button onClick={handleDislike}>Dislike</button>
  //     <p>Likes: {likes}</p>
  //   </div>
  // );
