import React from "react";
import { useParams } from "react-router-dom";
import { collection, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const DetailsPage = () => {
  // const { id } = useParams();
  // const [product, setProduct] = React.useState<IProduct | null>(null);

  // const productRef = collection(db, "products");

  // React.useEffect(() => {
  //   if(id) {
  //     getDoc(productRef, id).then((product) => {
  //       setProduct(product);
  //     });
  //   }
  // }, [id]);

  // return (
  //   <div className="flex justify-center items-center h-screen">
  //     {product && (
  //       <div className="bg-slate-200 rounded-lg shadow-2xl font-display p-1 m-1">
  //         <div className="font-semibold p-3 text-xl ">
  //           <h1> {product.name}</h1>
  //           <p> By: {product.username} </p>
  //         </div>
  //         <img src={product.productImages[0]} alt={product.name} className="w-full h-64" />
  //         <div className="p-2 m-2 max-h-20 w-fitt text-md overflow-x-auto rounded-xl custom-scrollbar">
  //           <p> {product.description} </p>
  //         </div>
  //         <div className="p-3 text-md">
  //           <p className="p-3 text-xl">Price : {product.price}</p>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

