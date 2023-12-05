import { Outlet, Navigate } from "react-router-dom";
import { API_URL } from "../config/apiUrl.js";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(undefined);
  const [hasProfile, setHasProfile] = useState(null);

  const WITH_CREDENTIALS = { withCredentials: true };

  useEffect(() => {
    const userState = async () => {
      try {
        const auth = await axios.get(API_URL + "/auth-login", WITH_CREDENTIALS);
        setAuth(auth.data.auth);

        if (auth.data.auth) {
          const profile = await axios.get(
            API_URL + "/profile",
            WITH_CREDENTIALS
          );
          setHasProfile(profile.data[0]);
          console.log(hasProfile);
        }
      } catch (error) {
        console.error("Error checking auth status or profile:", error);
      }
    };

    userState();
  }, []);

  if (auth === undefined) {
    return null; 
  }
  

  if (!auth) {
    return <Navigate to="/login" />;
  }

  if (auth && hasProfile === null) {
    return <Navigate to="/cv" />;
  }



  return <Outlet />;
};
