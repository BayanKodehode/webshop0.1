import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
  name: string;
  description: string;
}

export const CreateProduct = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required("You must add a name to the new product."),
    description: yup.string().required("You must add a description."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const productsRef = collection(db, "products");

  const onCreateProduct = async (data: CreateFormData) => {
    await addDoc(productsRef, {
      ...data,           
      username: user?.displayName,
      userId: user?.uid,
    });

    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit(onCreateProduct)}>
      <input placeholder="Name..." {...register("name")} />
      <p style={{ color: "red" }}> {errors.name?.message}</p>
      <textarea placeholder="Description..." {...register("description")} />
      <p style={{ color: "red" }}> {errors.description?.message}</p>
      <input type="submit" className="submitForm" />
    </form>
  );
};
