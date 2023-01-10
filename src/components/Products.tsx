import React from 'react';
import firebase from 'firebase';

// Components
import Likes from './Likes';
import Comments from './Comments';

const Products = () => {
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const snapshot = await firebase.firestore().collection('products').get();
      const data = snapshot.docs.map(doc => doc.data());
      setProducts(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <img src={product.imageUrl} alt={product.name} />
          <p>Store: {product.store}</p>
          <Likes product={product} />
          <Comments product={product} />
        </div>
      ))}
    </div>
  );
};

export default Products;
