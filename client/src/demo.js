import React, { useState, useEffect } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";

const Payment = () => {
  const [cards, setCards] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [amount, setAmount] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/cards`,
          {
            params: { userId: "testUser" },
          }
        );
        setCards(res.data);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    const fetchPayments = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments`,
          {
            params: { userId: "testUser" },
          }
        );
        setPayments(res.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchCards();
    fetchPayments();
  }, []);

  const getCardIcon = (type) => {
    switch (type.toLowerCase()) {
      case "visa":
        return (
          <FaCcVisa style={{ marginLeft: "5px", verticalAlign: "middle" }} />
        );
      case "mastercard":
        return (
          <FaCcMastercard
            style={{ marginLeft: "5px", verticalAlign: "middle" }}
          />
        );
      case "amex":
        return (
          <FaCcAmex style={{ marginLeft: "5px", verticalAlign: "middle" }} />
        );
      case "discover":
        return (
          <FaCcDiscover
            style={{ marginLeft: "5px", verticalAlign: "middle" }}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/payment`,
        {
          userId: "testUser",
          cardId: selectedCard || null,
          amount: parseFloat(amount),
        }
      );

      console.log("PaymentIntent from backend:", data.paymentIntent);

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
        result = await stripe.confirmCardPayment(
          data.paymentIntent.client_secret,
          {
            payment_method: {
              card: elements.getElement(CardElement),
              billing_details: {
                name: "Test User",
              },
            },
          }
        );
      }

      if (result.error) {
        console.error("Stripe error:", result.error);
        alert("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        console.log("Payment successful:", result);
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/verify-payment`,
          {
            paymentId: data.payment._id,
            status: "completed",
          }
        );
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/payments`,
          {
            params: { userId: "testUser" },
          }
        );
        setPayments(res.data);
        alert("Payment successful!");
      }
    } catch (error) {
      console.error("Payment error:", error);
      const errorMessage = error.response?.data?.error || error.message;
      alert("Payment failed: " + errorMessage);
    }
  };

  const handleRefund = async (paymentId) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/refund`,
        {
          paymentId,
        }
      );
      console.log("Refund successful:", data);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/payments`,
        {
          params: { userId: "testUser" },
        }
      );
      setPayments(res.data);
      alert("Refund processed successfully!");
    } catch (error) {
      console.error("Refund error:", error);
      const errorMessage = error.response?.data?.error || error.message;
      alert("Refund failed: " + errorMessage);
    }
  };

  return (
    <div>
      <h2>Make Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Select Card:
          <select
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
          >
            <option value="">Use New Card</option>
            {cards.map((card) => (
              <option key={card._id} value={card._id}>
                {card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)}{" "}
                ending in {card.last4} ({card.cardholderName}){" "}
                {getCardIcon(card.cardType)}
              </option>
            ))}
          </select>
        </label>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        {!selectedCard && (
          <div style={{ margin: "20px 0" }}>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        )}

        <button type="submit" disabled={!stripe}>
          Pay
        </button>
      </form>

      <h2>Payment History</h2>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
      >
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Amount</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Card</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment._id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                ${payment.amount}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.cardId
                  ? `${payment.cardId.cardholderName} (${
                      payment.cardId.cardType.charAt(0).toUpperCase() +
                      payment.cardId.cardType.slice(1)
                    } ending in ${payment.cardId.last4}) `
                  : "New Card"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.status}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {new Date(payment.paymentDate).toLocaleString()}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {payment.status === "completed" && (
                  <button onClick={() => handleRefund(payment._id)}>
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payment;
