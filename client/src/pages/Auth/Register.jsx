import "./register.css";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { EyeIcon, EyeSlashIcon } from "../../assets/icon/icons";
import { useForm } from "react-hook-form";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { RegisterApi, VerifyEmailApi } from "../../API/Api";
import { useDispatch } from "react-redux";
import { SET_LOGIN } from "../../redux/action/action";
import Cookies from "js-cookie";
import AOS from "aos";
import "aos/dist/aos.css";
const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();
  const [isOtp, setIsOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [registerData, setRegisterData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    let timer;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setIsLoading(false);
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const request = {
        email: data.email,
        name: data.fullName,
        password: data.password,
        confpassword: data.confirmPassword,
      };
      const response = await RegisterApi(request);
      if (response.status === 200) {
        setOtpError("");
        setIsOtp(true);

        setRegisterData(data);
        setOtpCountdown(60);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setRegisterError(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      const request = {
        email: registerData.email,
        otp: otp,
      };
      const response = await VerifyEmailApi(request);
      if (response.status === 200) {
        setOtpError("");
        setOtpCountdown(0);
        setIsLoading(false);
        setOtp("");

        dispatch({
          type: SET_LOGIN,
          payload: response.data.info.user,
        });
        Cookies.set("token", response.data.info.token);
        Cookies.set("refreshToken", response.data.info.refreshToken);
        Cookies.set("user", JSON.stringify(response.data.info.user));
        Cookies.set("isLoggedIn", true);
        navigate("/");
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setOtpError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, []);
  return (
    <div className="register-page">
      <Container className="d-flex justify-content-center align-items-center">
        {isOtp ? (
          <div
            className={`register-page-container ${
              isOtp ? "align-items-center" : ""
            }`}
          >
            <span className="register-page-title zen-dots" data-aos="fade-up">
              Verify Your Identity
            </span>
            <span
              className="register-page-description k2d"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Enter The 4-Digit OTP Sent To Your Registered Email ID To Proceed.
            </span>
            <Form className="otp-verify-form">
              <Input.OTP
                className="register-page-form-input k2d"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e)}
                variant="filled"
                length={4}
                type="number"
              />

              {otpError !== "" && (
                <p className="text-danger k2d" style={{ marginTop: "10px" }}>
                  {otpError}
                </p>
              )}
            </Form>
            {otpCountdown > 0 && (
              <span className="otp-countdown k2d">
                {formatTime(otpCountdown)}
              </span>
            )}
            <div className="d-flex justify-content-center flex-column align-items-center ">
              <button
                // data-aos="fade-up"
                // data-aos-delay="300"
                className="otp-verify-button zen-dots btn-4"
                onClick={handleVerifyOtp}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner
                    animation="border"
                    role="status"
                    style={{ color: "var(--color3)" }}
                  />
                ) : (
                  "Verify"
                )}
              </button>
              <span
                className="register-page-form-button-text k2d"
                // data-aos="fade-up"
                // data-aos-delay="400"
              >
                If You Don’t Receive Code?{" "}
                <span
                  className="register-page-form-button-text-link"
                  onClick={() => onSubmit(registerData)}
                >
                  Resend OTP
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="register-page-container">
            <span
              className="register-page-title zen-dots"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Create Your Account
            </span>
            <span
              className="register-page-description k2d"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Please Enter Your Details
            </span>

            <Form
              className="row register-page-form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Col lg={6} xs={6} data-aos="fade-right" data-aos-delay="200">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Full Name*"
                    className="register-page-form-input k2d"
                    {...register("fullName", {
                      required: "Full Name is required",
                    })}
                  />
                  {errors.fullName && (
                    <p className="text-danger k2d">{errors.fullName.message}</p>
                  )}
                </Form.Group>
              </Col>
              <Col lg={6} xs={6} data-aos="fade-left" data-aos-delay="200">
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Email ID*"
                    className="register-page-form-input k2d"
                    {...register("email", {
                      required: "Email is required",
                    })}
                    autoComplete="off"
                  />
                  {errors.email && (
                    <p className="text-danger k2d">{errors.email.message}</p>
                  )}
                </Form.Group>
              </Col>
              <Col lg={12} xs={12} data-aos="fade-up" data-aos-delay="300">
                <Form.Group className="position-relative mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password*"
                      className="register-page-form-input k2d"
                      {...register("password", {
                        required: "Password is required",

                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          message:
                            "Password must contain at least 8 characters, \n1 uppercase letter, \n1 lowercase letter, \n1 number,  \n1 special character",
                        },
                      })}
                      autoComplete="off"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="register-page-form-input-icon"
                    >
                      {showPassword ? (
                        <EyeIcon className="EyeIcon" />
                      ) : (
                        <EyeSlashIcon className="EyeSlashIcon" />
                      )}
                    </span>
                  </InputGroup>
                  {errors.password && (
                    <div className="text-danger k2d">
                      {errors.password.message
                        .split("\n")
                        .map((line, index) => (
                          <p key={index} className="mb-1">
                            {line}
                          </p>
                        ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col lg={12} xs={12} data-aos="fade-up" data-aos-delay="400">
                <Form.Group className="position-relative mb-3">
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password*"
                      className="register-page-form-input k2d"
                      {...register("confirmPassword", {
                        required: "Confirm Password is required",
                        validate: (value) => {
                          if (value !== getValues("password")) {
                            return "Passwords do not match";
                          }
                        },
                      })}
                      autoComplete="off"
                    />
                    <span
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="register-page-form-input-icon"
                    >
                      {showConfirmPassword ? (
                        <EyeIcon className="EyeIcon" />
                      ) : (
                        <EyeSlashIcon className="EyeSlashIcon" />
                      )}
                    </span>
                  </InputGroup>
                  {errors.confirmPassword && (
                    <p className="text-danger k2d">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </Form.Group>
              </Col>
              {registerError !== "" && (
                <p className="text-danger k2d">{registerError}</p>
              )}
              <Col
                lg={12}
                xs={12}
                data-aos="fade-up"
                data-aos-delay="500"
                className="d-flex justify-content-center flex-column align-items-center"
              >
                <button
                  className="register-page-form-button zen-dots btn-4"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      animation="border"
                      role="status"
                      style={{ color: "var(--color3)" }}
                    />
                  ) : (
                    "Submit"
                  )}
                </button>
                <span className="register-page-form-button-text k2d">
                  Already have an account?{" "}
                  <span
                    className="register-page-form-button-text-link"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </span>
                </span>
              </Col>
            </Form>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Register;
