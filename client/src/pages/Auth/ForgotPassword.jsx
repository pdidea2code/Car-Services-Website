import { Container, Form, Col, InputGroup, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./forgotpassword.css";
import "./register.css";
import { Input } from "antd";
import { EyeIcon, EyeSlashIcon } from "../../assets/icon/icons";
import { useState, useEffect } from "react";
import {
  CheckEmailIdApi,
  VerifyOtpApi,
  ForgotPasswordApi,
} from "../../API/Api";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm();
  const [Selection, setSelection] = useState(1);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      setEmailError("");
      const request = {
        email: data.email,
      };
      const response = await CheckEmailIdApi(request);
      if (response.status === 200) {
        setEmailError("");
        setOtpCountdown(60);
        setSelection(2);
        setEmail(data.email);
      } else {
        setEmailError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setEmailError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitOtpVerify = async () => {
    try {
      setIsLoading(true);
      if (otp.length !== 4) {
        setOtpError("Please enter a valid OTP");
        return;
      }
      setOtpError("");
      const request = {
        email: email,
        otp: otp,
      };
      const response = await VerifyOtpApi(request);
      if (response.status === 200) {
        setOtpError("");
        setSelection(3);
      } else {
        setOtpError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setOtpError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmitResetPassword = async (data) => {
    try {
      setIsLoading(true);
      setPasswordError("");
      const request = {
        email: email,
        password: data.password,
        confpassword: data.confirmPassword,
        otp: otp,
      };
      const response = await ForgotPasswordApi(request);
      if (response.status === 200) {
        setPasswordError("");
        reset();
        setSelection(1);
        setEmail("");
        setOtp("");
        setPasswordError("");
        navigate("/login");
      } else {
        setPasswordError(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setPasswordError(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="forgot-password-page">
      <Container className="d-flex justify-content-center align-items-center">
        <div
          className={`forgot-password-container ${
            Selection === 2 ? "align-items-center" : ""
          }`}
        >
          {Selection === 1 && (
            <>
              <span className="forgot-password-title zen-dots">
                Forgot Password
              </span>
              <span className="forgot-password-description k2d">
                No Worries! Enter Your Email To Reset Your Password And Get Back
                On Track.
              </span>
              <Form
                className="forgot-password-form"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Form.Group className="forgot-password-form-group">
                  <Form.Control
                    className="register-page-form-input"
                    type="email"
                    placeholder="Email*"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-danger k2d">{errors.email.message}</p>
                  )}
                  {emailError !== "" && (
                    <p className="text-danger k2d">{emailError}</p>
                  )}
                  <div className="forgot-password-form-button-container">
                    <button
                      className="forgot-password-form-button btn-4 zen-dots"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner animation="border" role="status" />
                      ) : (
                        "Send Mail"
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Form>
            </>
          )}
          {Selection === 2 && (
            <>
              <span className="forgot-password-title zen-dots">
                Verify Your Identity
              </span>
              <span className="forgot-password-description k2d">
                Enter The 4-Digit OTP Sent To Your Registered Email To Proceed.
              </span>
              <Form className="otp-verify-form d-flex justify-content-center">
                <Input.OTP
                  className="register-page-form-input k2d"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e)}
                  variant="filled"
                  length={4}
                  type="number"
                />
              </Form>
              {otpError !== "" && (
                <p className="text-danger k2d" style={{ marginTop: "10px" }}>
                  {otpError}
                </p>
              )}
              {otpCountdown > 0 && (
                <span className="otp-countdown k2d">
                  {formatTime(otpCountdown)}
                </span>
              )}
              <div className="d-flex justify-content-center flex-column align-items-center ">
                <button
                  className="otp-verify-button zen-dots btn-4"
                  onClick={() => onSubmitOtpVerify()}
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
                <span className="register-page-form-button-text k2d">
                  If You Don’t Receive Code?{" "}
                  <span
                    className="register-page-form-button-text-link"
                    onClick={() =>
                      onSubmit({
                        email: email,
                      })
                    }
                  >
                    Resend OTP
                  </span>
                </span>
              </div>
            </>
          )}
          {Selection === 3 && (
            <>
              <span className="forgot-password-title zen-dots">
                Reset your password
              </span>
              <span className="forgot-password-description k2d">
                Create A Strong New Password To Secure Your Account.
              </span>
              <Form
                className="forgot-password-form"
                onSubmit={handleSubmit(onSubmitResetPassword)}
              >
                <Col lg={12} xs={12}>
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
                <Col lg={12} xs={12}>
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
                <div className="forgot-password-form-button-container">
                  <button
                    className="forgot-password-form-button btn-4 zen-dots"
                    type="submit"
                  >
                    Continue
                  </button>
                </div>
              </Form>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default ForgotPassword;
