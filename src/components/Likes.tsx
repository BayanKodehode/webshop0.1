import React from 'react';
import { addDoc, getDocs, collection, query, where, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { IProduct } from './Products';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Like {
	likeId: string;
	userId: string;
}

interface ProductProps {
	product: IProduct | null;
}

const Likes = ({ product }: ProductProps) => {
	const [likes, setLikes] = React.useState<Like[] | null>(null);
	const [user] = useAuthState(auth);
	const likesRef = collection(db, 'likes');
	const likesDoc = query(likesRef, where('productId', '==', product?.id));

	const getLikes = async () => {
		const data = await getDocs(likesDoc);
		setLikes(data.docs.map((doc) => ({ userId: doc.data().userId, likeId: doc.id })));
	};
	const addLike = async () => {
		try {
			if (!user) return;
			const newDoc = await addDoc(likesRef, {
				userId: user.uid,
				productId: product?.id
			});
			setLikes((prev) =>
				prev
					? [...prev, { userId: user.uid, likeId: newDoc.id }]
					: [{ userId: user.uid, likeId: newDoc.id }]
			);
		} catch (err) {
			console.log(err);
		}
	};

	const removeLike = async () => {
		try {
			if (!user) return;
			const likeToDeleteQuery = query(
				likesRef,
				where('productId', '==', product?.id),
				where('userId', '==', user.uid)
			);

			const likeToDeleteData = await getDocs(likeToDeleteQuery);
			const likeId = likeToDeleteData.docs[0].id;
			const likeToDelete = doc(db, 'likes', likeId);
			await deleteDoc(likeToDelete);
			setLikes((prev) => prev && prev.filter((like) => like.likeId !== likeId));
		} catch (err) {
			console.log(err);
		}
	};
	const hasUserLiked = likes?.find((like) => like.userId === user?.uid);

	React.useEffect(() => {
		getLikes();
	}, []);

	return (
		<div className="">
			<p> @{product?.username} </p>
			<button onClick={hasUserLiked ? removeLike : addLike}>
				{hasUserLiked ? <>&#128078;</> : <>&#128077;</>}
			</button>
			{likes && <p> Likes: {likes?.length} </p>}
		</div>
	);
};

export default Likes;
