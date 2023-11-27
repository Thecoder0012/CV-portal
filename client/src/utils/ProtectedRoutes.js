import { Outlet, Navigate } from "react-router-dom";
import { API_URL } from "../config/apiUrl.js";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(undefined);
  const WITH_CREDENTIALS = { withCredentials: true };

  useEffect(() => {
    const userState = async () => {
      try {
        const response = await axios.get(
          API_URL + "/auth-login",
          WITH_CREDENTIALS
        );
        setAuth(response.data.auth);
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    userState();
  }, []);

  if (auth === undefined) {
    return null; 
  }
  return auth ? <Outlet /> : <Navigate to="/login" />;
};
