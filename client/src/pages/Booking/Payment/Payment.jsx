import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Header from "../../../components/Header";
import Showcase from "../../../components/showcase/Showcase";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import "./payment.css";
import { useForm } from "react-hook-form";
import { getAddress, createOrder } from "../../../API/Api";
import { useSelector } from "react-redux";
import { verifyPromocode } from "../../../API/Api";
import dayjs from "dayjs";

const Payment = () => {
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation();
  const [isOn, setIsOn] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeDetails, setPromoCodeDetails] = useState({});
  const [isPromoCodeApplied, setIsPromoCodeApplied] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [priceDetails, setPriceDetails] = useState({
    basePrice: 0.0,
    discountedPrice: 0.0,
    taxAmount: 0.0,
    discount: 0.0,
    finalPrice: 0.0,
  });

  const handleToggle = () => {
    setIsOn(!isOn);
  };

  function calculatePriceWithTaxAndDiscount(basePrice, taxRate, discount = 0) {
    const base = Number(basePrice);
    const discountAmount = Number(discount);
    const discountedPrice = base - discountAmount;
    const taxRateDecimal = Number(taxRate) / 100;
    const taxAmount = base * taxRateDecimal;
    const finalPrice = base + taxAmount - discountAmount;

    return {
      basePrice: Number(base.toFixed(2)),
      discountedPrice: Number(discountedPrice.toFixed(2)),
      taxAmount: Number(taxAmount.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
    };
  }

  const fetchAddress = async () => {
    try {
      setIsLoading(true);
      const response = await getAddress();
      if (response.status === 200) {
        setAddress(response.data.info);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVerifyPromoCode = async () => {
    try {
      const payload = {
        code: promoCode,
        orderAmount: state?.booking?.totalPrice,
      };
      const response = await verifyPromocode(payload);
      if (response.status === 200) {
        setPromoCodeDetails(response.data.info);
        setPromoCodeError("");
        setIsPromoCodeApplied(true);
        const { basePrice, discountedPrice, taxAmount, discount, finalPrice } =
          calculatePriceWithTaxAndDiscount(
            state?.booking?.totalPrice,
            appSetting?.service_tax,
            response.data.info.discount
          );
        setPriceDetails({
          basePrice,
          discountedPrice,
          taxAmount,
          discount,
          finalPrice,
        });
      }
    } catch (error) {
      console.log(error);
      setPromoCodeError(
        error?.response?.data?.message || "Something went wrong"
      );
      setPromoCodeDetails({});
      const { basePrice, discountedPrice, taxAmount, discount, finalPrice } =
        calculatePriceWithTaxAndDiscount(
          state?.booking?.totalPrice,
          appSetting?.service_tax,
          0
        );
      setPriceDetails({
        basePrice,
        discountedPrice,
        taxAmount,
        discount,
        finalPrice,
      });
    }
  };

  // Handle form submission and create order
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Prepare payload for createOrder API
      const payload = {
        service_id: state?.booking?.serviceid?.id,
        addons_id: state?.booking?.addon.map((addon) => addon._id) || [],
        cartype_id: state?.booking?.cartype?.id,
        date: dayjs(state?.booking?.selectedDate).format("YYYY-MM-DD"), // Adjusted for ISO date
        time: dayjs(state?.booking?.selectedTime, "hh:mm A").format("HH:mm"), // Convert to 24-hour
        additionalinfo: state?.data?.additionalInfo || "",
        name: state?.data?.name,
        email: state?.data?.email,
        phone: state?.data?.phone,
        service_amount: priceDetails.basePrice,
        tax_amount: priceDetails.taxAmount,
        total_amount: priceDetails.finalPrice,
        pickupanddrop: state?.data?.pickupDrop || false,
        carname: data.carName,
        carnumber: data.carNumber,
        city: address.find((addr) => addr._id === data.city)?.city || data.city,
        pincode: data.pincode,
        colony: data.colony || "",
        house_no: data.flat || "",
        paymentmode: isOn ? "ONLINE" : "COD",
        // Only include discount_amount and promocode_id if a promo code is applied
        ...(isPromoCodeApplied &&
          promoCodeDetails?.promoCode?._id && {
            promocode_id: promoCodeDetails.promoCode._id,
            discount_amount: priceDetails.discount,
          }),
      };

      // Call createOrder API
      const response = await createOrder(payload);
      if (response.status === 200) {
        console.log(response.data.info);
        navigate(`/account/servicehistory`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error?.response?.data?.message || "Failed to create order");
    } finally {
      setIsLoading(false);
    }
  };

  const nav = [
    { title: "Home", path: "/" },
    { title: "Booking", path: "/booking/service" },
    { title: "Payment", path: "/booking/payment" },
  ];

  useEffect(() => {
    if (!state) {
      navigate("/booking/service");
    }
    fetchAddress();
    if (state?.booking?.totalPrice) {
      const { basePrice, discountedPrice, taxAmount, discount, finalPrice } =
        calculatePriceWithTaxAndDiscount(
          state?.booking?.totalPrice,
          appSetting?.service_tax,
          0
        );
      setPriceDetails({
        basePrice,
        discountedPrice,
        taxAmount,
        discount,
        finalPrice,
      });
    }
    console.log(state);
    window.scrollTo(0, 0);
  }, [state, appSetting?.service_tax, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <>
          <Header title="Payment" navigation={nav} />
          <div className="payment-page">
            <Container>
              <Row className="payment-page-row">
                <Col className="payment-page-col1 d-flex justify-content-end align-items-center">
                  <div className="switch-container">
                    <span className="switch-label k2d">
                      {isOn ? "Proceed To Online" : "Pay At Service Station"}
                    </span>
                    <div
                      className={`switch ${isOn ? "on" : "off"}`}
                      onClick={handleToggle}
                    >
                      <div className="switch-handle"></div>
                    </div>
                  </div>
                </Col>
                <Col className="payment-page-col">
                  {orderError && (
                    <div className="d-flex">
                      <span className="text-danger k2d">{orderError}</span>
                    </div>
                  )}
                  <div className="payment-page-title zen-dots">
                    Pick-Up & Drop Address
                  </div>
                  <Form onSubmit={handleSubmit(onSubmit)} className="row">
                    <Col
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      className="margin-bottom-15"
                    >
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="text"
                          className="payment-page-form-input k2d"
                          placeholder="Car Name"
                          {...register("carName", {
                            required: "Car Name is required",
                          })}
                          isInvalid={!!errors.carName}
                        />
                        {errors.carName && (
                          <div className="d-flex">
                            <span className="text-danger k2d">
                              {errors.carName.message}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      className="margin-bottom-15"
                    >
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Control
                          type="text"
                          className="payment-page-form-input k2d"
                          placeholder="Car Number"
                          {...register("carNumber", {
                            required: "Car Number is required",
                          })}
                          isInvalid={!!errors.carNumber}
                        />
                        {errors.carNumber && (
                          <div className="d-flex">
                            <span className="text-danger k2d">
                              {errors.carNumber.message}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      className="margin-bottom-15"
                    >
                      <Form.Select
                        className="payment-page-form-input k2d"
                        {...register("city", { required: "City is required" })}
                        isInvalid={!!errors.city}
                      >
                        <option value="">Select a city</option>
                        {address.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.city}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.city && (
                        <div className="d-flex">
                          <span className="text-danger k2d">
                            {errors.city.message}
                          </span>
                        </div>
                      )}
                    </Col>
                    <Col
                      xl={6}
                      lg={6}
                      md={6}
                      sm={6}
                      className="margin-bottom-15"
                    >
                      <Form.Control
                        type="text"
                        className="payment-page-form-input k2d"
                        placeholder="Pincode"
                        {...register("pincode", {
                          required: "Pincode is required",
                        })}
                        isInvalid={!!errors.pincode}
                      />
                      {errors.pincode && (
                        <div className="d-flex">
                          <span className="text-danger k2d">
                            {errors.pincode.message}
                          </span>
                        </div>
                      )}
                    </Col>
                    {state?.data?.pickupDrop && (
                      <>
                        <Col
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          className="margin-bottom-15"
                        >
                          <Form.Control
                            type="text"
                            className="payment-page-form-input k2d"
                            placeholder="Colony / Street / Locality"
                            {...register("colony", {
                              required: "This field is required",
                            })}
                            isInvalid={!!errors.colony}
                          />
                          {errors.colony && (
                            <div className="d-flex">
                              <span className="text-danger k2d">
                                {errors.colony.message}
                              </span>
                            </div>
                          )}
                        </Col>
                        <Col
                          xl={12}
                          lg={12}
                          md={12}
                          sm={12}
                          className="margin-bottom-15"
                        >
                          <Form.Control
                            type="text"
                            className="payment-page-form-input k2d"
                            placeholder="Flat / House No. / Building Name"
                            {...register("flat", {
                              required: "This field is required",
                            })}
                            isInvalid={!!errors.flat}
                          />
                          {errors.flat && (
                            <div className="d-flex">
                              <span className="text-danger k2d">
                                {errors.flat.message}
                              </span>
                            </div>
                          )}
                        </Col>
                      </>
                    )}
                  </Form>
                </Col>
                <Col className="payment-page-col">
                  <div className="payment-page-title zen-dots">
                    Payment Detail
                  </div>
                  <InputGroup className="flex-nowrap">
                    <Form.Control
                      type="text"
                      className="payment-page-form-input k2d"
                      placeholder="Add Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={isPromoCodeApplied}
                    />
                    <InputGroup.Text
                      className="payment-promo-code-btn zen-dots"
                      onClick={fetchVerifyPromoCode}
                      style={{
                        pointerEvents: isPromoCodeApplied ? "none" : "auto",
                        opacity: isPromoCodeApplied ? 0.5 : 1,
                      }}
                    >
                      Apply
                    </InputGroup.Text>
                  </InputGroup>
                  {promoCodeError && (
                    <div className="d-flex">
                      <span className="text-danger k2d">{promoCodeError}</span>
                    </div>
                  )}
                  <div className="payment-page-payment-detail-item">
                    <span className="payment-page-payment-detail-item-title k2d">
                      Service Price
                    </span>
                    <span className="payment-page-payment-detail-item-price zen-dots">
                      {appSetting?.currency_symbol}
                      {priceDetails.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="payment-page-payment-detail-item">
                    <span className="payment-page-payment-detail-item-title k2d">
                      Tax
                    </span>
                    <span className="payment-page-payment-detail-item-price zen-dots">
                      {appSetting?.currency_symbol}
                      {priceDetails.taxAmount.toFixed(2)}
                    </span>
                  </div>
                  {priceDetails.discount > 0 && (
                    <div className="payment-page-payment-detail-item">
                      <span className="payment-page-payment-detail-item-title k2d">
                        Discount
                      </span>
                      <span className="payment-page-payment-detail-item-price zen-dots">
                        -{appSetting?.currency_symbol}
                        {priceDetails.discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="payment-page-payment-detail-item">
                    <span className="payment-page-payment-detail-item-title k2d">
                      Total
                    </span>
                    <span className="payment-page-payment-detail-item-price zen-dots">
                      {appSetting?.currency_symbol}
                      {priceDetails.finalPrice.toFixed(2)}
                    </span>
                  </div>
                  {!isOn && (
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div className="text-center">
                        <button
                          className="btn-4 payment-page-btn zen-dots"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Confirm"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Col>
                {isOn && (
                  <Col className="payment-page-col">
                    <div className="payment-page-title">Payment</div>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div className="text-center">
                        <button
                          className="btn-4 payment-page-btn zen-dots"
                          type="submit"
                          disabled={isLoading}
                        >
                          {isLoading ? "Processing..." : "Pay Now"}
                        </button>
                      </div>
                    </Form>
                  </Col>
                )}
              </Row>
            </Container>
          </div>
          <Showcase />
        </>
      )}
    </>
  );
};

export default Payment;
