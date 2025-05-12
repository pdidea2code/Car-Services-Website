import { Row, Col, Container } from "react-bootstrap";
import "./offer.css";
import { useSelector } from "react-redux";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import BlurText from "../../components/BlurText";
import offerimg1 from "../../assets/image/offerimg1.png";
import { useNavigate } from "react-router-dom";
const Offer = () => {
  const theme = useSelector((state) => state.theme.theme);
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, []);
  return (
    <Container fluid>
      <Row>
        <Col xl={6} lg={12} md={12} className="offer-container-left" data-aos="fade-up">
          {/* <Container> */}
          <div className="offer-container-left1">
            <div className="offer-container-left1-title">
              <BlurText delay={10} className="offer-container-left1-title-text zen-dots" text="Get 20% Offer" />

              <BlurText
                delay={20}
                className="offer-container-left1-title-text2 zen-dots"
                text="Limited Time Discount"
              />
              <BlurText
                delay={30}
                className="offer-container-left1-title-text3 k2d"
                text="Take Advantage Of Our Exclusive Offer And Save 20% On Your Booking Service, But Hurry – This Limited-Time Discount Won't Last Long!"
              />
              <button
                onClick={() => {
                  navigate("/booking/service");
                }}
                className="offer-container-left1-button btn-3 zen-dots"
                data-aos="fade-up"
              >
                Book Now
              </button>
            </div>
          </div>
          <div className="offer-container-left2">
            <img src={theme?.springimage} alt="offer" className="offer-container-left2-image" data-aos="fade-up" />
          </div>
          {/* </Container> */}
        </Col>
        <Col xl={6} lg={12} md={12} className="offer-container-rigth" data-aos="fade-up">
          {/* <Container> */}
          <div className="offer-container-rigth1">
            <BlurText delay={10} className="offer-title zen-dots" text="Special Savings Event" />
            <BlurText
              delay={20}
              className="offer-title2 k2d"
              text="Unlock A Fantastic 15% Discount On All Booking Today – Grab The Deal Before It Expires!"
            />
            <button
              onClick={() => {
                navigate("/booking/service");
              }}
              className="offer-container-rigth1-button btn-4 zen-dots"
              data-aos="fade-up"
            >
              Book Now
            </button>
          </div>
          <div className="offer-container-rigth2">
            <img src={offerimg1} alt="offer" className="offer-container-rigth2-image" data-aos="fade-up" />
          </div>
          {/* </Container> */}
        </Col>
      </Row>
    </Container>
  );
};

export default Offer;
