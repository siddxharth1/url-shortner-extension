import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./useAuthContext";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logout = () => {
    //remove user from cookie or localstorage
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };
  return logout;
};
