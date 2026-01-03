import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const navigate = useNavigate();

  const {
    setShowSearch,
    getCartCount,
    getWishlistCount,
    token,
    logout,
  } = useContext(ShopContext);

  const doLogout = () => {
    logout(); // centralized safe-logout (replaces history and clears state)
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
      <Link to='/'><img src={assets.logo} className='w-36' alt="logo" /></Link>

      <ul className='hidden sm:flex gap-5 text-sm text-gray-700'>
        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>HOME</p>
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>COLLECTION</p>
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>ABOUT</p>
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>CONTACT</p>
        </NavLink>
      </ul>

      <div className='flex items-center gap-6'>
        <img
          onClick={() => { setShowSearch(true); navigate('/collection') }}
          src={assets.search_icon}
          className='w-5 cursor-pointer'
          alt="search"
        />

        <div className='group relative'>
          <img
            onClick={() => {
      if (!token) {
        navigate("/login");
      } else {
        setShowAccountMenu((prev) => !prev);
      }
    }}
            className='w-5 cursor-pointer'
            src={assets.profile_icon}
            alt="profile"
          />

          {/* Dropdown Menu */}
            {token && showAccountMenu && (
    <>
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={() => setShowAccountMenu(false)}
      />

      <div className="absolute right-0 mt-3 z-50 w-48 bg-white border rounded-xl shadow-lg overflow-hidden">
        <button
          onClick={() => {
            setShowAccountMenu(false);
            navigate("/profile");
          }}
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
        >
          My Profile
        </button>

        <button
          onClick={() => {
            setShowAccountMenu(false);
            navigate("/orders");
          }}
          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
        >
          Orders
        </button>

        <div className="border-t" />

        <button
          onClick={() => {
            setShowAccountMenu(false);
            setShowLogoutModal(true);
          }}
          className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </>
  )}
        </div>

        {/* Wishlist */}
        <Link to='/wishlist' className='relative'>
          <img src={assets.wishlist} className='w-5 min-w-5' alt="wishlist" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getWishlistCount()}
          </p>
        </Link>

        <Link to='/cart' className='relative'>
          <img src={assets.cart_icon} className='w-5 min-w-5' alt="cart" />
          <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>
            {getCartCount()}
          </p>
        </Link>

        <img onClick={() => setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="menu" />
      </div>

      {/* Sidebar menu for small screens */}
      <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
        <div className='flex flex-col text-gray-600'>
          <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
            <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="back" />
            <p>Back</p>
          </div>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/'>HOME</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/collection'>COLLECTION</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/about'>ABOUT</NavLink>
          <NavLink onClick={() => setVisible(false)} className='py-2 pl-6 border' to='/contact'>CONTACT</NavLink>
        </div>
      </div>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            doLogout();
          }}
        />
      )}
    </div>
  )
}

/* ------------------ Local Logout Modal ------------------ */
function LogoutModal({ onCancel, onConfirm }) {
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel}></div>

      <div className="relative z-10 w-full max-w-md bg-white text-black rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Log out?</h3>
          <p className="text-sm text-gray-700 mb-4">You will be logged out and require your credentials to sign in again.</p>

          <div className="flex justify-end gap-3">
            <button onClick={onCancel} className="px-4 py-2 border rounded">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-[#FF8A8A] text-white rounded hover:bg-red-600">Log out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar
