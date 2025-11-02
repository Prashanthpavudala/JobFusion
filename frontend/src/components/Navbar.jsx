import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("navbar user", currentUser);
    });

    return () => unsubscribe();
  }, [auth]);


  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate('/auth');
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-blue-900 shadow-md text-white px-6 py-4 flex justify-between items-center">
      <div className="text-2xl font-bold">JobFusion</div>
      <div className="space-x-6 text-lg flex items-center">
        <Link to="/" className="hover:text-blue-300 transition">Home</Link>
        <Link to="/about" className="hover:text-blue-300 transition">About</Link>
        {user ? (
          <>
            {/* <span className="text-gray-300">({user.email})</span> */}
            <button 
              onClick={handleLogout} 
              // className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded transition"
              className="hover:text-blue-300 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="hover:text-blue-300 transition">Login / Signup</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;