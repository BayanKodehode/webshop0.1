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
import { db, auth } from "../config/firebase";
import { IProduct } from "../components/Products";
import { useAuthState } from "react-firebase-hooks/auth";

interface CommentProps {
  product: IProduct;
}

interface Comment {
  commentId: string;
  userId: string;
  comment: string;
}

const CommentSection = (props: CommentProps) => {
  const { product } = props;
  const [comments, setComments] = React.useState<Comment[] | null>(null);
  const [newComment, setNewComment] = React.useState<string>("");
  const [user] = useAuthState(auth);
  const commentsRef = collection(db, "comments");
  const commentsDoc = query(commentsRef, where("productId", "==", product?.id));

  const getComments = async () => {
    try {
      if (!user) return;
      const data = await getDocs(commentsDoc);
      setComments(
        data.docs.map((doc) => ({
          userId: doc.data().userId,
          commentId: doc.id,
          comment: doc.data().comment,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
   
    try {
      if (!user) return;
      const newDoc = await addDoc(commentsRef, {
        userId: user.uid,
        productId: product?.id,
        comment: newComment,
      });
      setComments((prev) =>
        prev
          ? [
              ...prev,
              {
                userId: user.uid,
                commentId: newDoc.id,
                comment: newComment,
              },
            ]
          : [
              {
                userId: user.uid,
                commentId: newDoc.id,
                comment: newComment,
              },
            ]
      );
      setNewComment("");
      // e.preventDefault();
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async () => {
    try {
      if (!user) return;
      const commentToDeleteQuery = query(
        commentsRef,
        where("productId", "==", product?.id),
        where("userId", "==", user.uid)
      );

      const commentToDeleteData = await getDocs(commentToDeleteQuery);
      const commentId = commentToDeleteData.docs[0].id;
      const commentToDelete = doc(db, "comments", commentId);
      await deleteDoc(commentToDelete);
      setComments(
        (prev) =>
          prev && prev.filter((comment) => comment.commentId !== commentId)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserCommented = comments?.find(
    (comment) => comment.userId === user?.uid
  );

  React.useEffect(() => {
    getComments();
    // handleCommentSubmit();
  }, []);

  return (
    <div >
      <form onSubmit={(e) => handleCommentSubmit(e)} >
        <input className='rounded-xl'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" onClick={hasUserCommented ? removeComment : handleCommentSubmit}>
        {hasUserCommented ? <>&#10008;</> : <>&#9997;</>}
        </button>
      </form>
      
      <div>
        {comments &&
          comments?.map((comment, index) => <p key={index}>{comment.comment}</p>)
          }
      </div>
    </div>
  );
};

export default CommentSection;
