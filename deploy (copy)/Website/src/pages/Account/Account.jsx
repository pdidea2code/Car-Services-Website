import { SET_LOGOUT } from "../../redux/action/action";
import Cookies from "js-cookie";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Col, Container, Row, Modal } from "react-bootstrap";
import Profile from "./Profile/Profile";
import "./account.css";
import { useState, useEffect } from "react";
import Header from "../../components/Header/index";
import Showcase from "../../components/showcase/Showcase";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useSelector } from "react-redux";
const Account = () => {
  const appsrting = useSelector((state) => state.appSetting.appSetting);
  const stripePromise = loadStripe(appsrting?.stripe_publishable_key);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const path = location.pathname.split("/");
  const auth = Cookies.get("isLoggedIn") || Cookies.get("token");
  let currentPath = "";
  switch (path[2]) {
    case "profile":
      currentPath = "My Profile";
      break;
    case "servicehistory":
      currentPath = "Service History";
      break;
    case "upcomingservice":
      currentPath = "Upcoming Service";
      break;
    case "managecard":
      currentPath = "Manage Card";
      break;
  }
  const nav = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "My Account",
      path: "/account/profile",
    },
    {
      title: currentPath,
      path: "/account/" + path[2],
    },
  ];
  useEffect(() => {
    if (location.pathname === "/account") {
      navigate("/account/profile");
    }
  }, [location]);
  return (
    <>
      <Header title="MY ACCOUNT" navigation={nav} />
      <Modal
        className="logout-modal"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Body className="logout-modal-body">
          <span className="logout-modal-title zen-dots">Logout</span>
          <span className="logout-modal-description k2d">
            Are You Sure You Want To Log Out?
          </span>
        </Modal.Body>
        <Modal.Footer className="logout-modal-footer">
          <button
            className="modal-cancel-button btn-4 zen-dots"
            onClick={() => {
              setShowModal(false);
            }}
          >
            Cancel
          </button>
          <button
            className="modal-logout-button btn-4 zen-dots"
            onClick={() => {
              Cookies.remove("isLoggedIn");
              Cookies.remove("token");
              Cookies.remove("refreshToken");
              Cookies.remove("user");
              dispatch({
                type: SET_LOGOUT,
              });
              navigate("/login");
            }}
          >
            Logout
          </button>
        </Modal.Footer>
      </Modal>
      <div className="account-page">
        <Container>
          <Row className="account-page-row">
            <Col lg={true} className="account-page-col1">
              <button
                onClick={() => {
                  navigate("/account/profile");
                }}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "profile" ? "active btn-4" : "btn-3")
                }
              >
                My Profile
              </button>
              <button
                onClick={() => {
                  navigate("/account/servicehistory");
                }}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "servicehistory" ? "active btn-4" : "btn-3")
                }
              >
                Service History
              </button>
              <button
                onClick={() => {
                  navigate("/account/upcomingservice");
                }}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "upcomingservice" ? "active btn-4" : "btn-3")
                }
              >
                Upcoming Service
              </button>
              <button
                onClick={() => {
                  navigate("/account/managecard");
                }}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "managecard" ? "active btn-4" : "btn-3")
                }
              >
                Manage Card
              </button>
              <button
                onClick={() => {
                  setShowModal(true);
                }}
                className="account-page-col1-button zen-dots btn-3"
              >
                Logout
              </button>
            </Col>
            <Col lg={true}>
              <Elements stripe={stripePromise}>
                <Outlet />
              </Elements>
            </Col>
          </Row>
        </Container>
      </div>
      <Showcase />
    </>
  );
};

export default Account;
