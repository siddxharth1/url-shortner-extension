import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { backendURL } from "../constants";

export const useLogin = () => {
  const [error, setError] = useState({ code: null, error: null });
  const [loading, setLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    const resp = await fetch(backendURL + "/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await resp.json();

    console.log(data);
    if (!resp.ok) {
      setError({ code: resp.status, error: data.resp });

      setLoading(false);
    }
    if (resp.ok) {
      setError({ code: resp.status, error: data.resp });
      setLoading(false);
      document.cookie = `user=${JSON.stringify(data)}`;
      dispatch({ type: "LOGIN", payload: data });
    }
  };
  return { login, error, loading };
};
