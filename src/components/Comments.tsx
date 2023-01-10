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

const Comments = ({ product }) => {
  const [comments, setComments] = React.useState(product.comments || []);
  const [newComment, setNewComment] = React.useState('');

  const handleChange = event => {
    setNewComment(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    setComments([...comments, newComment]);
    collection(db, 'products').doc(product.id).update({ comments: [...comments, newComment] });
    setNewComment('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={newComment} onChange={handleChange} />
        <button type="submit">Add Comment</button>
      </form>
      {comments.map((comment, index) => (
        <p key={index}>{comment}</p>
      ))}
    </div>
  );
};

export default Comments;
