import "./chooseus.css";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import BlurText  from "../../components/BlurText";
import { SafetyGuaranteeIcon, SkilledProfessionalsIcon, ClearPricingIcon, ClientAssistanceIcon } from "../../assets/icon/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import  tool from "../../assets/image/tool.png"
const ChooseUs = () => {
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    AOS.init({
        disable: function () {
            return window.innerWidth < 992;
          },
          disable: "mobile",
    });
  }, []);
  return (
    <div className="choose-us-container">
      <Container>

        <Row>
          <Col xl={4} lg={6} md={12} className="d-flex ">
            <div data-aos="fade-up" className="choose-us-title-container">
              <span className="choose-us-title zen-dots">Why Choose Us?</span>
              <BlurText delay={10} className="choose-us-title2 zen-dots" text="Experience Excellence With Our Unique Offerings" />
              <BlurText delay={20} className="choose-us-title3 k2d" text="Elevate Your Experience with Our Exclusive Products And Services, Designed To Meet The Highest Standards. Enjoy Unmatched Quality And Satisfaction With Every Offering." />
              <button className="choose-us-button btn-4 zen-dots">Contact US</button>
              
            </div>
          </Col>
            <Col xl={4} lg={6} md={12} className="">
              <div data-aos="fade-up" className="choose-us-image-container">
                <img
                  src={theme?.workingimage}
                  alt="choose us"
                  className="choose-us-image"
                />
              </div>
            </Col>
        
            <Col xl={4} lg={12} md={12} className="choose-us-points-container ">
            <Row className="choose-us-points-row">
            <Col xl={12} lg={6} md={12} className="choose-us-point" data-aos="fade-up">
                <div className="choose-us-point-icon">
                    <SafetyGuaranteeIcon className="SafetyGuaranteeIcon" />
                </div>
                <div className="choose-us-point-title">
                    <span className="choose-us-point-title-text k2d">
                    Safety Guarantee
                    </span>
                    <span className="choose-us-point-title-text2 k2d">
                    Your Safety Is Our Top Priority, Ensuring Peace Of Mind At All Times.
                    </span>
                </div>
            </Col>
            <Col xl={12} lg={6} md={12} className="choose-us-point" data-aos="fade-up" data-aos-delay="100">
                <div className="choose-us-point-icon">
                    <SkilledProfessionalsIcon className="SafetyGuaranteeIcon" />
                </div>
                <div className="choose-us-point-title">
                    <span className="choose-us-point-title-text k2d">
                    Skilled Professionals
                    </span>
                    <span className="choose-us-point-title-text2 k2d">
                    Expert Hands Delivering Exceptional Results With Precision And Care.
                    </span>
                </div>
            </Col>
            <Col xl={12} lg={6} md={12} className="choose-us-point" data-aos="fade-up" data-aos-delay="200">
                <div className="choose-us-point-icon">
                    <ClearPricingIcon className="SafetyGuaranteeIcon" />
                </div>
                <div className="choose-us-point-title">
                    <span className="choose-us-point-title-text k2d">
                    Clear Pricing
                    </span>
                    <span className="choose-us-point-title-text2 k2d">
                    Transparent Pricing With No Hidden Costs, Ensuring Complete Clarity.
                    </span>
                </div>
            </Col>
              <Col xl={12} lg={6} md={12} className="choose-us-point" data-aos="fade-up" data-aos-delay="300">
                <div className="choose-us-point-icon">
                    <ClientAssistanceIcon className="SafetyGuaranteeIcon" />
                </div>
                <div className="choose-us-point-title">
                    <span className="choose-us-point-title-text k2d">
                    Client Assistance
                    </span>
                    <span className="choose-us-point-title-text2 k2d">
                    Dedicated Support To Address Your Needs Promptly And Effectively.
                    </span>
                </div>
            </Col>
            </Row>
          </Col>
        </Row>
      </Container>
      <img aos="fade-up" data-aos-delay="300" src={tool} alt="choose us" className="choose-us-image-bottom" />
    </div>
  );
};
export default ChooseUs;
