import React from 'react';
import { auth, storage } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Likes from './Likes';
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { addProduct } from './Cart';

export interface IProduct {
	id: string;
	name: string;
	username: string;
	description: string;
	price: number;
	productImages: string[];
	quantity: number;
}

interface ProductProps {
	product: IProduct;
}

export const Products = ({ product }: ProductProps) => {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const [imageUrls, setImageUrls] = React.useState<string[]>([]);

	const addToCart = (product: IProduct) => {
		addProduct(product);
	};

	const detailesHandleClick = () => {
		navigate('/details', { state: { product } });
	};

	const imagesListRef = ref(storage, 'productImages/');
	React.useEffect(() => {
		listAll(imagesListRef).then((response) => {
			response.items.forEach((item) => {
				getDownloadURL(item).then((url) => {
					setImageUrls((prev) => [...prev, url]);
				});
			});
		});
	}, [product]);

	return (
		<div onClick={detailesHandleClick}
			className="bg-slate-200 rounded-lg shadow-2xl font-display p-1 m-1 
						hover:scale-105 transition-transform delay-150 cursor-pointer "
		>
			<div className="font-semibold p-3 text-xl ">
				<h1> {product?.name}</h1>
			</div>
			<p> By: {product?.username} </p>

			{product.productImages.map((imgURL, index) => {
				return (
					<img className="rounded-lg" 
						key={index}
						src={imgURL}
						alt={product.name}
					/>
				);
			})}

			<div className="p-2 m-2 max-h-20 w-fitt text-md overflow-x-auto rounded-xl 
							custom-scrollbar">
				<p> {product?.description} </p>
			</div>
			<div className="p-3 text-md">
				<Likes product={product} />
				Rates:
				<button className="text-yellow-600 z-auto">&#9733;&#9733;&#9733;&#9733;&#9734;</button>
				<p className="p-3 text-xl z-auto">Price : {product?.price}</p>
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
	);
};
