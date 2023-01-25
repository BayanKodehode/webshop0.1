import React from 'react';
import { IProduct } from './Products';

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {};

export const cartReducer = (state, action) => {
	switch (action.type) {
		case 'add':
			return {
                ...state,
                [action.product?.id]: {
                    product: action.product,
                    quantity: (state[action.product?.id]?.quantity || 0) + 1
                }
            };

		case 'remove':
			const newState = { ...state };
			delete newState[action.productId];
			return newState;
		case 'increment':
			return {
				...state,
				[action.productId]: {
					...state[action.productId],
					quantity: state[action.productId].quantity + 1
				}
			};
		case 'decrement':
			return {
				...state,
				[action.productId]: {
					...state[action.productId],
					quantity: state[action.productId].quantity - 1
				}
			};
		default:
			return state;
	}
};

export function ShoppingCart() {
	const [showCartItems, setShowCartItems] = React.useState(false);
	const [cart, dispatch] = React.useReducer(cartReducer, initialState);

	const incrementQuantity = (productId: string) => {
		dispatch({ type: 'increment', productId });
	};

	const decrementQuantity = (productId: string) => {
		dispatch({ type: 'decrement', productId });
	};

	
	const removeFromCart = (productId: string) => {
		dispatch({ type: 'remove', productId });
	};

	const toggleCartItems = () => {
		setShowCartItems(!showCartItems);
	};

	React.useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cart));
	}, [cart]);
	
	React.useEffect(() => {
		const handleClick = (event: any) => {
			if (!event.target.closest('.shopping-cart-dropdown')) {
				setShowCartItems(false);
			}
		};
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	}, []);

	return (
		<div className="p-5 m-5 text-gray-800 shopping-cart-dropdown">
			<button
				className="p-2 text-4xl border-4 rounded-full bg-gradient-to-r from-indigo-300 to-gray-300
	                hover:border-slate-400 duration-1000 shadow-2xl"
				onClick={toggleCartItems}
			>
				<div>&#128722;</div>
			</button>
			<div
				className={`fixed top-40 right-80 w-7/12 max-h-96 overflow-y-auto rounded-xl
	                    hover:scale-105 transition-all duration-1000 
	                    bg-slate-200 py-2 ${
												showCartItems ? 'block ' : 'hidden '
											} custom-scrollbar shadow-2xl`}
			>
				{Object.keys(cart).length === 0 ? (

					<p className="p-3 m-3 text-lg ">
						Your cart is empty. <br /> You can try adding some stuff in here first &#128513;
					</p>
				) : ( Object.values(cart).map((p, index) => (

						<div
							key={p.id}
							className="p-2"
						>
							<p className="text-lg text-center">Name: {p.name}</p>

							{p.productImages.map((imgURL, index) => (
								<img
									key={index}
									src={imgURL}
									alt={p.name}
								/>
							))}

							<p className="text-lg">
								Quantity: {p.quantity}
							</p>
							<p className="text-lg">Total Cost: {p.price * p.quantity}</p>
							<button onClick={() => incrementQuantity(p.id)}>+</button>
							<button onClick={() => decrementQuantity(p.id)}>-</button>
							<button
								className="text-red-600"
								onClick={() => removeFromCart(p.id)}
							>
								Delete
							</button>
							
						</div>
					))
				)}
			</div>
		</div>
	);
}
