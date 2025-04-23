import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "../../components/Header/index";
import Showcase from "../../components/showcase/Showcase";
import "./booking.css";
import { memo } from "react";
import {
  ServiceTypeIcon,
  AddonsIcon,
  ClockFillIcon,
  DurationIcon,
  PriceTagIcon,
  Carrigttolefticon,
} from "../../assets/icon/icons";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const [state, setState] = useState({
    serviceid: {},
    totalPrice: 0,
    totalTime: 0,
    addon: [],
    cartype: {},
    selectedDate: null,
    selectedTime: null,
    cartypeError: null,
    errors: null,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const pickupDrop = watch("pickupDrop");
  const onSiteService = watch("onSiteService");
  const path = location.pathname.split("/")[2];
  const currentPath =
    {
      service: "Service",
      addons: "Addons",
      datetime: "Date & Time",
      cartype: "Car Type",
    }[path] || "";

  const nav = [
    { title: "Home", path: "/" },
    { title: "Booking", path: "/booking/service" },
    { title: currentPath, path: `/booking/${path}` },
  ];

  const updateTotals = useCallback(
    (servicePrice = 0, serviceTime = 0, addons = []) => {
      try {
        const addonPrice = addons.reduce((sum, item) => sum + item.price, 0);
        const addonTime = addons.reduce((sum, item) => sum + item.time, 0);
        setState((prev) => ({
          ...prev,
          totalPrice: servicePrice + addonPrice,
          totalTime: serviceTime + addonTime,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          errors: "Error calculating totals",
        }));
      }
    },
    []
  );

  useEffect(() => {
    try {
      AOS.init({
        disable: window.innerWidth < 992,
        once: true,
      });
    } catch (error) {
      console.error("AOS initialization failed:", error);
    }
    setValue("pickupDrop", true);
  }, []);

  const onSubmit = useCallback(
    (data) => {
      const { serviceid, selectedDate, selectedTime, cartype } = state;
      try {
        if (!serviceid?.id) {
          navigate("/booking/service");
          throw new Error("Please select a service");
        }
        if (!selectedDate || !selectedTime) {
          navigate("/booking/datetime");
          throw new Error("Please select a date and time");
        }
        if (!cartype?.id) {
          navigate("/booking/cartype");
          throw new Error("Please select a car type");
        }
        navigate("/booking/payment", { state: { data, booking: state } });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          errors: error.message,
          cartypeError: error.message.includes("car type")
            ? error.message
            : prev.cartypeError,
        }));
      }
    },
    [state, navigate]
  );

  const contextValue = {
    ...state,
    setServiceid: (val) => setState((prev) => ({ ...prev, serviceid: val })),
    setAddon: (val) => setState((prev) => ({ ...prev, addon: val })),
    setCartype: (val) => setState((prev) => ({ ...prev, cartype: val })),
    setSelectedDate: (val) =>
      setState((prev) => ({ ...prev, selectedDate: val })),
    setSelectedTime: (val) =>
      setState((prev) => ({ ...prev, selectedTime: val })),
    setCartypeError: (val) =>
      setState((prev) => ({ ...prev, cartypeError: val })),
    setErrors: (val) => setState((prev) => ({ ...prev, errors: val })),
    updateTotals,
  };

  const handleCheckboxChange = (field) => {
    if (field === "pickupDrop") {
      setValue("pickupDrop", true);
      setValue("onSiteService", false);
    } else {
      setValue("pickupDrop", false);
      setValue("onSiteService", true);
    }
  };

  return (
    <>
      <Header title="Booking" navigation={nav} />
      <div
        className="booking-container"
        style={{ backgroundColor: "var(--color3)" }}
      >
        <Container>
          <Row className="booking-container-row justify-content-center">
            <Col lg={true} className="booking-container-col1">
              {["service", "addons", "datetime", "cartype"].map((step) => (
                <button
                  key={step}
                  onClick={() =>
                    step === "service" || state.serviceid?.id
                      ? navigate(`/booking/${step}`)
                      : null
                  }
                  className={`account-page-col1-button zen-dots ${
                    path === step ? "active btn-4" : "btn-3"
                  } ${
                    (step === "service" && state.serviceid?.id) ||
                    (step === "addons" &&
                      (path === "datetime" ||
                        path === "cartype" ||
                        state.addon.length > 0)) ||
                    (step === "datetime" &&
                      state.selectedDate &&
                      state.selectedTime) ||
                    (step === "cartype" && state.cartype?.id)
                      ? "complete"
                      : ""
                  }`}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
              ))}
            </Col>
            <Col lg={true} className="booking-container-col2">
              <Outlet context={contextValue} />
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
            {/* {state.errors && (
              <Col xl={12} lg={12} md={12}>
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-danger k2d">{state.errors}</span>
                </div>
              </Col>
            )} */}
            <Col xl={6} lg={6} md={12}>
              <Row
                xl={2}
                lg={2}
                md={2}
                sm={2}
                xs={2}
                className="booking-service-order-confirmation-row"
              >
                <Col>
                  <div className="booking-service-order-summary-col">
                    <ServiceTypeIcon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">
                      Service Type
                    </span>
                    <span className="order-summary-icon-text2 k2d">
                      {state.serviceid?.name || "-"}
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className="booking-service-order-summary-col">
                    <AddonsIcon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">Add-Ons</span>
                    <span className="order-summary-icon-text3 k2d">
                      {state.addon.length > 0
                        ? state.addon.map((item) => item.name).join(", ")
                        : "-"}
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className="booking-service-order-summary-col">
                    <ClockFillIcon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">Date & Time</span>
                    <span className="order-summary-icon-text2 k2d">
                      {state.selectedDate && state.selectedTime
                        ? `${state.selectedDate.getDate()} ${state.selectedDate.toLocaleString(
                            "en-US",
                            { month: "short" }
                          )}, ${state.selectedTime}`
                        : "-"}
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className="booking-service-order-summary-col">
                    <Carrigttolefticon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">Car Type</span>
                    <span className="order-summary-icon-text2 k2d">
                      {state.cartype?.name || "-"}
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className="booking-service-order-summary-col">
                    <DurationIcon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">
                      Total Duration
                    </span>
                    <span className="order-summary-icon-text3 k2d">
                      {state.totalTime}min
                    </span>
                  </div>
                </Col>
                <Col>
                  <div className="booking-service-order-summary-col">
                    <PriceTagIcon className="OrderSummaryIcon" />
                    <span className="order-summary-icon-text">Total Price</span>
                    <span className="order-summary-icon-text3 k2d">
                      {appSetting?.currency_symbol}
                      {state.totalPrice}
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
              <Form className="row" onSubmit={handleSubmit(onSubmit)}>
                <Col xl={12} lg={12} md={12} className="order-form-control">
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    className="order-form-input k2d"
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && (
                    <div className="d-flex">
                      <span className="text-danger k2d">
                        {errors.name.message}
                      </span>
                    </div>
                  )}
                </Col>
                <Col xl={6} lg={6} md={6} xs={6} className="order-form-control">
                  <Form.Control
                    type="number"
                    placeholder="Phone Number"
                    className="order-form-input k2d"
                    {...register("phone", {
                      required: "Phone Number is required",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Phone Number must be exactly 10 digits",
                      },
                    })}
                  />

                  {errors.phone && (
                    <div className="d-flex">
                      <span className="text-danger k2d">
                        {errors.phone.message}
                      </span>
                    </div>
                  )}
                </Col>
                <Col xl={6} lg={6} md={6} xs={6} className="order-form-control">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    className="order-form-input k2d"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <div className="d-flex">
                      <span className="text-danger k2d">
                        {errors.email.message}
                      </span>
                    </div>
                  )}
                </Col>
                <Col xl={12} lg={12} md={12} className="order-form-control">
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Additional Information"
                    className="order-form-input k2d"
                    {...register("additionalInfo")}
                  />
                </Col>
                <Col xl={6} lg={6} md={6} className="order-form-control">
                  <div className="order-form-checkbox-container">
                    <Form.Check
                      type="checkbox"
                      label="Pickup and Drop service"
                      className="order-form-checkbox k2d"
                      checked={pickupDrop}
                      {...register("pickupDrop")}
                      onChange={() => handleCheckboxChange("pickupDrop")}
                    />
                  </div>
                </Col>
                <Col xl={6} lg={6} md={6} className="order-form-control">
                  <div className="order-form-checkbox-container">
                    <Form.Check
                      type="checkbox"
                      label="On-Site Service At Station"
                      className="order-form-checkbox k2d"
                      checked={onSiteService}
                      {...register("onSiteService")}
                      onChange={() => handleCheckboxChange("onSiteService")}
                    />
                  </div>
                </Col>
                {state.errors && (
                  <Col xl={12} lg={12} md={12}>
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="text-danger k2d">{state.errors}</span>
                    </div>
                  </Col>
                )}
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
        </Container>
        <Showcase />
      </div>
    </>
  );
};

export default memo(Booking);
