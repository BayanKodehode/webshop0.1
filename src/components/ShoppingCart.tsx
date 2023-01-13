import React from "react";
import { collection, query, where, doc, getDocs } from "firebase/firestore";
import { db, auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function ShoppingCart() {
  const [user] = useAuthState(auth);
  const [showCartItems, setShowCartItems] = React.useState(false);
  const [cart, setCart] = React.useState<[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    const cartRef = collection(db, "cart");

    getDocs(cartRef)
      .then(async (querySnapshot) => {
        const cart: any[] = [];
        querySnapshot.forEach(async (doc) => {
          const productsRef = collection(db, "products");

          getDocs(productsRef).then((productSnapshot) => {
            const data = doc.data();
            productSnapshot.docs.forEach((productDoc) => {
              if (productDoc.id === data.productId) {
                cart.push({ id: doc.id, ...data, product: productDoc.data() });
              }
            });
          });
        });
        setCart(cart);
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
    <div
      className="fixed top-36 left-20 p-5 flex-shrink text-gray-800 
                    shopping-cart-dropdown"
    >
      <button className="text-4xl" onClick={toggleCartItems}>
        <div>&#128722;</div>
      </button>
      <div
        className={`absolute top-40 left-3/4 w-96 h-64 overflow-y-auto rounded-lg
                    hover:scale-150 transition-all duration-1000 
                    bg-slate-200 py-2 custom-scrollbar ${
                      showCartItems ? "block " : "hidden "
                    }`}
      >
        {cart.map((p) => (
          <div key={p.id} className="p-2 ">
            <p className="text-lg text-center">Name: {p.product.name}</p>
            <img src={p.product.image} alt="product image" />
            <p className="text-2xl text-center ">Price: {p.product.price}</p>
            <button className="px-3 text-lg rounded-xl bg-green-400 ">
              Buy
            </button>
            <button className="px-3 text-lg rounded-xl bg-red-600">
              Delete
            </button>
            <button className="px-1 text-lg ">+</button>
            <button className="px-1 text-lg ">-</button>
          </div>
        ))}
      </div>
    </div>
  );
}
