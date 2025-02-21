import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../../../Task/src/Firebase/Firebase.config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authContext } from "../../ContextApi/AuthContext";

const Login = () => {
  const { setLoading, setUser } = useContext(authContext);
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

  const login = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        navigate("/");
        setUser(res.user);
        toast.success("Login Successfully");
      })
      .catch(() => {
        toast.error("Invalid email or password");
      });
    console.log(email, password);
  };

  return (
    <div className="max-w-sm mx-auto p-2 lg:p-4 shadow-xl">
      <form onSubmit={login} className="">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center py-4">
          Login Now
        </h2>
        <label htmlFor="email" className="flex flex-col justify-start gap-2">
          Your email*
          <input className="py-2 px-4 rounded-md" type="email" name="email" />
        </label>
        <label htmlFor="password" className="flex flex-col justify-start gap-2">
          Your password*
          <input
            className="py-2 px-4 rounded-md"
            type="password"
            name="password"
          />
        </label>
        <br />
        <input
          type="submit"
          name="Login"
          className="py-2 w-full border cursor-pointer rounded-md"
        />
      </form>
      <div className="divider">or</div>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex items-center gap-2 justify-center py-2 rounded-md w-full border cursor-pointer"
        >
          <FcGoogle /> Continue with google
        </button>
      </div>
    </div>
  );
};

export default Login;
