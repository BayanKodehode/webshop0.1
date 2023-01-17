import { Link } from "react-router-dom";
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { ShoppingCart } from "../components/ShoppingCart";

export const Navbar = () => {
  const [user] = useAuthState(auth); // can use it later to mack profile data

  const signUserOut = async () => {
    await signOut(auth);
  };
  return (
    <div
      className="m-5 h-20 text-white flex items-center 
                     font-display rounded-lg shadow-2xl"
    >
      <ShoppingCart />

      <div className="m-auto p-auto">
        <Link
          to="/"
          className="p-3 m-3 bg-gradient-to-r from-indigo-500 shadow-2xl
                              border-4 hover:border-slate-400 duration-1000
                              to-gray-300 rounded-lg"
        >
          Home
        </Link>
        {!user ? (
          <Link
            to="/login"
            className="p-3 m-3 bg-gradient-to-r from-indigo-500 shadow-2xl
          border-4 hover:border-slate-400 duration-1000                           
          to-gray-300 rounded-lg"
          >
            Login
          </Link>
        ) : (
          <Link
            to="/create"
            className="p-3 m-3 bg-gradient-to-r from-indigo-500 shadow-2xl
          border-4 hover:border-slate-400 duration-1000  
          to-gray-300 rounded-lg"
          >
            New Product
          </Link>
        )}
      </div>
      <div className="p-5 m-5 ">
        {user && (
          <div
            className="flex flex-col items-center justify-center shadow-2xl
                bg-gradient-to-r from-indigo-500 to-gray-300 rounded-2xl"
          >
           {user?.photoURL && <img src={user.photoURL} width="30" height="30" className=" rounded-full" />}

            <p className="p-3 bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg">
              {user?.displayName}
            </p>
            <button
              className="p-2 border-4 hover:border-slate-400 
                bg-gradient-to-r from-indigo-500 to-gray-300 rounded-lg duration-1000"
              onClick={signUserOut}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
