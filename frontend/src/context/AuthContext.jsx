import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, isLoading: false };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false };
    case "LOADING":
      return { ...state, isLoading: true };
    case "LOADED":
      return { ...state, isLoading: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const getCookieValue = (name) => {
      const nameString = name + "=";
      const value = document.cookie
        .split(";")
        .find((item) => item.trim().startsWith(nameString));
      if (value) {
        return value.split("=")[1];
      }
    };

    const userCookie = getCookieValue("user");
    // console.log("User cookie: ", userCookie);
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    console.log("User ", user);

    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    } else {
      dispatch({ type: "LOADED" }); // Set loading to false if no user found
    }
  }, []);

  console.log("Authcontext state: ", state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
