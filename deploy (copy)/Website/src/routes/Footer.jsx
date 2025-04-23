import { Container, Row, Col } from "react-bootstrap";
import "./Footer.css";
import { useSelector } from "react-redux";
import { FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon, DeshlineIcon } from "../assets/icon/icons";
import { getBusinessHour } from "../API/Api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const Footer = () => {
  const navigate = useNavigate();
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const [businessHour, setBusinessHour] = useState([]);
  const fetchBusinessHour = async () => {
    try {
      const response = await getBusinessHour();
      if (response.data.status === 200) {
        setBusinessHour(response.data.info);
      }
    } catch (error) {
      console.error("Error fetching business hour:", error);
    }
  };
  useEffect(() => {
    fetchBusinessHour();
  }, []);

  return (
    <div className="Footer">
      <Container>
        <Row className="footer-row">
          <Col className="footer-col1" xs={12} md={6} lg={5}>
            <div>
              {appSetting && <img src={appSetting?.footerlogo} alt="logo" style={{ width: "auto", height: "auto" }} />}
            </div>
            <div className="footer-text-div">
              <span className="footer-text">
                Thank you for visiting us. We are committed to providing exceptional service and value to our customers.
              </span>
            </div>
            <div className="footer-social-icons-div">
              <div className="footer-social-icon-item" onClick={() => window.open(appSetting?.facebook, "_blank")}>
                <FacebookIcon className="social-icon" />
              </div>
              <div className="footer-social-icon-item" onClick={() => window.open(appSetting?.instagram, "_blank")}>
                <InstagramIcon className="social-icon" />
              </div>
              <div className="footer-social-icon-item" onClick={() => window.open(appSetting?.twitter, "_blank")}>
                <TwitterIcon className="social-icon" />
              </div>
              <div className="footer-social-icon-item" onClick={() => window.open(appSetting?.youtube, "_blank")}>
                <YoutubeIcon className="social-icon" />
              </div>
            </div>
          </Col>
          <Col className="footer-col2" xs={12} md={6} lg={4}>
            <span className="footer-col2-title">Business Hour</span>
            <div className="d-flex  gap-3">
              <div className="footer-col2-text-div d-flex flex-column gap-2">
                {businessHour.map((item, index) => (
                  <div className="d-flex gap-2 align-items-center">
                    <DeshlineIcon className="deshline-icon" /> <span className="footer-text-hour">{item.day}</span>
                  </div>
                ))}
              </div>
              <div className="footer-col2-text-div d-flex flex-column gap-2">
                {businessHour.map((item, index) =>
                  item.is_closed ? (
                    <span className="footer-text-hour">Closed</span>
                  ) : (
                    <span className="footer-text-hour">
                      {dayjs("09:00", "HH:mm").format("h:mm A")} - {dayjs(item.close, "HH:mm").format("h:mm A")}
                    </span>
                  )
                )}
                {/* <span className="footer-text-hour">9:00 AM - 5:00 PM</span>
                        <span className="footer-text-hour">10:00 AM - 2:00 PM</span>
                        <span className="footer-text-hour">Closed</span> */}
              </div>
            </div>
          </Col>
          <Col className="footer-col3" xs={12} md={6} lg={3}>
            <div className="footer-col3-div">
              <span className="footer-col3-title">Quick Links</span>
              <div className="footer-col3-links-div">
                <div className="d-flex gap-2 align-items-center">
                  <DeshlineIcon className="deshline-icon" />{" "}
                  <span className="footer-col3-link no-select" onClick={() => navigate("/")}>
                    Home
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <DeshlineIcon className="deshline-icon" />{" "}
                  <span className="footer-col3-link no-select" onClick={() => navigate("/services")}>
                    Services
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <DeshlineIcon className="deshline-icon" />{" "}
                  <span className="footer-col3-link no-select" onClick={() => navigate("/booking/service")}>
                    Booking
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <DeshlineIcon className="deshline-icon" />{" "}
                  <span className="footer-col3-link no-select" onClick={() => navigate("/blog")}>
                    Blog
                  </span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <DeshlineIcon className="deshline-icon" />{" "}
                  <span className="footer-col3-link no-select" onClick={() => navigate("/contact")}>
                    Contact Us
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      <Row className="footer-brack-div w-100 m-0">
        <Col className="d-flex justify-content-center align-items-center p-0">
          <span className="footer-copyright text-center">{appSetting?.copyright}</span>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
