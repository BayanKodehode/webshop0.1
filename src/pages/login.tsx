import { auth, provider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    navigate("/");
  };

  return (
    <div className="flex h-4/6 w-full items-center justify-center">
      <div
        className="w-5/12 bg-slate-200 rounded-lg shadow-2xl font-serif p-5 text-2xl 
                    hover:scale-105 transition-transform delay-150 
                    flex flex-col items-center justify-center"
      >
        <p> Sign In With Google To Continue </p>
        <button onClick={signInWithGoogle} 
                className="loginBtn rounded-full p-5 m-5 hover:bg-slate-300">
          Sign In With Google
        </button>
      </div>
    </div>
  );
};
