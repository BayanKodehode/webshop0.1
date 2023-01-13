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
  // image: string[];
  price: number;
}

export const CreateProduct = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const schema = yup.object().shape({
    name: yup.string().required("You must add a name to the new product."),
    // image: yup.string().required("You must add image to the new product."),
    description: yup.string().required("You must add a description."),
    price: yup.number().required("What is the price of the new product?"),
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
    <div className="flex flex-col items-center text-2xl text-white font-mono
                    hover:scale-150 transition-transform delay-150 ">
      <form className="fixed p-10  rounded-xl bg-gradient-to-r from-indigo-500 to-gray-300" 
            onSubmit={handleSubmit(onCreateProduct)} >
        <input placeholder="Name..." {...register("name")} />
        <p style={{ color: "red" }}> {errors.name?.message}</p>
        {/* <input placeholder="Image..." type="file" ref={register} name="image" />
        <p style={{ color: "red" }}> {errors.image?.message}</p> */}
        <textarea placeholder="Description..." {...register("description")} />
        <p style={{ color: "red" }}> {errors.description?.message}</p>
        <input type="number" placeholder="Price..." {...register("price")} />
        <p className="p-5" style={{ color: "red" }}> {errors.price?.message}</p>
        <input type="submit" className="submitForm" />
      </form> 
    </div>
  );
};
