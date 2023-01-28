import React from 'react';
import { IProduct } from './Products';

const cartString = localStorage.getItem('cart');

let localProducts = cartString ? JSON.parse(cartString) : [];

export const addProduct = (product: IProduct) => {
	let existingProduct = localProducts.find((p: IProduct) => p.id === product.id);
    if(existingProduct) {
        existingProduct.quantity = existingProduct.quantity + 1;
    } else {
        localProducts = [...localProducts, {...product, quantity: 1}];
    }
    localStorage.setItem('cart', JSON.stringify(localProducts));
};

export const updateQuantity = (id: string, quantity: number) => {
	localProducts = localProducts.map((product: IProduct) => {
		if (product.id === id.toString()) {
			return { ...product, quantity: quantity };
		}
	  
	  return product;
	});
	localStorage.setItem('cart', JSON.stringify(localProducts));
  };
  

export const removeProduct = (id : IProduct) => {
	localProducts = localProducts.filter((product : IProduct) => product.id !== (id as any).id);
	localStorage.setItem('cart', JSON.stringify(localProducts));
};

export function Cart() {
	const [showCartItems, setShowCartItems] = React.useState(false);
	
	const [quantity, setQuantity] = React.useState(localProducts);

	React.useEffect(() => {
	setQuantity(localProducts);
	}, [localProducts])

	const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
	};

	const handleRemoveProduct = (id : IProduct) => {
		removeProduct(id);
		setShowCartItems(!showCartItems);
	};

	const toggleCartItems = () => {
		setShowCartItems(!showCartItems);
	};
	
	React.useEffect(() => {
		const handleClick = (event: string) => {
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
	                    hover:scale-105 transition-all duration-1000 z-50
	                    bg-slate-200 py-2 ${
												showCartItems ? 'block ' : 'hidden '
											} custom-scrollbar shadow-2xl`}
			>
				{Object.keys(localProducts).length === 0 ? (
					<p className="p-3 m-3 text-lg ">
						Your cart is empty. <br /> You can try adding some stuff in here first &#128513;
					</p>
				) : (
					localProducts.map((item : IProduct, index : number) => (
						<div key={index}>
							<div className="flex items-center text-lg text-center">
								<div>{item.productImages.map((imgURL : string, index : number) => (
										<img
											className="w-1/2 m-10 rounded-3xl"
											key={index}
											src={imgURL}
											alt={item.name}
										/>
									))}
								</div>
									{item.name} - Quantity: {item.quantity} - Price: {item.price}
							</div>
							<button
								className="p-2 m-2 text-4xl border-4 rounded-full text-white bg-gradient-to-r from-red-300 to-gray-300
									  hover:border-slate-400 duration-1000 shadow-2xl"
								onClick={() => {
									alert('The product has been removed from the cart');
									handleRemoveProduct({ id: item.id } as IProduct)
								}}
							>
								Remove
							</button>
							<button
								className="p-2 m-2 w-3/12 text-4xl border-4 rounded-full text-white bg-gradient-to-r from-green-300 to-gray-300
									  hover:border-slate-400 duration-1000 shadow-2xl"
								onClick={() =>
									alert('We are working on this functionality here, update will be ready soon')
								}
							>
								checkout
							</button>
							<input
								className="p-2 m-2 w-14 rounded-full"
								type="number"
								value={item.quantity}
								onChange={(event) => handleUpdateQuantity(item.id, parseInt(event.target.value))}
								/>
						</div>
					))
				)}
			</div>
		</div>
	);
}
