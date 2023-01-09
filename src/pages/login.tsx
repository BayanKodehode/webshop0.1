import { auth, provider } from "../config/firebase";
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {

    const result = await signInWithPopup(auth, provider);
    console.log(result);  // this have much to learn about later
    navigate("/");
  };

  return (
    <div>
      <p> Sign In With Google To Continue </p>
      <button onClick={signInWithGoogle} className="loginBtn"> Sign In With Google </button>
    </div>
  );
}; 