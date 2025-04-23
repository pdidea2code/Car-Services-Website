import { useLocation } from "react-router-dom";
import Header from "../../../components/Header";
import backimage from "../../../assets/image/reviewbackgroung.jpeg";
import "./review.css";
import { useEffect, useState } from "react";
import { Container, Row, Form, Col, Modal, Button } from "react-bootstrap";
import Cookies from "js-cookie";
import Showcase from "../../../components/showcase/Showcase";
import { useForm } from "react-hook-form";
import AOS from "aos";
import "aos/dist/aos.css";
import { addReview } from "../../../API/Api";
import { useNavigate } from "react-router-dom";
import noprofile from "../../../assets/image/Profile.png";
const Review = () => {
  const { state } = useLocation();
  const user = Cookies.get("user")
    ? JSON.parse(Cookies.get("user"))
    : { image: noprofile };
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const request = {
        review: data.review,
        name: data.name,
        email: data.email,
        designation: data.designation,
        service_id: state.item.service_id._id,
        order_id: state.item._id,
      };
      const response = await addReview(request);
      if (response.status === 200) {
        reset();

        setShowSuccessModal(true);
      } else {
        setErrorMessage("Review not added");
        setShowErrorModal(true); // Show error modal
      }
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ||
          "An error occurred while submitting the review"
      );
      setShowErrorModal(true); // Show error modal
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nav = [
    { title: "Home", path: "/" },
    { title: "My Account", path: "/account" },
    { title: "Service History", path: "/account/servicehistory" },
    { title: "Review", path: "/account/servicehistory/review" },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [state]);

  // Handle closing of modals
  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    navigate("/account/servicehistory");
  };
  const handleCloseError = () => setShowErrorModal(false);

  return (
    <>
      <div>
        <Header title="Review" navigation={nav} />
      </div>
      <div
        className="review-background"
        style={{ backgroundImage: `url(${backimage})` }}
      >
        <Container>
          <Row className="text-center d-flex justify-content-center flex-column align-items-center">
            <span
              className="review-background-title zen-dots"
              data-aos="fade-up"
            >
              Leave your Review
            </span>
            <div data-aos="zoom-in">
              <img
                className="profile-image"
                src={user?.image ? user?.image : noprofile}
                alt="profile"
              />
            </div>

            <Col xs={12} md={12} sm={12} className="review-form-col">
              <Form className="row" onSubmit={handleSubmit(onSubmit)}>
                <Col xs={12} md={12} sm={12} data-aos="fade-up">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="review-form-input k2d"
                      placeholder="Your Name"
                      {...register("name", { required: "Name is required" })}
                    />
                    {errors.name && (
                      <p className="text-danger text-start k2d">
                        {errors.name.message}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} sm={6} data-aos="fade-right">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="review-form-input k2d"
                      placeholder="Your Email"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.email && (
                      <p className="text-danger text-start k2d">
                        {errors.email.message}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={6} md={6} sm={6} data-aos="fade-left">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      type="text"
                      className="review-form-input k2d"
                      placeholder="Designation"
                      {...register("designation", {
                        required: "Designation is required",
                      })}
                    />
                    {errors.designation && (
                      <p className="text-danger text-start k2d">
                        {errors.designation.message}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} sm={12} data-aos="fade-up">
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Control
                      as="textarea"
                      type="text"
                      placeholder="Review Text"
                      className="review-form-input k2d"
                      {...register("review", {
                        required: "Review is required",
                        minLength: {
                          value: 10,
                          message: "Review must be at least 10 characters",
                        },
                      })}
                      rows={4}
                    />
                    {errors.review && (
                      <p className="text-danger text-start k2d">
                        {errors.review.message}
                      </p>
                    )}
                  </Form.Group>
                </Col>
                <Col xs={12} md={12} sm={12} data-aos="fade-up">
                  <button
                    className="btn-4 payment-page-btn zen-dots"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit"}
                  </button>
                </Col>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccess} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>Review added successfully!</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccess}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={handleCloseError} centered>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseError}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Showcase />
    </>
  );
};

export default Review;
