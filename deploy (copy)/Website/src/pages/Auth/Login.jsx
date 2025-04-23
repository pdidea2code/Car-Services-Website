import { Container, Form, InputGroup, Spinner } from "react-bootstrap";
import "./login.css";
import { EyeIcon, EyeSlashIcon, GoogleIcon } from "../../assets/icon/icons";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Cookies from "js-cookie";
import { LoginApi, GoogleLoginApi, SocialLoginApi } from "../../API/Api";
import { SET_LOGIN } from "../../redux/action/action";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError("");
      if (data.rememberMe === false) {
        Cookies.remove("rememberMe");
      }

      const loginData = {
        email: data.email,
        password: data.password,
      };

      const response = await LoginApi(loginData);
      if (response.status === 200) {
        if (data.rememberMe) {
          const rememberMe = {
            email: data.email,
            password: data.password,
            isRememberMe: true,
          };
          Cookies.set("rememberMe", JSON.stringify(rememberMe));
        }
        dispatch({
          type: SET_LOGIN,
          payload: response.data.info.user,
        });
        Cookies.set("token", response.data.info.token);
        Cookies.set("refreshToken", response.data.info.refreshToken);
        Cookies.set("user", JSON.stringify(response.data.info.user));
        Cookies.set("isLoggedIn", true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = async (tokenResponse) => {
    try {
      setIsLoading(true);
      setError("");
      const accessToken = tokenResponse.access_token;

      // Decode token to get user info
      const response = await GoogleLoginApi(accessToken);

      const req = {
        social_id: response.data.sub,
        email: response.data.email,
        name: response.data.name,
        image: response.data.picture,
      };

      const socialResponse = await SocialLoginApi(req);
      if (socialResponse.status === 200) {
        dispatch({
          type: SET_LOGIN,
          payload: socialResponse.data.info.user,
        });
        Cookies.set("token", socialResponse.data.info.token);
        Cookies.set("refreshToken", socialResponse.data.info.refreshToken);
        Cookies.set("user", JSON.stringify(socialResponse.data.info.user));
        Cookies.set("isLoggedIn", true);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLoginSuccess,
    onError: () => console.log("Login Failed"),
  });

  useEffect(() => {
    const rememberMe = Cookies.get("rememberMe");
    if (rememberMe) {
      const rememberMeData = JSON.parse(rememberMe);
      if (rememberMeData?.isRememberMe) {
        setValue("email", rememberMeData?.email);
        setValue("password", rememberMeData?.password);
        setValue("rememberMe", true);
      }
    }
  }, []);
  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, []);
  return (
    <div className="login-page-container">
      <Container className="d-flex justify-content-center align-items-center">
        <div className="login-page">
          <span
            className="login-page-title zen-dots"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Login Your Account
          </span>
          <span
            className="login-page-description k2d"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Please Enter Your Details To Login
          </span>
          <Form className="login-page-form" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group data-aos="zoom-in-up" data-aos-delay="300">
              <Form.Control
                type="email"
                placeholder="Email ID*"
                className="register-page-form-input k2d"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-danger k2d">{errors.email.message}</p>
              )}
            </Form.Group>
            <Form.Group data-aos="zoom-in-up" data-aos-delay="400">
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Password*"
                  className="register-page-form-input k2d"
                  {...register("password", {
                    required: "Password is required",
                  })}
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
                <p className="text-danger k2d">{errors.password.message}</p>
              )}
            </Form.Group>
            {error && <span className="text-danger k2d">{error}</span>}

            <Form.Group data-aos="fade-up" data-aos-delay="500">
              <InputGroup className="d-flex justify-content-between">
                <Form.Check
                  className="login-remember k2d"
                  type="checkbox"
                  label="Remember me"
                  {...register("rememberMe")}
                />
                <span
                  className="login-forgot-password k2d"
                  onClick={() => navigate("/forgotpassword")}
                >
                  Forgot Password?
                </span>
              </InputGroup>
            </Form.Group>
            <div className="login-page-google-button-container">
              <button
                type="button"
                className=" btn-4 login-page-google-button zen-dots"
                data-aos="fade-up"
                data-aos-delay="600"
                onClick={() => login()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner
                    animation="border"
                    style={{ color: "var(--color3)" }}
                  />
                ) : (
                  <>
                    <GoogleIcon />
                    Google
                  </>
                )}
              </button>
              <button
                type="submit"
                className=" btn-4 login-button-or zen-dots"
                data-aos="fade-up"
                data-aos-delay="700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Spinner
                    animation="border"
                    style={{ color: "var(--color3)" }}
                  />
                ) : (
                  "Login"
                )}
              </button>
              <span
                className="login-button-or-text k2d"
                data-aos="fade-up"
                data-aos-delay="800"
              >
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/register")}
                  className="login-page-register-link k2d"
                >
                  Register
                </span>
              </span>
            </div>
          </Form>
        </div>
      </Container>
    </div>
  );
};

export default Login;
