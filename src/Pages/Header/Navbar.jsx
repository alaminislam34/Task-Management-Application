import { useContext } from "react";
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
  const navigate = useNavigate();
  const logout = () => {
    signOut(auth);
    navigate("/login");
    toast.info("Logout Successfully");
    if (loading) {
      return <Loading />;
    }
  };

  const { theme, handleTheme, user } = useContext(authContext);
  return (
    <div className="h-[72px]">
      <div
        className={`fixed z-50 top-0 left-0 right-0 w-full shadow-sm ${
          theme === "light" ? "bg-blue-50 text-gray-500" : "bg-blue-900/30"
        }`}
      >
        <nav className="flex justify-between items-center max-w-6xl mx-auto py-3 px-4">
          <div>
            <img
              onClick={() => {
                if (user) {
                  navigate("/");
                }
              }}
              src={logo}
              alt="logo"
              className="w-12 h-12 cursor-pointer"
            />
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
                <div className="flex items-center gap-2">
                  <img
                    src={user?.photoURL}
                    alt="user"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full cursor-pointer"
                  />
                  <button
                    onClick={logout}
                    className={`flex items-center gap-2 py-2 px-2 ${
                      theme === "light" ? "bg-red-200" : "bg-red-900"
                    } rounded-lg cursor-pointer font-medium`}
                  >
                    <CiLogout className="text-lg" />
                  </button>
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
