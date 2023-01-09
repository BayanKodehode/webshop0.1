
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../config/firebase";
import { Post as IPost } from "./mainPage";

interface Props {
  post: IPost;
}

interface Like {
  likeId: string;
  userId: string;
}

interface Comment {
  commentId: string;
  userId: string;
  text: string;
}

export const Post = (props: Props, comment: Comment) => {
  const { post } = props;
  const [user] = useAuthState(auth);
  // likes
  const [likes, setLikes] = useState<Like[] | null>(null);

  const likesRef = collection(db, "likes");

  const likesDoc = query(likesRef, where("postId", "==", post.id));

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
        postId: post.id,
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
        where("postId", "==", post.id),
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

  // comments

  const [userComment, setComment] = useState("");
  const changeComment = ({ target }: any) => {
    setComment(target.value);
  };

  const [comments, setComments] = useState<Comment[] | null>(null);

  const commentsRef = collection(db, "comments");

  const commentsDoc = query(commentsRef, where("postId", "==", post.id));

  const getComments = async () => {
    const data = await getDocs(commentsDoc);
    setComments(
      data.docs.map((doc) => ({
        userId: doc.data().userId,
        commentId: doc.id,
        text: userComment,
      }))
    );
  };

  const addComment = async () => {
    try {
      const newDoc = await addDoc(commentsRef, {
        userId: user?.uid,
        postId: post.id,
        text: userComment,
      });
      if (user) {
        setComments((prev) =>
          prev
            ? [
                ...prev,
                { userId: user.uid, commentId: newDoc.id, text: comment.text },
              ]
            : [{ userId: user.uid, commentId: newDoc.id, text: comment.text }]
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeComment = async () => {
    try {
      const commentToDeleteQuery = query(
        commentsRef,
        where("postId", "==", post.id),
        where("userId", "==", user?.uid)
      );

      const commentToDeleteData = await getDocs(commentToDeleteQuery);
      const commentId = commentToDeleteData.docs[0].id;
      const commentToDelete = doc(db, "Comments", commentId);
      await deleteDoc(commentToDelete);
      if (user) {
        setComments(
          (prev) =>
            prev && prev.filter((comment) => comment.commentId !== commentId)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const hasUserCommented = comments?.find(
    (comment) => comment.userId === user?.uid
  );

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="post">
      <div className="title">
        <h1> {post.title}</h1>
      </div>
      <div className="main">
        <p> {post.description} </p>
      </div>
      <div className="body">
        <p> @{post.username} </p>
        <button onClick={hasUserLiked ? removeLike : addLike}>
          {hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
        </button>
        {likes && <p> Likes: {likes?.length} </p>}
      </div>
      <div className="comments">
        <p>{userComment}</p>
        <input onChange={changeComment} placeholder="say something nice" />
        <button
          type="submit"
          onClick={hasUserCommented ? removeComment : addComment}
        >
          {hasUserCommented ? <> Remove a Comment </> : <>Add a Comment</>}
        </button>
        <p>{comments && <p> {comments?.length} Comments </p>}</p>
      </div>
    </div>
  );
};
