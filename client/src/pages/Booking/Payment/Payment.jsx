import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../../components/Header";
import Showcase from "../../../components/showcase/Showcase";

import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
  Modal,
  Button,
} from "react-bootstrap";
import "./payment.css";
import { useForm } from "react-hook-form";
import { getAddress, createOrder } from "../../../API/Api";
import { useSelector } from "react-redux";
import { verifyPromocode } from "../../../API/Api";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  VisaCardIcon,
  MasterCardIcon,
  DeleteIcon,
  CardIcon,
  GooglePayIcon,
} from "../../../assets/icon/icons";
import NetbankingIcon from "../../../assets/icon/netbanking.svg";
import {
  getCard,
  deleteCard,
  cardPayment,
  verifyPayment,
  createCheckoutSession,
} from "../../../API/Api";
import dayjs from "dayjs";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [address, setAddress] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { state } = useLocation();
  const [isOn, setIsOn] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeDetails, setPromoCodeDetails] = useState({});
  const [isPromoCodeApplied, setIsPromoCodeApplied] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [priceDetails, setPriceDetails] = useState({
    basePrice: 0.0,
    discountedPrice: 0.0,
    taxAmount: 0.0,
    discount: 0.0,
    finalPrice: 0.0,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cardToDelete, setCardToDelete] = useState(null);
  const [issubitloading, setIssubitloading] = useState(false);

  const handleToggle = () => {
    setIsOn(!isOn);
    setSelectedPaymentMethod(null);
    setSelectedCard(null);
  };

  const getBaseUrl = () => {
    return `${window.location.protocol}//${window.location.host}`;
  };

  const handleDelete = async (id) => {
    setCardToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await deleteCard({ id: cardToDelete });
      if (res.status === 200) {
        setSuccessMessage("Card deleted successfully");
        setShowSuccessModal(true);
        fetchCard();
      } else {
        setErrorMessage("Failed to delete card");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to delete card");
      setShowErrorModal(true);
    } finally {
      setShowDeleteModal(false);
      setCardToDelete(null);
    }
  };
  const fetchCard = async () => {
    try {
      setIsLoading(true);
      const res = await getCard();
      setCardList(res.data.info);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
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
      setIssubitloading(true);

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
        total_time: state?.booking?.totalTime,
        service_amount: priceDetails.basePrice,
        tax_amount: priceDetails.taxAmount,
        total_amount: priceDetails.finalPrice,
        pickupanddrop: state?.data?.pickupDrop || false,
        carname: data.carName,
        carnumber: data.carNumber,
        address_id: data.city,
        city: address.find((addr) => addr._id === data.city)?.city || data.city,
        pincode: data.pincode,
        colony: data.colony || "",
        house_no: data.flat || "",
        payment_method: selectedPaymentMethod,
        cardId: selectedCard ? selectedCard : null,
        success_url: `${getBaseUrl()}/account/servicehistory`,
        cancel_url: `${getBaseUrl()}/account/servicehistory`,
        paymentmode: isOn ? "ONLINE" : "COD",
        // Only include discount_amount and promocode_id if a promo code is applied
        ...(isPromoCodeApplied &&
          promoCodeDetails?.promoCode?._id && {
            promocode_id: promoCodeDetails.promoCode._id,
            discount_amount: priceDetails.discount,
          }),
      };
      let response;
      if (selectedCard !== null && isOn && selectedPaymentMethod === "card") {
        response = await cardPayment(payload);
        const data = response.data.info;
        let result;
        if (selectedCard) {
          if (data.paymentIntent.status === "succeeded") {
            result = { paymentIntent: data.paymentIntent };
          } else if (
            data.paymentIntent.status === "requires_action" ||
            data.paymentIntent.status === "requires_confirmation"
          ) {
            result = await stripe.confirmCardPayment(
              data.paymentIntent.client_secret,
              {
                payment_method: data.paymentIntent.payment_method,
              }
            );
          } else {
            throw new Error(
              `Payment failed on server: ${data.paymentIntent.status}`
            );
          }
        } else {
          console.log(response);
          console.log("card not selected");
        }
        console.log(result);
        if (result.error) {
          const response11 = await verifyPayment({
            order_id: response.data.info.order._id,
            status: "failed",
            paymentIntentId: result.error.payment_intent.id,
          });
          alert("Payment failed: " + result.error.message);
        } else if (result.paymentIntent.status === "succeeded") {
          console.log("Payment successful:", result);
          const response11 = await verifyPayment({
            order_id: response.data.info.order._id,
            status: "completed",
            paymentIntentId: result.paymentIntent.id,
          });

          if (response11.status === 200) {
            navigate(`/account/servicehistory`);
          }
          alert("Payment successful!");
        }
      } else if (
        isOn ||
        selectedPaymentMethod === "upi" ||
        selectedPaymentMethod === "netbanking"
      ) {
        response = await createCheckoutSession(payload);
        if (response.status === 200) {
          const result = await stripe.redirectToCheckout({
            sessionId: response.data.info.sessionId,
          });
          if (result.error) {
            console.error("Error redirecting to checkout:", result.error);
          }
        }
      } else {
        response = await createOrder(payload);
        if (response.status === 200) {
          navigate(`/account/servicehistory`);
        }
      }
      // Call createOrder API

      if (response.status === 200) {
        console.log(response.data.info);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to create order"
      );
      setShowErrorModal(true);
    } finally {
      setIssubitloading(false);
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

  useEffect(() => {
    fetchCard();
  }, []);

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
                          disabled={issubitloading}
                        >
                          {issubitloading ? "Processing..." : "Confirm"}
                        </button>
                      </div>
                    </Form>
                  )}
                </Col>
                {isOn && (
                  <Col className="payment-page-col">
                    <div className="payment-page-title zen-dots">
                      Choose Payment Option
                    </div>
                    <Row>
                      {cardList.length === 0 ? (
                        <Col
                          xl={12}
                          lg={12}
                          md={12}
                          className="managecard-card-container"
                        >
                          <div className="managecard-card-right">
                            <span className="managecard-card-title k2d">
                              No card found
                            </span>
                          </div>
                        </Col>
                      ) : (
                        cardList.map((card) => (
                          <Col
                            xl={12}
                            lg={12}
                            md={12}
                            className={`managecard-card-container ${
                              card._id === selectedCard ? "selected" : ""
                            }`}
                            onClick={() => {
                              setSelectedPaymentMethod("card");
                              setSelectedCard(card._id);
                            }}
                          >
                            <div className="managecard-card-right">
                              {card.cardType === "visa" && <VisaCardIcon />}
                              {card.cardType === "mastercard" && (
                                <MasterCardIcon />
                              )}
                              {card.cardType !== "visa" &&
                                card.cardType !== "mastercard" && (
                                  <CardIcon className="CardIcon" />
                                )}
                              <div className="d-flex flex-column ps-3">
                                <span className="managecard-card-title k2d">
                                  xxxx xxxx xxxx {card.last4}
                                </span>
                                <span className="managecard-card-title k2d">
                                  Exp. date {card.expiryMonth}/{card.expiryYear}
                                </span>
                              </div>
                            </div>
                            <div
                              className="managecard-card-left"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleDelete(card._id)}
                            >
                              <DeleteIcon className="DeleteIcon" />
                            </div>
                          </Col>
                        ))
                      )}
                      <Col
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        className="managecard-card-container1"
                      >
                        <Form.Group className="d-flex w-100">
                          <Form.Check
                            type="checkbox"
                            className="payment-page-form-input order-form-checkbox k2d"
                            label={
                              <div className="d-flex align-items-center gap-2">
                                <GooglePayIcon />
                                <span className="payment-option-title k2d">
                                  UPI Option
                                </span>
                              </div>
                            }
                            checked={selectedPaymentMethod === "upi"}
                            onChange={() => {
                              setSelectedPaymentMethod("upi");
                              setSelectedCard(null);
                            }}
                          />
                        </Form.Group>
                      </Col>

                      <Col
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        className="managecard-card-container1"
                      >
                        <Form.Group className="d-flex w-100">
                          <Form.Check
                            type="checkbox"
                            className="payment-page-form-input order-form-checkbox k2d"
                            label={
                              <div className="d-flex align-items-center gap-2">
                                <img src={NetbankingIcon} alt="Net Banking" />
                                <span className="payment-option-title k2d">
                                  Net Banking
                                </span>
                              </div>
                            }
                            checked={selectedPaymentMethod === "netbanking"}
                            onChange={() => {
                              setSelectedPaymentMethod("netbanking");
                              setSelectedCard(null);
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                      <div className="text-center">
                        <button
                          className="btn-4 payment-page-btn zen-dots"
                          type="submit"
                          disabled={issubitloading}
                        >
                          {issubitloading ? "Processing..." : "Pay Now"}
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
      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this card?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Payment;
