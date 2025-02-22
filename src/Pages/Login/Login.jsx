import { FcGoogle } from "react-icons/fc";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase/Firebase.config";
import bgImage from "../../assets/task.jpg";
import Aos from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const { setLoading, setUser, theme } = useContext(authContext);
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/");
        toast.success("Login Successfully", {
          theme: theme === "light" ? "light" : "dark",
          className:
            "text-center flex items-center justify-center flex-wrap flex-row",
        });
        setUser(result.user);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Something went wrong", {
          theme: theme === "light" ? "light" : "dark",
          className:
            "text-center flex items-center justify-center flex-wrap flex-row",
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    Aos.init({
      duration: 1500,
      delay: 300,
      once: true,
    });
  }, []);

  return (
    <div
      style={{ backgroundImage: `url(${bgImage})` }}
      className="h-screen w-screen flex justify-center items-center bg-cover bg-center px-6 relative"
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

      <div
        data-aos="zoom-in"
        className="relative z-10 w-full max-w-md p-8 flex flex-col justify-center items-center rounded-xl space-y-6 bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-xl"
      >
        <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-black tracking-wide">
          Sign in with Google
        </h2>
        <p className="text-sm lg:text-base text-center text-black">
          Secure and fast sign-in for easy access to your account.
        </p>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center gap-3 px-4 py-2 text-black rounded-lg border  shadow-lg font-semibold text-sm cursor-pointer transition-all duration-300 hover:shadow-xl hover:rounded-4xl"
        >
          <FcGoogle className="text-2xl" />
          Google
        </button>
      </div>
    </div>
  );
};

export default Login;
