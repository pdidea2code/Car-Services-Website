import { useParams, useNavigate } from "react-router-dom";
import { getServiceById, getAllService } from "../../API/Api";
import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import "./servicedetail.css";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import Showcase from "../../components/showcase/Showcase";
import {
  WalletIcon,
  ClockIcon,
  CarIcon,
  RoundedCheckIcon,
  UpRightArrowIconinhomepage,
} from "../../assets/icon/icons";
import AOS from "aos";
import "aos/dist/aos.css";
const Servicedetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const [allService, setAllService] = useState([]);
  const navigate = useNavigate();
  const nav = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Services",
      path: "/services",
    },
    {
      title: service?.name,
      path: `/services/${service?._id}`,
    },
  ];

  const fetchServiceById = async () => {
    setIsLoading(true);
    try {
      const request = {
        id: id,
      };
      const response = await getServiceById(request);
      if (response.data.status === 200) {
        setService(response.data.info);
      }
    } catch (error) {
      console.error(error);
      navigate("/services");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllService = async () => {
    try {
      setIsLoading(true);
      const response = await getAllService();
      if (response.data.status === 200) {
        setAllService(response.data.info);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceById();
    fetchAllService();
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [service]);
  return (
    <>
      <div className="service-detail-page">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <Spinner animation="border" style={{ color: "var(--color2)" }} />
          </div>
        ) : (
          <>
            <Header title={service?.name} navigation={nav} />
            <Container>
              <Row className="service-detail-row1" data-aos="fade-up">
                <span className="service-detail-title zen-dots">
                  {service?.name}
                </span>
              </Row>
              <Row className="service-detail-row2">
                <Col lg={true} className="service-detail-col1">
                  <img
                    src={service?.image}
                    alt={service?.name}
                    className="service-detail-image"
                    data-aos="fade-up"
                  />
                  <span
                    className="service-detail-title zen-dots"
                    data-aos="fade-up"
                  >
                    {service?.title}
                  </span>
                  <span
                    className="service-detail-description k2d"
                    data-aos="fade-up"
                  >
                    {service?.description}
                  </span>
                  <div
                    className="service-detail-price-duration"
                    data-aos="fade-up"
                  >
                    <div className="service-detail-item zen-dots">
                      <WalletIcon className="WalletIcon" />
                      <span>
                        {appSetting?.currency_symbol}
                        {service?.price}
                      </span>
                    </div>
                    <div className="service-detail-item zen-dots">
                      <ClockIcon className="ClockIcon" />
                      <span>{service?.time}min</span>
                    </div>
                  </div>
                  {service?.include?.length > 0 && (
                    <div className="service-detail-includes" data-aos="fade-up">
                      <span className="service-detail-includes-title zen-dots">
                        This Package Includes:
                      </span>
                      <Row
                        xl={2}
                        lg={2}
                        md={1}
                        className="service-detail-includes-row"
                      >
                        {service.include.map((item, index) => (
                          <Col
                            md={true}
                            className="service-detail-includes-item-col"
                          >
                            <CarIcon className="CarIcon" />
                            <span className="service-detail-includes-item k2d">
                              {item}
                            </span>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  <span
                    className="service-detail-WhyChoose-title zen-dots"
                    data-aos="fade-up"
                  >
                    {service?.whyChooseqTitle}
                  </span>
                  <span
                    className="service-detail-WhyChoose-description k2d"
                    data-aos="fade-up"
                  >
                    {service?.whyChooseqDescription}
                  </span>
                  <Row className="service-detail-WhyChoose-row">
                    <Col xl={6} lg={true} data-aos="fade-up">
                      <img
                        src={service?.whyChooseqImage}
                        alt={service?.whyChooseqTitle}
                        className="service-detail-WhyChoose-image"
                      />
                    </Col>
                    <Col xl={6} lg={true} data-aos="fade-up">
                      {service?.whyChooseqinclude?.length > 0 &&
                        service?.whyChooseqinclude?.map((item, index) => (
                          <div className="service-detail-WhyChoose-item">
                            <RoundedCheckIcon className="RoundedCheckIcon" />
                            <span className="service-detail-WhyChoose-item-text k2d">
                              {item}
                            </span>
                          </div>
                        ))}
                    </Col>
                  </Row>
                  <div
                    className="service-detail-booking-row"
                    data-aos="fade-up"
                  >
                    <div
                      style={{
                        WebkitMaskImage: `url("${service?.iconimage}")`,
                        maskImage: `url("${service?.iconimage}")`,
                      }}
                      className="service-detail-booking-item1"
                    ></div>
                    <div className="service-detail-booking-item2">
                      <span className="service-detail-booking-item-title zen-dots">
                        Schedule an Appointment
                      </span>
                      <span className="service-detail-booking-item-description k2d">
                        Call for more details or scheduale an appointmnet
                      </span>
                    </div>
                    <div className="service-detail-booking-item3">
                      <button
                        className="service-detail-booking-button btn-4 zen-dots"
                        onClick={() => {
                          navigate("/booking/service", {
                            state: {
                              serviceid: service?._id,
                              servicename: service?.name,
                              serviceprice: service?.price,
                              servicetime: service?.time,
                            },
                          });
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </Col>

                <Col
                  lg={true}
                  className="service-detail-col2"
                  data-aos="fade-up"
                >
                  {allService?.length > 0 &&
                    allService?.slice(0, 15).map((item, index) => (
                      <div
                        className={`service-detail-col2-row1 ${
                          item?._id === service?._id ? "active" : ""
                        }`}
                        onClick={() => {
                          navigate(`/services/${item?._id}`);
                        }}
                      >
                        <span
                          className={`service-detail-col2-row1-title zen-dots ${
                            item?._id === service?._id ? "active" : ""
                          }`}
                        >
                          {item?.name}
                        </span>
                        <UpRightArrowIconinhomepage
                          className={`UpRightArrowIconinhomepageblack ${
                            item?._id === service?._id ? "active" : ""
                          }`}
                        />
                      </div>
                    ))}
                </Col>
              </Row>
            </Container>
          </>
        )}
      </div>
      <Showcase />
    </>
  );
};

export default Servicedetail;
