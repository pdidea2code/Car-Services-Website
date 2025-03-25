import { Container, Row, Col } from "react-bootstrap";
import "./services.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import BlurText from "../../components/BlurText";
import { UpRightArrowIconinhomepage } from "../../assets/icon/icons";
import { getAllService } from "../../API/Api";
import { Pagination } from "antd";
const Services = () => {

  const [allService, setAllService] = useState([]);
  const fetchAllService = async () => {
    try {
      const response = await getAllService();
      if (response.data.status === 200) {
        console.log(response.data.info);
        setAllService(response.data.info);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllService();
  }, []);
  
  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
    
  }, [allService.length > 0]);
  return (
    <div className="services-container">
      <Container>
        <Row className="services-row1 d-flex text-white">
          <Col
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="100"
            lg={12}
            className="text-start d-flex flex-column justify-content-center align-items-start "
            style={{ maxWidth: "390px" }}
          >
            <span className="services-title zen-dots">Our Services</span>

            {/* <span className="services-description zen-dots">Discover Our Services To Keep Your Car In Top Shape!</span> */}
            <BlurText
              delay={10}
              className="services-description "
              text="Discover Our Services To Keep Your Car In Top Shape!"
            />
          </Col>
          <Col
            data-aos="fade-up"
            data-aos-duration="300"
            data-aos-delay="100"
            lg={12}
            className="services-description2"
            style={{ maxWidth: "478px" }}
          >
            <BlurText
              delay={10}
              className="k2d"
              text="Explore Our Wide Range Of Professional Services, Thoughtfully Designed To Ensure Your Car Remains In Peak Condition, Delivering Both Performance And Style You Can Reliance On!"
            />
          </Col>
          <Col
            lg={12}
            className="all-services-btn-container "
            style={{ maxWidth: "272px" }}
          >
            <button
              data-aos="fade-up"
              data-aos-duration="300"
              data-aos-delay="200"
              className="view-all-services-btn btn-4 zen-dots"
            >
              View All Services
            </button>
          </Col>
        </Row>
        <Row className="services-row2">
          {allService.map((item, index) => (
            <>
           
            <Col lg={12} className="services-row2-title-container" data-aos="fade-up" data-aos-duration="300" data-aos-delay={`${index * 100 + 100}ms`}>
              <div
                className="services-row2-title-container-row1"
              >
                <div
                  className="services-row2-title-container-icon"
                  style={{
                    WebkitMaskImage: `url("${item.iconimage}")`,
                    maskImage: `url("${item.iconimage}")`,
                  }}
                ></div>
                <span className="services-row2-title-container-title zen-dots">
                  {item.name}
                </span>
              </div>
              <div className="services-row2-title-container2">
                <img
                  src={item.image}
                  alt="interior"
                  className="services-container2-img"
                />
                <div className="services-row2-title-container2-title">View</div>
              </div>
              <div className="services-row2-title-container3">
                <UpRightArrowIconinhomepage className="UpRightArrowIconinhomepage" />
              </div>
            
            </Col>
            <Col lg={12} className="services-row2-title-container4" data-aos="fade-up" data-aos-duration="300" data-aos-delay={`${index * 100 + 100}ms`}>
                  
               <img src={item.image} alt="icon" className="services-row2-title-container4-img" />
            
            </Col>
        
            </>
          ))}
          <Col lg={12} className="services-row2-title-container5">
        <button  className="view-all-services-btn btn-4 zen-dots">View All Services</button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Services;
