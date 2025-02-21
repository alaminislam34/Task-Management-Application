import { Outlet } from "react-router-dom";
import Navbar from "../../Pages/Header/Navbar";
import Footer from "../../Pages/Shared/Footer/Footer";
import { ToastContainer } from "react-toastify";

const Main = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="min-h-[60vh] lg:min-h-[70vh] w-11/12 p-4 lg:p-6 max-w-6xl mx-auto">
        <Outlet />
      </section>
      <Footer />
      <ToastContainer
        autoClose={2500}
        hideProgressBar={true}
        position="top-center"
      />
    </div>
  );
};

export default Main;
