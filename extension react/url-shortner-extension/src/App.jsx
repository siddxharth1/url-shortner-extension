import "./App.css";
import Main from "./components/Main";
import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./components/Homepage";
import { useAuthContext } from "./hooks/useAuthContext";
import RedirectPage from "./components/RedirectPage";
import { lazy, Suspense } from "react";
import Loading from "./components/Loading";

const PremiumPage = lazy(() => import("./components/PremiumPage"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const AnalyticsPage = lazy(() => import("./components/AnalyticsPage"));
const Profile = lazy(() => import("./components/Profile"));

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
          <Route
            path="/analytics/:id"
            element={
              <Suspense fallback={<Loading />}>
                <AnalyticsPage />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loading />}>
                <Profile />
              </Suspense>
            }
          />
        </Route>
        {/* <Main /> */}
        <Route
          path="login"
          element={
            !user ? (
              <Suspense fallback={<Loading />}>
                <Login />
              </Suspense>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="signup"
          element={
            <Suspense fallback={<Loading />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="forgotpassword"
          element={
            <Suspense fallback={<Loading />}>
              <ForgotPassword />
            </Suspense>
          }
        />
        <Route
          path="/premium"
          element={
            <Suspense fallback={<Loading />}>
              <PremiumPage />
            </Suspense>
          }
        />
        <Route path="/:id" element={<RedirectPage />} />
      </Routes>
    </div>
  );
}

export default App;
