import "./App.css";
import Main from "./components/Main";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Homepage from "./components/Homepage";
import AnalyticsPage from "./components/AnalyticsPage";
import { useAuthContext } from "./hooks/useAuthContext";
import RedirectPage from "./components/RedirectPage";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import PremiumPage from "./components/PremiumPage";

function App() {
  const { user, isLoading } = useAuthContext();
  console.log(user);
  if (isLoading) return <div>Loading...</div>;
  return (
    <div
      style={{
        minWidth: "400px",
        maxHeight: "900px",
        padding: "0 20px 20px 20px",
      }}
    >
      <Routes>
        <Route path="/" element={user ? <Main /> : <Navigate to="/login" />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/analytics/:id" element={<AnalyticsPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* <Main /> */}
        <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="signup" element={<Signup />} />
        <Route path="forgotpassword" element={<ForgotPassword />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/:id" element={<RedirectPage />} />
      </Routes>
    </div>
  );
}

export default App;
