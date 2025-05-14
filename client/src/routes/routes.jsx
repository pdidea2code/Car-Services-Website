import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Lazy-loaded components
const Home = lazy(() => import("../pages/Homepage/Home"));
const Services = lazy(() => import("../pages/Services"));
const Servicedetail = lazy(() => import("../pages/Services/Servicedetail"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Login = lazy(() => import("../pages/Auth/Login"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const Account = lazy(() => import("../pages/Account/Account"));
const Profile = lazy(() => import("../pages/Account/Profile/Profile"));
const Servicehistory = lazy(() => import("../pages/Account/Servicehistory/Servicehistory"));
const Upcoming = lazy(() => import("../pages/Account/Servicehistory/Upcoming"));
const Managecard = lazy(() => import("../pages/Account/Managecard/Managecard"));
const Invoice = lazy(() => import("../pages/Account/Servicehistory/Invoice"));
const Review = lazy(() => import("../pages/Account/review/Review"));
const Blog = lazy(() => import("../pages/Blog/Blogindex"));
const Blogdetail = lazy(() => import("../pages/Blog/Blogdetail"));
const Contect = lazy(() => import("../pages/Contect/Contect"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const BookServce = lazy(() => import("../pages/Booking/Service/BookServce"));
const Addons = lazy(() => import("../pages/Booking/Addons/Addons"));
const Dateandtime = lazy(() => import("../pages/Booking/Dateandtime/Dateandtime"));
const Cartype = lazy(() => import("../pages/Booking/Cartype/Cartype"));
const Payment = lazy(() => import("../pages/Booking/Payment/Payment"));
const NotFound = lazy(() => import("./404"));

// Private route logic
const PrivateRoute = ({ children }) => {
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");
  return auth ? children : <Navigate to="/login" replace />;
};

// Public route logic
const PublicRoute = ({ children }) => {
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");
  return auth ? <Navigate to="/" replace /> : children;
};

const RouteList = () => {
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const location = useLocation();

  useEffect(() => {
    const routeTitles = {
      "/": `Home - ${appSetting?.name}`,
      "/services": `Service - ${appSetting?.name}`,
      "/booking": `Booking - ${appSetting?.name}`,
      "/blog": `Blog - ${appSetting?.name}`,
      "/contact": `Contect us - ${appSetting?.name}`,
      "/login": `${appSetting?.name}`,
      "/register": `${appSetting?.name}`,
    };

    let title = routeTitles[location.pathname];

    if (!title) {
      if (location.pathname.startsWith("/services/")) {
        title = `Service - ${appSetting?.name}`;
      } else if (location.pathname.startsWith("/booking")) {
        title = `Booking - ${appSetting?.name}`;
      } else {
        title = appSetting?.name;
      }
    }

    document.title = title;
  }, [location.pathname, appSetting]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:id" element={<Servicedetail />} />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <GoogleOAuthProvider clientId={appSetting?.google_client_id}>
              <Login />
            </GoogleOAuthProvider>
          </PublicRoute>
        }
      />
      <Route
        path="/forgotpassword"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/account"
        element={
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        }
      >
        <Route path="profile" element={<Profile />} />
        <Route path="servicehistory" element={<Servicehistory />} />
        <Route path="upcomingservice" element={<Upcoming />} />
        <Route path="managecard" element={<Managecard />} />
      </Route>
      <Route
        path="/account/servicehistory/review"
        element={
          <PrivateRoute>
            <Review />
          </PrivateRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        }
      >
        <Route path="service" element={<BookServce />} />
        <Route path="addons" element={<Addons />} />
        <Route path="datetime" element={<Dateandtime />} />
        <Route path="cartype" element={<Cartype />} />
      </Route>
      <Route
        path="/invoice"
        element={
          <PrivateRoute>
            <Invoice />
          </PrivateRoute>
        }
      />
      <Route path="/booking/payment" element={<Payment />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<Blogdetail />} />
      <Route path="/contact" element={<Contect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteList;
