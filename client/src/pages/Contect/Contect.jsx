import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Container, Row, Col, Spinner, Form } from "react-bootstrap";
import "./contect.css";
import { LocationIcon, MailIcon, PhoneIcon } from "../../assets/icon/icons";
import Showcase from "../../components/showcase/Showcase";
import { getAddress, addContent } from "../../API/Api";
import { useForm } from "react-hook-form";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import Faq from "../Homepage/Faq";
const Contect = () => {
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addContentLoading, setAddContentLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const nav = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Contact Us",
      path: "/contact",
    },
  ];

  const handleMouseOver = (item) => {
    setSelectedMarker(item);
  };

  const handleMouseOut = () => {
    setSelectedMarker(null);
  };

  const fetchaddress = async () => {
    try {
      setLoading(true);
      const response = await getAddress();
      if (response.status === 200) {
        setAddress(response.data.info);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: appSetting?.googleMapApiKey, // Replace with your API key
  });

  const onSubmit = async (data) => {
    try {
      setAddContentLoading(true);
      setSuccess("");
      const response = await addContent(data);
      if (response.status === 200) {
        setSuccess("Message sent successfully");
        reset();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddContentLoading(false);
    }
  };
  useEffect(() => {
    fetchaddress();
  }, []);

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [loading, isLoaded]);

  if (!isLoaded)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <Spinner style={{ color: "var(--color2)" }} />
      </div>
    );
  return (
    <div style={{ backgroundColor: "var(--color3)" }}>
      <Header title="Contact Us" navigation={nav} />
      <Container>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Spinner style={{ color: "var(--color2)" }} />
          </div>
        ) : (
          <>
            <Row className="contact-us-row">
              <Col
                xl={{ span: 6, order: 1 }}
                lg={{ span: 6, order: 1 }}
                md={{ span: 12, order: 2 }}
                sm={{ span: 12, order: 2 }}
                xs={{ span: 12, order: 2 }}
                className="contact-us-col1"
                data-aos="fade-right"
                data-aos-delay="100"
              >
                <Row>
                  {address.map((item) => (
                    <Col xl={6} lg={6} md={12} sm={12} className="">
                      <div className="contact-us-col1-address">
                        <span className="contact-us-col1-address-title zen-dots">
                          {item.city}
                        </span>
                        <div
                          className="d-flex mt-3"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.open(
                              `https://www.google.com/maps?q=${item?.latitude},${item?.longitude}&z=15&output=embed`,
                              "_blank"
                            );
                          }}
                        >
                          <div className="d-flex">
                            <LocationIcon className="LocationIcon" />
                          </div>
                          <p className="contact-us-col1-address-text k2d">
                            {item.address}, {item.zipCode}, {item.country}
                          </p>
                        </div>
                        <div
                          className="d-flex"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.open(`mailto:${item.email}`, "_blank");
                          }}
                        >
                          <div className="d-flex">
                            <MailIcon className="MailIcon" />
                          </div>
                          <p className="contact-us-col1-address-text k2d">
                            {item.email}
                          </p>
                        </div>
                        <div
                          className="d-flex"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.open(`tel:${item.phone}`, "_blank");
                          }}
                        >
                          <div className="d-flex">
                            <PhoneIcon className="PhoneIcon" />
                          </div>
                          <p className="contact-us-col1-address-text k2d">
                            {item.phone}
                          </p>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Col>
              <Col
                xl={{ span: 6, order: 2 }}
                lg={{ span: 6, order: 2 }}
                md={{ span: 12, order: 1 }}
                sm={{ span: 12, order: 1 }}
                xs={{ span: 12, order: 1 }}
                data-aos="fade-left"
                data-aos-delay="100"
                className="contact-us-col2"
              >
                {/* <LoadScript googleMapsApiKey={appSetting?.googleMapApiKey}> */}
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={{
                    lat: 36.142223, // Default center (San Francisco)
                    lng: -115.17417,
                  }}
                  zoom={15}
                >
                  {address.map((item) => (
                    <Marker
                      key={item.id}
                      position={{
                        lat: item.latitude,
                        lng: item.longitude,
                      }}
                      onClick={() => setSelectedMarker(item)}
                    />
                  ))}
                  {selectedMarker && (
                    <InfoWindow
                      position={{
                        lat: selectedMarker.latitude,
                        lng: selectedMarker.longitude,
                      }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div>
                        <span
                          className="k2d"
                          style={{ color: "var(--color1)" }}
                        >
                          {selectedMarker.address}, {selectedMarker.zipCode},
                          {selectedMarker.country}
                        </span>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
                {/* </LoadScript> */}
              </Col>
            </Row>
            <div
              className="contact-us-row2"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="contact-us-form-container">
                <span className="contact-us-form-container-title zen-dots">
                  Send Message
                </span>
                <Form
                  className="row contact-us-form "
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Col xs={6} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Control
                        className="contact-us-form-input"
                        type="text"
                        placeholder="Your Name"
                        {...register("name", { required: "Name is required" })}
                      />
                      {errors.name && (
                        <p className="text-danger k2d">{errors.name.message}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={6} sm={6} className="mb-3">
                    <Form.Group>
                      <Form.Control
                        className="contact-us-form-input"
                        type="email"
                        placeholder="Your Email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                      {errors.email && (
                        <p className="text-danger k2d">
                          {errors.email.message}
                        </p>
                      )}
                    </Form.Group>
                  </Col>

                  <Col xs={12} sm={12}>
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        className="contact-us-form-input"
                        type="text"
                        rows={3}
                        placeholder="Your Message"
                        {...register("message", {
                          required: "Message is required",
                        })}
                      />
                      {errors.message && (
                        <p className="text-danger k2d">
                          {errors.message.message}
                        </p>
                      )}
                    </Form.Group>
                  </Col>
                  {success && (
                    <Col
                      xs={12}
                      sm={12}
                      className="d-flex justify-content-center "
                    >
                      <p className="text-white k2d">{success}</p>
                    </Col>
                  )}
                  <Col
                    xs={12}
                    sm={12}
                    className="d-flex justify-content-center "
                    disabled={addContentLoading}
                  >
                    <button
                      className="contact-us-form-button zen-dots btn-4"
                      disabled={addContentLoading}
                    >
                      {addContentLoading ? "Sending..." : "Send"}
                    </button>
                  </Col>
                </Form>
              </div>
            </div>
          </>
        )}
      </Container>
      <Faq />
      <Showcase />
    </div>
  );
};

export default Contect;
