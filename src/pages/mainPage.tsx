import { useState, useEffect } from 'react';
import { Products, IProduct } from '../components/Products';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase';

export const MainPage = () => {
	const [products, setProducts] = useState<IProduct[]>([]);

	useEffect(() => {
		const productsRef = collection(db, 'products');
		getDocs(productsRef).then((querySnapshot) => {
			const products = querySnapshot.docs.map((doc) => {
				const data = doc.data();
				return { id: doc.id, ...data } as IProduct;
			});
			setProducts(products);
		});
	}, []);

	return (
		<div className="flex flex-row flex-wrap items-center">
			{products.map((product, index) => (
				<div
					key={product.id}
					className="w-80 h-70 m-5 py-5"
				>
					<Products product={product} />
				</div>
			))}
		</div>
	);
};
