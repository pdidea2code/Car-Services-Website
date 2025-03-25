import './App.css';
import { BrowserRouter } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_LOADING, SET_LOADING_FALSE, SET_THEME, SET_APP_SETTING } from "./redux/action/action";
import { Spinner } from "react-bootstrap";
import { getAppSetting, getThemeSetting } from "./API/Api";
import AppRoutes from "./routes/AppRoutes";
import "bootstrap/scss/bootstrap.scss";
import "./custom.scss";
import "./icon.css";
function App() {
  const loading = useSelector((state) => state.loading.loading);  
 
  const dispatch = useDispatch();
  const setFavicon = (iconUrl) => {
    const existingLink = document.querySelector("link[rel='icon']");
    if (existingLink) {
      existingLink.parentNode.removeChild(existingLink);
    }

    const link = document.createElement("link");
    link.rel = "icon";
    link.href = iconUrl;
    link.type = "image/x-icon";
    document.head.appendChild(link);
  };


  const fetchAppSetting = async () => {
    try {
      dispatch({ type: SET_LOADING });
      const response = await getAppSetting();
      if (response.status === 200) {
        dispatch({ type: SET_APP_SETTING, payload: response.data.info });
        setFavicon(response.data.info.favicon);
      }
    } catch (error) {
      console.log("error", error);
    }
    finally {
      dispatch({ type: SET_LOADING_FALSE });
    }
  }

  const fetchThemeSetting = async () => {
    try {
      dispatch({ type: SET_LOADING });
      const response = await getThemeSetting();
      const root = document.documentElement
      root.style.setProperty('--color1', response.data.info.color1);
      root.style.setProperty('--color2', response.data.info.color2);
      root.style.setProperty('--color3', response.data.info.color3);
      dispatch({ type: SET_THEME, payload: response.data.info });
    }
    catch (error) {
      console.log("error", error);
    }
    finally {
      dispatch({ type: SET_LOADING_FALSE });
    }
  }

  useEffect(() => {
    fetchAppSetting();
    fetchThemeSetting();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <div>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
              <Spinner animation="border" role="status"/>
            </div>
          ) : (
            <div>
              
              <AppRoutes />
            </div>
          )}
        </div>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
