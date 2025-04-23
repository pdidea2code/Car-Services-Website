import { Container, Row, Col } from "react-bootstrap";
import "./blog.css";
import BlurText from "../../components/BlurText";
import { getAllBlog } from "../../API/Api";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
const Blog = () => {
  const [blog, setBlog] = useState([]);
  const navigate = useNavigate();
  const fetchBlog = async () => {
    try {
      const request = {
        page: 1,
      };
      const response = await getAllBlog(request);
      if (response.data.status === 200) {
        setBlog(response.data.info.updatedBlogs);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchBlog();
  }, []);

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [blog.length > 0]);

  return (
    <div className="blog-container">
      <Container>
        <Row className="blog-row1" data-aos="fade-up">
          <Col
            lg={12}
            style={{ maxWidth: "390px" }}
            className="text-start d-flex flex-column justify-content-center align-items-start "
          >
            <BlurText
              delay={10}
              className="blog-title zen-dots"
              text="Blog Updates"
            />
            <BlurText
              delay={20}
              className="blog-title2 zen-dots"
              text="Discover Our Most Recent Posts"
            />
          </Col>
          <Col lg={12} style={{ maxWidth: "478px" }} className="blog-col2 ">
            <BlurText
              delay={10}
              className="blog-description k2d"
              text="Stay informed with our latest blog updates, featuring insightful articles and trending topics. Explore expert tips, news, and stories curated just for you!"
            />
          </Col>
          <Col lg={12} style={{ maxWidth: "272px" }} className="blog-col3">
            <button
              className="blog-button btn-4 zen-dots"
              onClick={() => navigate("/blog")}
            >
              View All Blog
            </button>
          </Col>
        </Row>
        <Row className="blog-row2">
          <Col
            xl={6}
            lg={6}
            md={12}
            className="blog-row2-col1"
            style={{
              backgroundImage: `url(${blog[0]?.image})`,
            }}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* <img className="blog-img1" src={"http://localhost:5800/blogimg/1742368137377-gloved-hands-cleaning-auto-gear-with-spray.png"} alt="blog" /> */}

            <div className="blog-details">
              <span className="blog-date k2d">
                {dayjs(blog[0]?.createdAt).format("DD MMMM, YYYY")}
              </span>
              <span className="blog-title3 zen-dots">{blog[0]?.title}</span>
              <span className="blog-description2 k2d">
                {blog[0]?.description}
              </span>
              <button
                className="blog-button btn-4 zen-dots"
                onClick={() => navigate(`/blog/${blog[0]?._id}`)}
              >
                Read More
              </button>
            </div>
          </Col>
          <Col xl={6} lg={6} md={12} className="blog-row2-col2">
            <div className="blog-row2-col2-d12 blog-row2-col2-d1">
              <img
                className="blog-row2-col2-d1-img"
                src={`${blog[0]?.image}`}
                alt="blog"
              />
              <div className="blog-row2-col2-d1-detail">
                <span className="blog-row2-col2-d1-detail-date k2d">
                  {dayjs(blog[0]?.createdAt).format("DD MMMM, YYYY")}
                </span>
                <span className="blog-row2-col2-d1-detail-title zen-dots">
                  {blog[0]?.title}
                </span>
                <span className="blog-row2-col2-d1-detail-description k2d">
                  {blog[0]?.description}
                </span>
                <button
                  className="blog-row2-col2-d1-detail-button btn-4 zen-dots"
                  onClick={() => navigate(`/blog/${blog[0]?._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
            <div
              className="blog-row2-col2-d1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <img
                className="blog-row2-col2-d1-img"
                src={`${blog[1]?.image}`}
                alt="blog"
              />
              <div className="blog-row2-col2-d1-detail">
                <span className="blog-row2-col2-d1-detail-date k2d">
                  {dayjs(blog[1]?.createdAt).format("DD MMMM, YYYY")}
                </span>
                <span className="blog-row2-col2-d1-detail-title zen-dots">
                  {blog[1]?.title}
                </span>
                <span className="blog-row2-col2-d1-detail-description k2d">
                  {blog[1]?.description}
                </span>
                <button
                  className="blog-row2-col2-d1-detail-button btn-4 zen-dots"
                  onClick={() => navigate(`/blog/${blog[1]?._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
            <div
              className="blog-row2-col2-d1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                className="blog-row2-col2-d1-img"
                src={`${blog[2]?.image}`}
                alt="blog"
              />
              <div className="blog-row2-col2-d1-detail">
                <span className="blog-row2-col2-d1-detail-date k2d">
                  {dayjs(blog[2]?.createdAt).format("DD MMMM, YYYY")}
                </span>
                <span className="blog-row2-col2-d1-detail-title zen-dots">
                  {blog[2]?.title}
                </span>
                <span className="blog-row2-col2-d1-detail-description k2d">
                  {blog[2]?.description}
                </span>
                <button
                  className="blog-row2-col2-d1-detail-button btn-4 zen-dots"
                  onClick={() => navigate(`/blog/${blog[2]?._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Blog;
