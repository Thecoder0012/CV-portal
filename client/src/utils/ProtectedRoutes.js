import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../config/apiUrl.js";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  let url = window.location.pathname;

  const WITH_CREDENTIALS = { withCredentials: true };

  useEffect(() => {
    const userState = async () => {
      try {
        const response = await axios.get(
          API_URL + "/auth-login",
          WITH_CREDENTIALS
        );
        setAuth(response.data.auth);

        if (response.data.auth) {
          const profile = await axios.get(
            API_URL + "/profile",
            WITH_CREDENTIALS
          );
          if (response.data.auth && !profile.data.length > 0) {
            navigate("/cv");
          } else {
            if (url === "/cv") {
              navigate("/main");
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth status or profile:", error);
      }
    };

    userState();
  }, []);

  if (auth === undefined || loading) {
    return null;
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

/*

import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { API_URL } from "../config/apiUrl.js";
import axios from "axios";
import { useEffect, useState } from "react";

export const ProtectedRoutes = () => {
  const [auth, setAuth] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState([]); // Updated to an array
  const [redirected, setRedirected] = useState(false); // New state

  const navigate = useNavigate();

  const WITH_CREDENTIALS = { withCredentials: true };
  let url = window.location.pathname;

  useEffect(() => {
    const userState = async () => {
      try {
        const response = await axios.get(
          API_URL + "/auth-login",
          WITH_CREDENTIALS
        );
        setAuth(response.data.auth);

        if (response.data.auth) {
          const profile = await axios.get(
            API_URL + "/profile",
            WITH_CREDENTIALS
          );

          setHasProfile(profile.data[0]);

          if (response.data.auth && !redirected) {
            if (!profile.data.length) {
              navigate("/cv");
              setRedirected(true);
            } else {
              if (url === "/cv") {
                navigate("/main");
              }
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error checking auth status or profile:", error);
      }
    };

    userState();
  }, [navigate, redirected, hasProfile]);

  if (auth === undefined || loading) {
    return null;
  }

  if (!auth) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};



*/
