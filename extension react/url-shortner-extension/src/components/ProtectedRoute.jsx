import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ Component }) => {
  const [showProtectedRoute, setShowProtectedRoute] = useState(false);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // const checkLoggedIn = () => {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       resolve(true);
  //     }, 1000);
  //   });
  // };

  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     const isLoggedIn = await checkLoggedIn();
  //     if (!isLoggedIn) {
  //       navigate("/login");
  //     } else {
  //       setLoggedIn(true);
  //       setShowProtectedRoute(true);
  //     }
  //   };
  //   checkAuthStatus();
  // }, [loggedIn]);

  // return <>{showProtectedRoute && <Component />}</>;
  return <>{<Component />}</>;
};

export default ProtectedRoute;
