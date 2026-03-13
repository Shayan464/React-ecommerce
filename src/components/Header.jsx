import React from 'react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { Link } from 'react-router-dom';

function Header() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full h-[80px] overflow-hidden z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Center Content */}
      <div className=" relative z-10 flex box-border flex-col items-center justify-center h-full text-center">
        <div
          className="
          px-6 rounded-2xl
          bg-white/30
         backdrop-blur-md
         border border-white/40
         shadow-lg"
        >
          <h1 className="text-cyan-900 font-bold sm:text-4xl">
            E-commerce Platform
          </h1>

          {user && (
            <h3
              className="
               mt-2 text-xl font-semibold
               bg-gradient-to-r from-black via-red-600 via-red-500 via-blue-500 to-purple-600
               bg-clip-text text-transparent"
            >
              Welcome {user?.Name.FirstName}
            </h3>
          )}
        </div>
      </div>

      {/* Logout Button */}
      {user && (
        <button
          onClick={logout}
          className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-lg transition"
        >
          Logout
        </button>
      )}

      {/* Cart Icon */}
      {user && (
        <Link
          to="/cart"
          className="absolute top-4 right-28 z-10 bg-white p-2 rounded-full shadow-lg"
        >
          <img
            src="https://cdn-icons-png.freepik.com/512/7835/7835563.png"
            className="h-6 w-6"
            alt="cart"
          />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      )}
    </header>
  );
}

export default Header;
