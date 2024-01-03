import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import { NavigationBar } from "./components/main/NavigationBar";
import App from "./App";

const AppWithNavbar = () => {
  const [showNavigationBar, setShowNavigationBar] = useState();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/cvProfile" || location.pathname === "/cv" ) {
      setShowNavigationBar(false);
    } else {
      setShowNavigationBar(true);
    }
  }, [location.pathname]);

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <App />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AppWithNavbar />
  </BrowserRouter>
);