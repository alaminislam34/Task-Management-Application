import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../../../Task/src/Firebase/Firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";

const Login = () => {
  const { setLoading, setUser, theme } = useContext(authContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/");
        toast.success("Login Successfully");
        setUser(result.user);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Something went wrong");
        setLoading(false);
      });
  };

  return (
    <div
      className={`min-h-[60vh] lg:min-h-[70vh] flex justify-center items-center `}
    >
      <div
        className={`max-w-sm mx-auto p-4 md:p-6 lg:p-8 shadow-xl rounded-lg space-y-4 ${
          theme === "light" ? "bg-blue-200" : "bg-blue-950/40"
        }`}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Sign in with google
        </h2>
        <p className="text-xs lg:text-base text-center text-gray-500">
          Secure and fast sign-in for easy access to your account.
        </p>
        <div className="flex items-center justify-center">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center gap-2 justify-center py-2 rounded-md px-4 border cursor-pointer"
          >
            <FcGoogle /> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
