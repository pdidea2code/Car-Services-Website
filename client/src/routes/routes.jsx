import { Routes, Route } from "react-router-dom";
import Home from "../pages/Homepage/Home";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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
          if (location.pathname.startsWith("/service/detail")) {
            title = `Service  - ${appSetting?.name}`;
          } else if (location.pathname.startsWith("/booking")) {
            title = `Booking - ${appSetting?.name}`;
          } else {
            title = appSetting?.name;
          }
        }
        document.title = title;
    }, [location.pathname,appSetting]);
    
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default RouteList;
