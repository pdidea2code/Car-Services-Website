import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { getBlogById } from "../../API/Api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./Blogdetail.css";
import Header from "../../components/Header/index";

const Blogdetail = () => {
  const { id } = useParams();
  const [nav, setNav] = useState([]);
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fetchBlogById = async () => {
    try {
      setLoading(true);
      const response = await getBlogById(id);
      if (response.status === 200) {
        setNav([
          { title: "Home", path: "/" },
          { title: "Blog", path: "/blog" },
          {
            title: response?.data?.info?.title,
            path: `/blog/${response?.data?.info?._id}`,
          },
        ]);
        setBlog(response?.data?.info);
      }
    } catch (error) {
      console.log(error);
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlogById();
    } else {
      navigate("/blog");
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5 mb-5">
        <Spinner style={{ color: "var(--color2)" }} />
      </div>
    );
  }

  if (!blog) {
    return null; // Or a fallback UI
  }

  return (
    <div style={{ backgroundColor: "var(--color3)" }}>
      <Header title={blog.title} navigation={nav} />
      <Container>
        <div className="blog-detail-container1">
          {blog.image && (
            <img
              loading="lazy"
              src={blog.image}
              alt="blog"
              className="blog-detail-image"
            />
          )}
          <span className="blog-detail-date">
            {dayjs(blog.createdAt).format("DD MMMM YYYY")}
          </span>
          <div className="blog-detail-title zen-dots">
            <span>{blog.title}</span>
          </div>
          <div className="blog-detail-description k2d">
            <p>{blog.description}</p>
          </div>
          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </Container>
    </div>
  );
};

export default Blogdetail;
