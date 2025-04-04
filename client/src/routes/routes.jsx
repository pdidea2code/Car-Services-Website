import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Homepage/Home";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Services from "../pages/Services";
import Servicedetail from "../pages/Services/Servicedetail";
import Register from "../pages/Auth/Register";
import Cookies from "js-cookie";
import Account from "../pages/Account/Account";
import Login from "../pages/Auth/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import Profile from "../pages/Account/Profile/Profile";
import Servicehistory from "../pages/Account/Servicehistory/Servicehistory";
import NotFound from "./404";
import Blog from "../pages/Blog/Blogindex";
import Blogdetail from "../pages/Blog/Blogdetail";
import Contect from "../pages/Contect/Contect";
import Booking from "../pages/Booking/Booking";
import BookServce from "../pages/Booking/Service/BookServce";
import Addons from "../pages/Booking/Addons/Addons";
import Dateandtime from "../pages/Booking/Dateandtime/Dateandtime";
import Cartype from "../pages/Booking/Cartype/Cartype";
import Payment from "../pages/Booking/Payment/Payment";
import Upcoming from "../pages/Account/Servicehistory/Upcoming";
const PrivateRoute = ({ children }) => {
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");

  if (auth) {
    return <Navigate to="/" replace />;
  }

  return children;
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
        title = `Service  - ${appSetting?.name}`;
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
        {/* <Route path="" element={<Profile />}></Route> */}
        <Route path="profile" element={<Profile />}></Route>
        <Route path="servicehistory" element={<Servicehistory />}></Route>
        <Route path="upcomingservice" element={<Upcoming />}></Route>
      </Route>
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
      <Route path="/booking/payment" element={<Payment />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<Blogdetail />} />
      <Route path="/contact" element={<Contect />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteList;
