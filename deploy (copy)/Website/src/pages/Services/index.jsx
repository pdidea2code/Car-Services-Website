import { Container, Row, Col, Pagination, Spinner } from "react-bootstrap";
import Header from "../../components/Header";
import "./index.css";
import { UpRightArrowIconinhomepage } from "../../assets/icon/icons";
import { getAllService } from "../../API/Api";
import { useEffect, useState } from "react";
import Showcase from "../../components/showcase/Showcase";
import PaginatedList from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import BlurText from "../../components/BlurText";
const Services = () => {
  const [allService, setAllService] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const servicesPerPage = 5;
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
  ];
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
    fetchAllService();
  }, []);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastService = currentPage * servicesPerPage;
  const indexOfFirstService = indexOfLastService - servicesPerPage;
  const currentServices = allService.slice(
    indexOfFirstService,
    indexOfLastService
  );
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <div className="services-page-container">
          <Header title="Services" navigation={nav} />
          <div className="services-page">
            <Container>
              <Row>
                <Col xs={12} lg={6} className="services-page-left">
                  <BlurText
                    delay={10}
                    className="services-page-title zen-dots"
                    text="Our Services"
                  />
                  <BlurText
                    delay={20}
                    className="services-page-description zen-dots"
                    text="Discover Our Services To Keep Your Car In Top Shape!"
                  />
                </Col>
                <Col xs={12} lg={6} className="services-page-right">
                  <BlurText
                    delay={30}
                    className="services-page-description2 k2d"
                    text="Explore Our Wide Range Of Professional Services, Thoughtfully Designed To Ensure Your Car Remains In Peak Condition, Delivering Both Performance And Style You Can Reliance On!"
                  />
                </Col>
              </Row>
            </Container>
          </div>
          <div className="services-page-cards">
            <Container>
              <Row className="services-page-cards-desktop">
                {allService.map((item, index) => (
                  <Col
                    xs={12}
                    lg={12}
                    className="services-page-card-container-row d-flex flex-column "
                  >
                    <div className="services-page-card-container ">
                      <div className="services-page-card1">
                        <div
                          className="services-page-card1-icon"
                          style={{
                            WebkitMaskImage: `url("${item.iconimage}")`,
                            maskImage: `url("${item.iconimage}")`,
                          }}
                        ></div>
                        <span className="services-page-card1-title zen-dots">
                          {item.name}
                        </span>
                      </div>
                      <div className="services-page-card2">
                        <img
                          src={item.image}
                          alt="service"
                          className="services-page-card2-img"
                        />
                        <div
                          className="services-page-card2-title zen-dots"
                          onClick={() => {
                            navigate(`/services/${item._id}`);
                          }}
                        >
                          View
                        </div>
                      </div>
                      <div className="services-row2-title-container3">
                        <UpRightArrowIconinhomepage className="UpRightArrowIconinhomepageblack" />
                      </div>
                    </div>
                    <div className="services-page-mobile-container">
                      <img
                        src={item.image}
                        alt="service"
                        className="services-page-mobile-img"
                      />
                      <div
                        className="services-page-mobile-view zen-dots"
                        onClick={() => {
                          navigate(`/services/${item._id}`);
                        }}
                      >
                        View
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <Row className="services-page-cards-mobile">
                {currentServices.map((item) => (
                  <Col
                    xs={12}
                    lg={12}
                    className="services-page-card-container-row d-flex flex-column"
                  >
                    <div className="services-page-card-container ">
                      <div className="services-page-card1">
                        <div
                          className="services-page-card1-icon"
                          style={{
                            WebkitMaskImage: `url("${item.iconimage}")`,
                            maskImage: `url("${item.iconimage}")`,
                          }}
                        ></div>
                        <span className="services-page-card1-title zen-dots">
                          {item.name}
                        </span>
                      </div>
                      <div className="services-page-card2">
                        <img
                          src={item.image}
                          alt="service"
                          className="services-page-card2-img"
                        />
                        <div
                          className="services-page-card2-title zen-dots"
                          onClick={() => {
                            window.location.href = `/services/${item._id}`;
                          }}
                        >
                          View
                        </div>
                      </div>
                      <div className="services-row2-title-container3">
                        <UpRightArrowIconinhomepage className="UpRightArrowIconinhomepageblack" />
                      </div>
                    </div>
                    <div className="services-page-mobile-container">
                      <img
                        src={item.image}
                        alt="service"
                        className="services-page-mobile-img"
                      />
                      <div
                        className="services-page-mobile-view zen-dots"
                        onClick={() => {
                          window.location.href = `/services/${item._id}`;
                        }}
                      >
                        View
                      </div>
                    </div>
                  </Col>
                ))}
                <PaginatedList
                  totalItems={allService.length}
                  itemsPerPage={servicesPerPage}
                  onPageChange={paginate}
                  selectedFilter={currentPage}
                />
              </Row>
            </Container>
          </div>
          <Showcase />
        </div>
      )}
    </>
  );
};

export default Services;
