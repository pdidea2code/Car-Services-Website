import "./managecard.css";
import { Row, Col, Form, Spinner, Modal, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { VisaCardIcon, MasterCardIcon, DeleteIcon, CardIcon } from "../../../assets/icon/icons";
import { saveCard, addCard, getCard, deleteCard } from "../../../API/Api";

const Managecard = () => {
  const [cardform, setCardform] = useState(false);
  const [cardholderName, setCardholderName] = useState("");
  const [issubmitloading, setIssubmitloading] = useState(false);
  const [cardType, setCardType] = useState("");
  const [isloading, setIsloading] = useState(false);
  const [cardList, setCardList] = useState([]);

  // Modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [cardToDelete, setCardToDelete] = useState(null);

  const stripe = useStripe();
  const elements = useElements();

  const handleCardNumberChange = (event) => {
    setCardType(event.brand || "unknown");
  };

  const fetchCard = async () => {
    try {
      setIsloading(true);
      const res = await getCard();
      setCardList(res.data.info);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to fetch card");
      setShowErrorModal(true);
    } finally {
      setIsloading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIssubmitloading(true);
    if (!stripe || !elements) {
      return;
    }
    try {
      const { data } = await addCard();
      const cardNumberElement = elements.getElement(CardNumberElement);
      const { paymentMethod, error: pmError } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumberElement,
        billing_details: {
          name: cardholderName,
        },
      });

      if (pmError) {
        console.error(pmError);
        setErrorMessage("Failed to create payment method: " + pmError.message);
        setShowErrorModal(true);
        return;
      }

      const { setupIntent, error: setupError } = await stripe.confirmCardSetup(data.info.client_secret, {
        payment_method: paymentMethod.id,
      });

      if (setupError) {
        console.error(setupError);
        setErrorMessage("Failed to set up card: " + setupError.message);
        setShowErrorModal(true);
        return;
      }

      const last4 = paymentMethod.card.last4;
      const expiryMonth = String(paymentMethod.card.exp_month).padStart(2, "0");
      const expiryYear = String(paymentMethod.card.exp_year);
      const cardTypeFinal = paymentMethod.card.brand;
      const res = await saveCard({
        paymentMethodId: paymentMethod.id,
        last4: last4,
        cardholderName: cardholderName,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        cardType: cardTypeFinal,
      });

      if (res.status === 200) {
        setSuccessMessage("Card saved successfully");
        setShowSuccessModal(true);
        setCardform(false);
        elements.getElement(CardNumberElement).clear();
        elements.getElement(CardExpiryElement).clear();
        elements.getElement(CardCvcElement).clear();
        setCardholderName("");
        // setCardType("");
        fetchCard();
      } else {
        setErrorMessage("Failed to save card");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to create card: " + error.message);
      setShowErrorModal(true);
    } finally {
      setIssubmitloading(false);
    }
  };

  const elementStyles = {
    base: {
      fontSize: "14px",
      fontWeight: "500",
      color: "var(--color1)",
      "::placeholder": {
        color: "var(--color1)",
        fontWeight: "500",
        fontSize: "14px",
      },
    },
    invalid: {
      color: "#9e2146",
    },
  };

  useEffect(() => {
    fetchCard();
  }, []);

  return (
    <>
      {isloading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <div className="managecard-container">
          <span className="managecard-title zen-dots">Manage Card</span>
          <Row>
            {cardList.length === 0 ? (
              <Col xl={12} lg={12} md={12} className="managecard-card-container">
                <div className="managecard-card-right">
                  <span className="managecard-card-title k2d">No card found</span>
                </div>
              </Col>
            ) : (
              cardList.map((card) => (
                <Col xl={12} lg={12} md={12} className="managecard-card-container">
                  <div className="managecard-card-right">
                    {card.cardType === "visa" && <VisaCardIcon />}
                    {card.cardType === "mastercard" && <MasterCardIcon />}
                    {card.cardType !== "visa" && card.cardType !== "mastercard" && <CardIcon className="CardIcon" />}
                    <div className="d-flex flex-column ps-3">
                      <span className="managecard-card-title k2d">xxxx xxxx xxxx {card.last4}</span>
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
          </Row>
          {cardform ? (
            <div className="managecard-card-button-container">
              <Form className="row" onSubmit={handleSubmit}>
                {/* Form fields remain the same */}
                <Col xl={12} lg={12} md={12}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Control
                      required
                      type="text"
                      onChange={(e) => setCardholderName(e.target.value)}
                      placeholder="Card Name"
                      className="payment-page-form-input"
                    />
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <CardNumberElement
                      className="payment-page-form-input k2d"
                      options={{
                        style: elementStyles,
                        placeholder: "Card Number",
                      }}
                      onChange={handleCardNumberChange}
                    />
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <CardExpiryElement
                      options={{ style: elementStyles, placeholder: "Expire" }}
                      className="payment-page-form-input"
                    />
                  </Form.Group>
                </Col>
                <Col xl={6} lg={6} md={6}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <CardCvcElement
                      options={{ style: elementStyles, placeholder: "CVV" }}
                      className="payment-page-form-input"
                    />
                  </Form.Group>
                </Col>
                <Col xl={12} lg={12} md={12} className="d-flex justify-content-center">
                  <button className="payment-page-btn btn-4 zen-dots" disabled={issubmitloading}>
                    {issubmitloading ? "Saving..." : "Save"}
                  </button>
                </Col>
              </Form>
            </div>
          ) : (
            <div
              className="managecard-card-button-container"
              onClick={() => setCardform(true)}
              style={{ cursor: "pointer" }}
            >
              + Add New Card
            </div>
          )}
        </div>
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

export default Managecard;
