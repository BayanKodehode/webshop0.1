import React from "react";
import { collection, query, where, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { IProduct } from "./Products";

export function ShoppingCart() {
  const [user] = useAuthState(auth);
  const [showCartItems, setShowCartItems] = React.useState(false);
  const [cart, setCart] = React.useState<IProduct[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    const cartRef = collection(db, "cart");
    const productsRef = collection(db, "products");
    Promise.all([getDocs(query(cartRef, where("userId", "==", user?.uid))),getDocs(query(productsRef))])
      .then(([querySnapshot, productSnapshot]) => {
        const cart: IProduct[] = [];
        querySnapshot.forEach((doc) => {
            const product = productSnapshot.docs.find(d => d.id === doc.data().productId);
            if(product){
                cart.push({
                  id: doc.id,
                  name: product.data().name,
                  productImages: product.data().productImages,
                  price: product.data().price,
                  username: "",
                  description: "",
                });
            }
        });
        setCart(cart as IProduct[]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);


  const toggleCartItems = () => {
    setShowCartItems(!showCartItems);
  };

  React.useEffect(() => {
    const handleClick = (event: any) => {
      if (!event.target.closest(".shopping-cart-dropdown")) {
        setShowCartItems(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-5 m-5 text-gray-800 shopping-cart-dropdown">
      <button
        className="p-2 text-4xl border-4 rounded-full bg-gradient-to-r from-indigo-300 to-gray-300
                hover:border-slate-400 duration-1000 shadow-2xl"
        onClick={toggleCartItems}
      >
        <div>&#128722;</div>
      </button>
      <div
        className={`fixed top-40 right-80 w-7/12 max-h-96 overflow-y-auto rounded-xl
                    hover:scale-105 transition-all duration-1000 
                    bg-slate-200 py-2 ${
                      showCartItems ? "block " : "hidden "
                    } custom-scrollbar shadow-2xl`}
      >
        {cart.map((p) => (
          <div
            key={p.id}
            className="p-2 "
          >
            <p className="text-lg text-center">Name: {p.name}</p>
            
            {p.productImages.map((imgURL, index) => (
                <img key={index} src={imgURL} alt={p.name}/>
            ))}

            <p className="text-xl text-center ">Price: {p.price}</p>
            <div className="flex items-center justify-self-center">
              <button className="px-3 mx-1 text-lg rounded-xl bg-green-400 ">Buy</button>
              <button
                className="px-3 mx-1 text-lg border border-collapse 
                                border-black rounded-full "
              >
                +
              </button>
              <button
                className="px-3 mx-1 text-lg border border-collapse 
                                border-black rounded-full "
              >
                -
              </button>
              <button className="px-3 ml-20 text-lg rounded-xl bg-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
