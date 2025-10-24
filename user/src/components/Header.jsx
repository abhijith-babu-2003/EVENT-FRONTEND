import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logoutUser, fetchUserProfile } from '../redux/slices/userSlice';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  // Profile now navigates to a dedicated page
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <header className="bg-black shadow-md">
      <nav className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            className="text-2xl font-extrabold text-fuchsia-500 hover:text-violet-500"
            onClick={() => navigate('/')}
          >
            Venuo
          </button>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <a href="/" className="hover:text-violet-500 text-fuchsia-500 font-bold transition">HOME</a>
            </li>
            <li>
              <a href="/events" className="hover:text-violet-500 text-fuchsia-500 font-bold transition">EVENTS</a>
            </li>
            <li>
              <a href="/about" className="hover:text-violet-500 text-fuchsia-500 font-bold transition">ABOUT</a>
            </li>
            <li>
              <a href="/contact" className="hover:text-violet-500 text-fuchsia-500 font-bold transition">CONTACT</a>
            </li>
          </ul>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user && (
                  <button
                    onClick={() => navigate('/profile')}
                    className="font-bold text-fuchsia-500 hover:text-violet-500 transition"
                  >
                    {user.name || user.username}
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="border border-white/40 text-white px-4 py-2 rounded-lg font-bold hover:border-white"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-violet-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-violet-700"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-violet-500"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
          >
            <svg className={`h-6 w-6 ${mobileOpen ? 'hidden' : 'block'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`h-6 w-6 ${mobileOpen ? 'block' : 'hidden'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden mt-3 border-t border-white/10 pt-3">
            <ul className="flex flex-col gap-2">
              <li>
                <a onClick={() => setMobileOpen(false)} href="/" className="block px-2 py-2 rounded text-white hover:bg-white/10 font-semibold">HOME</a>
              </li>
              <li>
                <a onClick={() => setMobileOpen(false)} href="/events" className="block px-2 py-2 rounded text-white hover:bg-white/10 font-semibold">EVENTS</a>
              </li>
              <li>
                <a onClick={() => setMobileOpen(false)} href="/about" className="block px-2 py-2 rounded text-white hover:bg-white/10 font-semibold">ABOUT</a>
              </li>
              <li>
                <a onClick={() => setMobileOpen(false)} href="/contact" className="block px-2 py-2 rounded text-white hover:bg-white/10 font-semibold">CONTACT</a>
              </li>
            </ul>

            <div className="mt-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {user && (
                    <button
                      onClick={() => { navigate('/profile'); setMobileOpen(false); }}
                      className="w-full border border-white/20 px-3 py-2 rounded text-white font-semibold hover:border-white/40"
                    >
                      {user.name || user.username}
                    </button>
                  )}
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="w-full bg-red-600 text-white px-3 py-2 rounded font-bold hover:bg-red-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMobileOpen(false); }}
                    className="w-full border border-white/20 text-white px-3 py-2 rounded font-bold hover:border-white/40"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setMobileOpen(false); }}
                    className="w-full bg-violet-600 text-white px-3 py-2 rounded font-bold hover:bg-violet-700"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Profile modal removed; now a dedicated /profile page */}
    </header>
  );
};

export default Header;
