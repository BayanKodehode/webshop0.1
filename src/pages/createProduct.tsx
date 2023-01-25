import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db, storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, list } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

interface CreateFormData {
	name: string;
	description: string;
	productImages: FileList;
	price: number;
}

export const CreateProduct = () => {
	const [user] = useAuthState(auth);
	const navigate = useNavigate();
	const [imageUpload, setImageUpload] = React.useState<File | null>(null);
	const [imageUrls, setImageUrls] = React.useState<string[]>([]);

	const schema = yup.object().shape({
		name: yup.string().required('You must add a name to the new product.'),
		productImages: yup.string().required('You must add images to the new product.'),
		description: yup.string().required('You must add a description.'),
		price: yup.number().required('What is the price of the new product?')
	});

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<CreateFormData>({
		resolver: yupResolver(schema)
	});

	const productsRef = collection(db, 'products');

	const onCreateProduct = async (data: CreateFormData) => {
		try {
			if (!user) {
				console.log('user not logged in');
				return;
			}
			
			if (imageUpload == null) return;
			const imageRef = ref(storage, `productImages ${imageUpload.name + v4()}`);
			await uploadBytes(imageRef, imageUpload);
			const imageUrl = await getDownloadURL(imageRef);
			setImageUrls((prev) => [...prev, imageUrl])
			const productsRef = collection(db, 'products');
			await addDoc(productsRef, {
				name: data.name,
				description: data.description,
				productImages: [...imageUrls, imageUrl],
				price: data.price,
				username: user?.displayName,
				userId: user?.uid
			});
			navigate('/');
		} catch (error) {
			console.error(error);
		}
	};


	return (
		<div
			className="flex flex-col items-center text-2xl font-mono 
                    hover:scale-105 transition-transform delay-150 "
		>
			<form
				className="fixed p-10 m-10 rounded-xl 
                    bg-gradient-to-r from-indigo-500 to-gray-300"
				onSubmit={handleSubmit(onCreateProduct)}
			>
				<input
					className="p-2 m-2 rounded-xl text-black"
					type="text"
					placeholder="Name..."
					{...register('name')}
				/>
				<p style={{ color: 'red' }}> {errors.name?.message}</p>
				
				<input
					type="file"
					// name="productImages"
					{...register('productImages')}
					onChange={(event) => {
						if(event.target.files) setImageUpload(event.target.files[0]);
					}}
					/>

				<p style={{ color: 'red' }}> {errors.productImages?.message}</p>
				<textarea
					className="p-2 m-2 rounded-xl text-black custom-scrollbar"
					placeholder="Description..."
					{...register('description')}
				/>
				<p style={{ color: 'red' }}> {errors.description?.message}</p>
				<input	
					className="p-2 m-2 rounded-xl text-black"
					type="number"
					placeholder="Price..."
					{...register('price')}
				/>
				<p
					className="p-5"
					style={{ color: 'red' }}
				>
					{errors.price?.message}
				</p>
				<input
					className="submitForm cursor-pointer text-white p-2 rounded-xl 
                          border-4 hover:border-slate-400 duration-1000 shadow-2xl"
					type="submit"
					value="Add new product"
				/>
			</form>
		</div>
	);
};
