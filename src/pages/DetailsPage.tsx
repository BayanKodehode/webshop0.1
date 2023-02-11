import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { collection, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { IProduct } from '../components/Products';
import { addProduct } from '../components/Cart';
import CommentSection from '../components/CommentSection';
import Likes from '../components/Likes';

export const DetailsPage = () => {
	const location = useLocation();
	const product = location.state.product as IProduct;

	const addToCart = (product: IProduct) => {
		addProduct(product);
	};

	return (
		<div className="flex justify-center">
				{/* Left col */}
			<div
				className="	flex w-3/4 bg-slate-200 rounded-lg 
                    		shadow-2xl font-display p-5 m-5"
			>
				<div className="font-display p-3 m-3 w-3/4 h-auto">
					<div className="font-semibold text-xl">
						<h1> {product.name} </h1>
					</div>
					<p> By: {product.username} </p>
					<div className="p-2 m-2  w-fitt text-md rounded-lg">
						<p> {product.description} </p>
					</div>
					<Likes 	product={product} />
					Rates:
					<button onClick={() => {
							alert('Rates functionality are not available yet');
							}}
							className="text-yellow-600"
					>&#9733;&#9733;&#9733;&#9733;&#9734;</button>
					<CommentSection product={product} />
				</div>

				{/* Right col */}
				<div className="flex flex-col justify-center">
					<img
						src={product.productImages[0]}
						alt={product.name}
						className=" rounded-lg w-64 h-64"
					/>
					<div className="p-3 text-md">
						<p className="p-3 text-xl">Price : {product.price}</p>
					</div>
					<button
						className="m-1 px-3 hover:bg-slate-400 z-auto
                    duration-1000 border border-slate-600 rounded-full"
						onClick={() => addToCart(product)}
					>
						Add to Cart
					</button>
					<button
						className="m-1 px-3 bg-lime-600 hover:bg-slate-400 z-auto
                    duration-1000 border border-slate-600 rounded-full"
						onClick={() => {
							alert('the Buy functionality is comming soon');
						}}
					>
						Buy
					</button>
				</div>
			</div>
		</div>
	);
};
