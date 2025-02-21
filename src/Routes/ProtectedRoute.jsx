/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { authContext } from "../ContextApi/AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../Pages/Loading/Loading";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(authContext);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading || isChecking) {
    return <Loading />;
  }

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
