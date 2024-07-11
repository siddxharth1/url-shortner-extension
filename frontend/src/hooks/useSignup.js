import { useState } from "react";
import { backendURL } from "../constants";

export const useSignup = () => {
  const [error, setError] = useState({ code: null, error: null });
  const [loading, setLoading] = useState(false);

  const [showOTPComponent, setshowOTPComponent] = useState(false);

  const signup = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    const resp = await fetch(backendURL + "/user/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      }),
    });

    const data = await resp.json();

    console.log(data);
    if (!resp.ok) {
      setError({ code: resp.ok, error: data.resp });
      setLoading(false);
    }

    if (resp.ok) {
      console.log("email is legit");
      setshowOTPComponent(true);
    }
  };
  return { signup, error, loading, showOTPComponent };
};
