import { Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";

import "./excellence.css";
import excellence1 from "../../assets/image/excellence1.jpeg";
import excellence2 from "../../assets/image/excellence2.png";
import car from "../../assets/image/car.png";
import ScrollReveal from "../../components/ScrollReveal";
import Fade from "../../components/animation";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
const Excellence = () => {
  const [scrollDir, setScrollDir] = useState("down");
  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 425;
      },
    });
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDir(currentScrollY > lastScrollY ? "down" : "up");
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div className="excellence">
      <Container>
        <Row>
          <Col xs={12} md={12} className="text-center">
            <Fade>
              <span className="excellence-title zen-dots">
                Excellence Begins Here!
              </span>
            </Fade>
          </Col>
          <Col xs={12} md={12} className="text-center">
            <ScrollReveal>
              <span className="excellence-description zen-dots">
                Your Satisfaction Is Our Priority—We’re Dedicated To Providing{" "}
                <span className="excellence-description-span">
                  Exceptional Service
                </span>{" "}
                With Complete Transparency, Ensuring You're Informed About
                Repairs And{" "}
                <img
                  src={excellence1}
                  alt="excellence1"
                  className="excellence1"
                />
                Maintenance To Extend{" "}
                <span className="excellence-description-span">Your</span>{" "}
                <img
                  src={excellence2}
                  alt="excellence2"
                  className="excellence2"
                />{" "}
                Vehicle's Longevity.
              </span>
            </ScrollReveal>
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            md={12}
            className="car-image-container"
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="100"
          >
            <img src={car} alt="excellence3" className="car-image" />
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Headlight
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Restore clarity and brightness with our professional
                    headlight repair service!
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay1 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Tyre Repair Service
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Drive with confidence on perfectly serviced tyres.
                    Experience smoother, safer rides with our expert repair and
                    replacement solutions!
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay2 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Crystal-Clear Vision
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Enhance safety with our expert side mirror repair and
                    replacement service. Drive confidently with a clear view of
                    the road!
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay3 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Door Care
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Keep your doors in pristine condition with our expert door
                    care service.
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay4 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Window Fix
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Expert side window repair and replacement services.Restore
                    clarity and security with professional care.
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay5 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Wheel Glow
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Stylish and durable car wheel ring services.Upgrade your
                    ride with premium wheel accents.
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay6 dot-optical"></div>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id="button-tooltip-2" className="tooltip-text">
                  <span className="tooltip-text-span-title zen-dots">
                    Rear View
                  </span>
                  <span className="tooltip-text-span-description k2d">
                    Expert back glass repair and replacement services. Ensure
                    clear visibility with professional installation.
                  </span>
                </Tooltip>
              }
            >
              <div className="car-image-overlay7 dot-optical"></div>
            </OverlayTrigger>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Excellence;
