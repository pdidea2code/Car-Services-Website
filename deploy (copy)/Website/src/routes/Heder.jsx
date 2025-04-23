import "./Heder.css";
import {
  Container,
  Row,
  Col,
  Navbar,
  Offcanvas,
  Nav,
  NavDropdown,
  Form,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import { getAppSetting } from "../API/Api";
import { useState, useEffect } from "react";
import { ProfileIcon, MenuIcon } from "../assets/icon/icons.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Header = () => {
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");

  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="Header">
      <Container>
        <Navbar key="lg" expand="lg" className="">
          <Container fluid>
            <Navbar.Brand href="/">
              {appSetting && <img src={appSetting.logo} alt="logo" />}
            </Navbar.Brand>
            <div className="d-flex">
              <div
                className="mobile-profile-div"
                onClick={() => {
                  if (auth) {
                    navigate("/account/profile");
                  } else {
                    navigate("/login");
                  }
                }}
              >
                <ProfileIcon className="profile-icon" />
              </div>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-lg`}>
                <MenuIcon className="menu-icon" />
              </Navbar.Toggle>
            </div>
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-lg`}
              aria-labelledby={`offcanvasNavbarLabel-expand-lg`}
              placement="end"
            >
              {/* <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-lg`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header> */}

              <Offcanvas.Body>
                <Nav className="justify-content-center flex-grow-1 navlinks">
                  <Nav.Link
                    onClick={() => navigate("/")}
                    className={activeLink === "/" ? "active" : ""}
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/services")}
                    className={
                      activeLink.startsWith("/services") ? "active" : ""
                    }
                  >
                    Services
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/booking/service")}
                    className={
                      activeLink.startsWith("/booking") ? "active" : ""
                    }
                  >
                    Booking
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/blog")}
                    className={activeLink.startsWith("/blog") ? "active" : ""}
                  >
                    Blog
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => navigate("/contact")}
                    className={
                      activeLink.startsWith("/contact") ? "active" : ""
                    }
                  >
                    Contact
                  </Nav.Link>
                </Nav>
                <div
                  className="desktop-profile-div"
                  onClick={() => {
                    if (auth) {
                      navigate("/account/profile");
                    } else {
                      navigate("/login");
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <ProfileIcon className="profile-icon" />
                  <div
                    className={`desktop-profile-div-text ${
                      activeLink.startsWith("/login") ||
                      activeLink.startsWith("/register") ||
                      activeLink.startsWith("/account") ||
                      activeLink.startsWith("/forgotpassword")
                        ? "desktop-profile-div-text-active"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {auth ? "My Account" : "Login/Register"}
                  </div>
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Container>
    </div>
  );
};

export default Header;
