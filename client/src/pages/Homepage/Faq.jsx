import { Container, Row, Col } from "react-bootstrap";
import "./faq.css";
import BlurText from "../../components/BlurText";
import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { RoundArrowIcon } from "../../assets/icon/icons";
import { getAllFaq } from "../../API/Api";
const Faq = () => {
  const [active, setActive] = useState(0);
  const [faq, setFaq] = useState([]);
  const handleClick = (id) => {
    setActive(id);
    if (id === active) {
      setActive("");
    }
  };
  const fetchFaq = async () => {
    try {
      const response = await getAllFaq();
      if (response.status === 200) {
        setFaq(response.data.info);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFaq();
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
    <div className="faq-container">
      <Container>
        <Row className="w-100">
          <Col className="d-flex flex-column justify-content-center align-items-center">
            <span className="faq-title zen-dots">Expert Insights</span>
            <span className="faq-title2 zen-dots">
              Frequently Asked Questions
            </span>
          </Col>
        </Row>
        <Row className="faq-row2">
          <Col className="d-flex justify-content-center align-items-center">
            <div className="accordion-items">
              {faq.map((item, index) => (
                <div
                  className={`accordion-item-div ${
                    active === index ? "active" : ""
                  }`}
                  onClick={() => handleClick(index)}
                >
                  <div className="accordion-item-div-inner">
                    <div
                      className={`accordion-item-header ${
                        active === index ? "active" : ""
                      }`}
                    >
                      <span className="zen-dots">{item.question}</span>
                    </div>
                    <div
                      className={`accordion-item-body ${
                        active === index ? "active" : ""
                      }`}
                    >
                      <span className="accordion-item-answer k2d">
                        {item.answer}
                      </span>
                    </div>
                  </div>
                  <div className="accordion-item-icon">
                    <div
                      className={`accordion-item-icon-div ${
                        active === index ? "active" : ""
                      }`}
                    >
                      <RoundArrowIcon
                        className={`RoundArrowIcon ${
                          active === index ? "active" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Faq;
