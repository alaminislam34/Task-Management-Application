import { useContext, useEffect, useRef, useState } from "react";
import { CiDark, CiLight, CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../ContextApi/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase/Firebase.config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../Loading/Loading";
import logo from "../../assets/TMA.png";

const Navbar = () => {
  const { loading } = useContext(authContext);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const showRef = useRef();
  const logout = () => {
    signOut(auth);
    navigate("/login");
    toast.info("Logout Successfully");
    if (loading) {
      return <Loading />;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showRef.current && !showRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, setShow]);

  const { theme, handleTheme, user } = useContext(authContext);
  return (
    <div className="h-[72px]">
      <div
        className={`fixed z-50 top-0 left-0 right-0 w-full shadow-sm ${
          theme === "light" ? "bg-blue-50 text-gray-500" : "bg-[#1C2948]"
        }`}
      >
        <nav className="flex justify-between items-center max-w-6xl mx-auto py-3 px-4 lg:px-6">
          <div>
            <img src={logo} alt="logo" className="w-12 h-12 cursor-pointer" />
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                onClick={handleTheme}
                className="p-2 rounded-full hover:bg-base-300 cursor-pointer"
              >
                {theme === "dark" ? (
                  <CiLight className="text-2xl" />
                ) : (
                  <CiDark className="text-2xl" />
                )}
              </button>
              {user && (
                <div className="flex items-center gap-2 relative" ref={showRef}>
                  <img
                    src={user?.photoURL}
                    onClick={() => setShow(!show)}
                    alt="user"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full cursor-pointer"
                  />

                  <div
                    className={`absolute duration-500 ${
                      show
                        ? "top-16 opacity-100"
                        : "top-20 opacity-0 pointer-events-none"
                    } right-0 w-52 px-4 py-6 text-left space-y-2 rounded-xl shadow-xl ${
                      theme === "light" ? "bg-blue-50" : "bg-[#1C2948]"
                    }`}
                  >
                    <p>{user?.displayName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <button
                      onClick={logout}
                      className={`flex items-center gap-2 py-2 px-2 w-full ${
                        theme === "light" ? "bg-red-200" : "bg-red-900"
                      } rounded-lg cursor-pointer font-medium`}
                    >
                      <CiLogout className="text-lg" /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
