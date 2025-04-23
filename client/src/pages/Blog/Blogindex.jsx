import { Container, Row, Col, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getAllBlog } from "../../API/Api";
import Header from "../../components/Header/index";
import "./Blogindex.css";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Paginated from "../../components/Pagination/pagination";
import Showcase from "../../components/showcase/Showcase";
import AOS from "aos";
import "aos/dist/aos.css";

const Blog = () => {
  const navigate = useNavigate();
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPage: 0,
  });
  const nav = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Blog",
      path: "/blog",
    },
  ];

  const fetchBlog = async (page = 1) => {
    try {
      setLoading(true);
      const request = {
        page: page,
      };
      const response = await getAllBlog(request);
      if (response.status === 200) {
        setBlog(response.data.info.updatedBlogs);

        setPagination({
          currentPage: response.data.info.pagination.currentPage,
          totalPage: response.data.info.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    fetchBlog(page);
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
    <div style={{ backgroundColor: "var(--color3)" }}>
      <Header title="Blog" navigation={nav} />
      <Container>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center mt-5">
            <Spinner style={{ color: "var(--color2)" }} />
          </div>
        ) : (
          <>
            <Row className="blog-row">
              {blog.map((item, index) => (
                <Col
                  xl={4}
                  lg={4}
                  md={6}
                  sm={6}
                  xs={12}
                  className="blog-col"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <img src={`${item.image}`} alt="blog1" className="blog-img" />
                  <div className="blog-detail-container">
                    <span className="blog-date">
                      {dayjs(item.createdAt).format("DD MMMM, YYYY")}
                    </span>
                    <span className="blog-title zen-dots">{item.title}</span>
                    <span className="blog-description k2d">
                      {item.description}
                    </span>
                    <button
                      className="blog-button btn-4 zen-dots"
                      onClick={() => navigate(`/blog/${item._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </Col>
              ))}
              <Paginated
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPage}
                onPageChange={handlePageChange}
              />
            </Row>
          </>
        )}
      </Container>
      <Showcase />
    </div>
  );
};

export default Blog;
