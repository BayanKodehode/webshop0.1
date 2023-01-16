import React from 'react';
import {
	addDoc,
	getDocs,
	updateDoc,
	collection,
	query,
	where,
	deleteDoc,
	doc
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { IProduct } from '../components/Products';
import { useAuthState } from 'react-firebase-hooks/auth';

interface CommentProps {
	product: IProduct;
}

interface Comment {
	commentId: string;
	userId: string;
	comment: string;
}

const CommentSection = (props: CommentProps) => {
	const { product } = props;
	const [comments, setComments] = React.useState<Comment[] | null>(null);
	const [newComment, setNewComment] = React.useState<string>('');
	const [hasCommented, setHasCommented] = React.useState<boolean>(false);
	const [user] = useAuthState(auth);
	const commentsRef = collection(db, 'comments');
	const commentsDoc = query(commentsRef, where('productId', '==', product?.id));

	const getComments = async () => {
		try {
			if (!user) return;
			const data = await getDocs(commentsDoc);
			setComments(
				data.docs.map((doc) => ({
					userId: doc.data().userId,
					commentId: doc.id,
					comment: doc.data().comment
				}))
			);
		} catch (err) {
			console.log(err);
		}
	};

	const removeComment = async (commentId: string) => {
		try {
			if (!user || !comments) return;
			if (comments.find((comment) => comment.commentId === commentId)?.userId === user.uid) {
				const commentToDelete = doc(db, 'comments', commentId);
				await deleteDoc(commentToDelete);
				setComments((prev) => prev && prev.filter((comment) => comment.commentId !== commentId));
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleCommentSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			if (!user) return;
			const commentId = comments?.find((comment) => comment.userId === user?.uid)?.commentId;
			if (commentId) {
				// Update existing comment

				// await deleteDoc(doc(db, 'comments', commentId));
				// setComments((prev) => prev && prev.filter((comment) => comment.commentId !== commentId));
				await updateDoc(doc(db, 'comments', commentId), { comment: newComment });
				setComments((prev) =>
					prev
						? prev.map((comment) =>
								comment.commentId === commentId ? { ...comment, comment: newComment } : comment
						  )
						: []
				);
			} else {
				// Add new comment
				const newDoc = await addDoc(commentsRef, {
					userId: user.uid,
					productId: product?.id,
					comment: newComment
				});
				setComments((prev) => [
					...prev!,
					{
						userId: user.uid,
						commentId: newDoc.id,
						comment: newComment
					}
				]);
			}
			const hasUserCommented = comments?.find((comment) => comment.userId === user?.uid);
			setHasCommented(true);
			setNewComment('');
		} catch (err) {
			console.log(err);
		}
	};

	React.useEffect(() => {
		getComments();
	}, []);

	return (
		<div>
			<form onSubmit={(e) => handleCommentSubmit(e)}>
				<input
					className="rounded-xl"
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
				/>
				<button type="submit">{hasCommented ? <>&#10008;</> : <>&#9997;</>}</button>
			</form>
			<div>
				{comments && comments?.map((comment, index) => <p key={index}>{comment.comment}</p>)}
			</div>
		</div>
	);
};

export default CommentSection;
