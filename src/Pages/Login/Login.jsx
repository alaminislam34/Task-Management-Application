import { FcGoogle } from "react-icons/fc";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../Firebase/Firebase.config";
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
        toast.success("Login Successfully");
        setUser(result.user);
        setLoading(false);
      })
      .catch((e) => {
        toast.error("Something went wrong");
        console.log(e);
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
    <div className={`h-screen flex justify-center items-center mx-4`}>
      <div
        className={`max-w-md mx-auto h-[50vh] p-4 md:p-6 lg:p-8 shadow-xl flex flex-col justify-center  rounded-lg space-y-4 ${
          theme === "light" ? "bg-blue-200" : "bg-blue-950/40"
        }`}
      >
        <h2
          data-aos="fade-up"
          data-aos-delay="100"
          data-aos-anchor-placement="top-center"
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-center"
        >
          Sign in with google
        </h2>
        <p
          data-aos="fade-up"
          data-aos-delay="200"
          data-aos-anchor-placement="top-center"
          className="text-xs lg:text-base text-center text-gray-500"
        >
          Secure and fast sign-in for easy access to your account.
        </p>
        <div
          data-aos="fade-up"
          data-aos-delay="400"
          data-aos-anchor-placement="top-bottom"
          className="flex items-center justify-center"
        >
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center gap-2 justify-center p-3 hover:-translate-y-1 duration-300 hover:scale-105 rounded-full border cursor-pointer"
          >
            <FcGoogle className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
