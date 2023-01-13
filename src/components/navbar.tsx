import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
export const Navbar = () => {
  const [user] = useAuthState(auth);  // can use it later to mack profile data

  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="m-5 h-20 text-white flex items-center bg-slate-200 rounded-lg">
      <div className="m-auto p-auto">
        <Link to="/" className="p-3 m-3 bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg"> Home </Link>
        {!user ? (
          <Link to="/login" className="p-3 m-3 bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg"> Login </Link>
        ) : (
          <Link to="/create" className="p-3 m-3 bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg"> New Product </Link>
        )}
      </div>
      <div className="p-5 m-5 bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg">
        {user && (
          <>
            <img src={user?.photoURL || ""} width="30" height="30" className="rounded-xl" />
            <p className="p-3"> {user?.displayName} </p>
            <button className="p-3" onClick={signUserOut}> Log Out</button>
          </>
        )}
      </div>
    </div>
  );
};