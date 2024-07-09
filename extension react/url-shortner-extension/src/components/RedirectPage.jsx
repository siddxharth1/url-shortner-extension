import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { backendURL } from "../constants";

const RedirectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  console.log(id);

  const locaton = useLocation();
  console.log("url " + locaton);

  useEffect(() => {
    const fetchURL = async () => {
      console.log("fetching url");
      const resp = await fetch(`${backendURL}/${id}`);
      const data = await resp.json();
      console.log(data);
      if (resp.status === 200) {
        window.location.href = data.resp;
      }
    };
    fetchURL();
  }, []);
  return <div>RedirectPage</div>;
};

export default RedirectPage;
