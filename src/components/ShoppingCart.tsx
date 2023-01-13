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
      className="fixed top-20 left-0 text-gray-800 p-2 m-2
                    shopping-cart-dropdown"
    >
      <button
        onClick={toggleCartItems}
        className="bg-gray-300 text-gray-800 p-2"
      >
        <>&#128722;</>
      </button>
      <div
        className={`absolute top-40 rounded-lg w-64 h-64 overflow-y-auto 
                bg-white py-2 custom-scrollbar ${
                  showCartItems
                    ? "opacity-100 transform-translate-x-0 transition ease-out duration-1000"
                    : "hidden opacity-0 transform-translate-x-full"
                }`}
      >
        {cart.map((p) => (
          <div key={p.id} className="p-2">
            <p className="text-lg text-center">Name: {p.product.name}</p>
            <p className="text-sm text-center">
              Description: {p.product.description}
            </p>
            <p className="text-xl text-center ">Price: {p.product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
