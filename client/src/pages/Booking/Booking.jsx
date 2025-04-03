import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./booking.css";
import Showcase from "../../components/showcase/Showcase";
import Header from "../../components/Header/index";
import AOS from "aos";
import "aos/dist/aos.css";
import { useSelector } from "react-redux";
import {
  ServiceTypeIcon,
  AddonsIcon,
  ClockFillIcon,
  DurationIcon,
  PriceTagIcon,
  Carrigttolefticon,
} from "../../assets/icon/icons";
import { useForm } from "react-hook-form";
const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const [serviceid, setServiceid] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [addon, setAddon] = useState([]);
  const [cartype, setCartype] = useState({});
  const [selectedDate, setSelectedDate] = useState(null); // New state for date
  const [selectedTime, setSelectedTime] = useState(null); // New state for time
  const { register, handleSubmit } = useForm();
  const [cartypeError, setCartypeError] = useState(null);
  const [errors, setErrors] = useState();

  const path = location.pathname.split("/");
  let currentPath = "";
  switch (path[2]) {
    case "service":
      currentPath = "Service";
      break;
    case "addons":
      currentPath = "Addons";
      break;
    case "datetime":
      currentPath = "Date & Time";
      break;
    case "cartype":
      currentPath = "Car Type";

      break;
  }

  const nav = [
    { title: "Home", path: "/" },
    { title: "Booking", path: "/booking/service" },
    { title: currentPath, path: "/booking/" + path[2] },
  ];

  const updateTotals = (servicePrice = 0, serviceTime = 0, addons = []) => {
    const addonPrice = addons.reduce((sum, item) => sum + item.price, 0);
    const addonTime = addons.reduce((sum, item) => sum + item.time, 0);
    setTotalPrice(servicePrice + addonPrice);
    setTotalTime(serviceTime + addonTime);
  };

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, []);

  const onSubmit = (data) => {
    if (!serviceid?.id) {
      navigate("/booking/service");
      setErrors("Please select a service");
      return;
    }
    if (!selectedDate || !selectedTime) {
      navigate("/booking/datetime");
      setErrors("Please select a date and time");
      return;
    }
    if (!cartype?.id) {
      setCartypeError("Please select a car type");
      setErrors("Please select a car type");
      return;
    }
    console.log(data);
  };
  return (
    <>
      <Header title="Booking" navigation={nav} />
      <div
        style={{ backgroundColor: "var(--color3)" }}
        className="booking-container"
      >
        <Container>
          <Row className="booking-container-row justify-content-center">
            <Col lg={true} className="booking-container-col1">
              <button
                onClick={() => navigate("/booking/service")}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "service" ? "active btn-4" : "") +
                  (serviceid?.id ? " complete " : "") +
                  (serviceid?.id && path[2] !== "service" ? " btn-3" : "")
                }
              >
                Service
              </button>
              <button
                onClick={() => serviceid?.id && navigate("/booking/addons")}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "addons" ? "active btn-4" : "btn-3") +
                  (path[2].startsWith("datetime") ||
                  path[2].startsWith("cartype") ||
                  addon.length > 0
                    ? " complete "
                    : "") +
                  (path[2] !== "addons" ? " btn-3" : "")
                }
              >
                Addons
              </button>
              <button
                onClick={() => serviceid?.id && navigate("/booking/datetime")}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "datetime" ? "active btn-4" : "btn-3") +
                  (selectedDate && selectedTime ? " complete" : "") +
                  (selectedDate && selectedTime && path[2] !== "datetime"
                    ? " btn-3"
                    : "")
                }
              >
                Date & Time
              </button>
              <button
                onClick={() => serviceid?.id && navigate("/booking/cartype")}
                className={
                  "account-page-col1-button zen-dots " +
                  (path[2] === "cartype" ? "active btn-4" : "btn-3") +
                  (cartype?.id ? " complete" : "") +
                  (cartype?.id && path[2] !== "cartype" ? " btn-3" : "")
                }
              >
                Car Type
              </button>
            </Col>
            <Col lg={true} className="booking-container-col2">
              <Outlet
                context={{
                  serviceid,
                  setServiceid,
                  totalPrice,
                  totalTime,
                  addon,
                  setAddon,
                  updateTotals,
                  selectedDate, // Pass selectedDate
                  setSelectedDate, // Pass setter for date
                  selectedTime, // Pass selectedTime
                  setSelectedTime, // Pass setter for time
                  cartype,
                  setCartype,
                  cartypeError,
                  setCartypeError,
                  setErrors,
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col
              xl={12}
              lg={12}
              className="booking-service-order-confirmation zen-dots"
              data-aos="fade-up"
            >
              Order Confirmation
            </Col>
            {errors && (
              <Col xl={12} lg={12} md={12}>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-danger k2d">{errors}</span>
                </div>
              </Col>
            )}
            <Col xl={6} lg={6} md={12}>
              <Row
                xl={2}
                lg={2}
                md={2}
                sm={2}
                xs={2}
                className="booking-service-order-confirmation-row"
              >
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <ServiceTypeIcon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">
                      Service Type
                    </span>
                    <span className="order-summary-icon-text2 k2d">
                      {serviceid?.name || serviceid?.id ? serviceid?.name : "-"}
                    </span>
                  </div>
                </Col>
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <AddonsIcon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">Add-Ons</span>
                    <span className="order-summary-icon-text3 k2d">
                      {Array.isArray(addon) && addon.length > 0
                        ? addon.map((item, index) => (
                            <span key={index}>
                              {item.name}
                              {index < addon.length - 1 && <br />}
                            </span>
                          ))
                        : "-"}
                    </span>
                  </div>
                </Col>
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <ClockFillIcon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">Date & Time</span>
                    <span className="order-summary-icon-text2 k2d">
                      {selectedDate || selectedTime
                        ? `${selectedDate.getDate()} ${selectedDate.toLocaleString(
                            "en-US",
                            { month: "short" }
                          )}, ${selectedTime}`
                        : "-"}
                    </span>
                  </div>
                </Col>
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <Carrigttolefticon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">Car Type</span>
                    <span className="order-summary-icon-text2 k2d">
                      {cartype?.name || cartype?.id ? cartype?.name : "-"}
                    </span>
                  </div>
                </Col>
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <DurationIcon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">
                      Total Duration
                    </span>
                    <span className="order-summary-icon-text3 k2d">
                      {totalTime || 0}min
                    </span>
                  </div>
                </Col>
                <Col className="">
                  <div className="booking-service-order-summary-col">
                    <div className="order-summary-icon">
                      <PriceTagIcon className="OrderSummaryIcon" />
                    </div>
                    <span className="order-summary-icon-text">Total Price</span>
                    <span className="order-summary-icon-text3 k2d">
                      {appSetting?.currency_symbol}
                      {totalPrice || 0}
                    </span>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col xl={6} lg={6} md={12} className="order-form-col">
              <div className="order-form-col-inner">
                <span className="order-form-title zen-dots">
                  Input Your Contact Info
                </span>
              </div>
              <Form className="row " onSubmit={handleSubmit(onSubmit)}>
                <Col xl={12} lg={12} md={12} className="order-form-control">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder="Your Name"
                      className="order-form-input k2d"
                    />
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6} xs={6} className="order-form-control">
                  <Form.Group>
                    <Form.Control
                      type="number"
                      placeholder="Phone Number"
                      className="order-form-input k2d"
                    />
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6} xs={6} className="order-form-control">
                  <Form.Group>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      className="order-form-input k2d"
                    />
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} className="order-form-control">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      type="text"
                      className="order-form-input k2d"
                      placeholder="Additional Information"
                    />
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6} className="order-form-control">
                  <Form.Group>
                    <div className="order-form-checkbox-container k2d">
                      <Form.Check
                        type="checkbox"
                        label="PIckup and Drop service"
                        className="order-form-checkbox"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6} className="order-form-control">
                  <Form.Group>
                    <div className="order-form-checkbox-container k2d">
                      <Form.Check
                        type="checkbox"
                        label="On-Site Service At Station"
                        className="order-form-checkbox"
                      />
                    </div>
                  </Form.Group>
                </Col>
                <Col
                  xl={12}
                  lg={12}
                  md={12}
                  className="d-flex justify-content-center"
                >
                  <button
                    type="submit"
                    className="booking-service-next zen-dots btn-4"
                  >
                    Book Now
                  </button>
                </Col>
              </Form>
            </Col>
          </Row>
          {/* <Row>
            <Col>{serviceid?.id || "No service selected"}</Col>
            <Col>{serviceid?.name || ""}</Col>
            <Col>{serviceid?.price || 0}</Col>
            <Col>{serviceid?.time || 0}</Col>
          </Row>
          <Row>
            {addon.map((item) => (
              <Col key={item._id}>
                <div>{item._id}</div>
                <div>{item.name}</div>
                <div>{item.price}</div>
                <div>{item.time}</div>
              </Col>
            ))}
          </Row>
          <Row>
            <Col>Total Price: {totalPrice}</Col>
            <Col>Total Time: {totalTime}</Col>
          </Row>
          <Row>
            <Col>
              Selected Date:{" "}
              {selectedDate
                ? `${selectedDate.getDate()} ${selectedDate.toLocaleString(
                    "en-US",
                    { month: "short" }
                  )}`
                : "Not selected"}
            </Col>

            <Col>Selected Time: {selectedTime || "Not selected"}</Col>
          </Row>
          <Row>
            <Col>Selected Cartype: {cartype?.name || "Not selected"}</Col>
            <Col>Selected Cartype ID: {cartype?.id || "Not selected"}</Col>
          </Row> */}
        </Container>
        <Showcase />
      </div>
    </>
  );
};

export default Booking;
