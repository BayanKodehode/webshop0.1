import React from 'react';
import firebase from 'firebase';

const Likes = ({ product }) => {
  const [likes, setLikes] = React.useState(product.likes || 0);

  const handleLike = () => {
    setLikes(likes + 1);
    firebase.firestore().collection('products').doc(product.id).update({ likes: likes + 1 });
  };

  const handleDislike = () => {
    setLikes(likes - 1);
    firebase.firestore().collection('products').doc(product.id).update({ likes: likes - 1 });
  };

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      <button onClick={handleDislike}>Dislike</button>
      <p>Likes: {likes}</p>
    </div>
  );
};

export default Likes;
