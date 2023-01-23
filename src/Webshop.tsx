import * as React from "react";
import { Bot } from "./components/chat-bot/bot";
import { DataProvider } from "./context/DataProvider";
import { MainPage } from "./pages/mainPage";
import { CreateProduct } from "./pages/createProduct";
import { Login } from "./pages/login";
import { Navbar } from "./components/navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function Webshop() {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="h-full p-8 text-slate-800 overflow-y-auto 
                  custom-scrollbar bg-gradient-to-r from-gray-300 to-indigo-500 ">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateProduct />} />
        </Routes>
      </Router>
      <div className="z-0 fixed right-1 bottom-0 text-xl px-0 rounded-t-3xl text-white bg-gradient-to-r from-indigo-600 to-gray-500">
        {!isOpen && (
          <button
            className=" p-3 px-2 m-5 rounded-l-3xl fixed right-0 bottom-0 bg-gradient-to-r from-indigo-500 to-gray-400"
            onClick={handleOpen}
          >
            Chat with me ?
          </button>
        )}
        {isOpen && (
          <div className="max-w-4xl font-chatFont  z-50 rounded-t-3xl bg-gradient-to-r from-indigo-600 to-slate-400">
            <button
              className=" bg-red-700 p-2 m-4 rounded-t-2xl "
              onClick={handleClose}
            >
              x
            </button>
            <DataProvider>
              <Bot />
            </DataProvider>
          </div>
        )}
      </div>
    </div>
  );
}

export default Webshop;
