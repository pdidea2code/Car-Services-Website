import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import "./reviewdisplay.css";
import {
  RoundArrowIconwhiteLeft,
  RoundArrowIconwhiteRight,
  ReviewIcon,
} from "../../assets/icon/icons";
import backimage from "../../assets/image/reviewbackgroung.jpeg";
import noimage from "../../assets//image/Profile.png";
import { displayReview } from "../../API/Api";
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      <RoundArrowIconwhiteLeft className={"RoundArrowIconwhite"} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  console.log(props);
  return (
    <div
      className={className}
      style={{
        ...style,
      }}
      onClick={onClick}
    >
      <RoundArrowIconwhiteRight className={"RoundArrowIconwhite"} />
    </div>
  );
}

function CustomArrows() {
  const [review, setreview] = useState([]);
  const fetchreview = async () => {
    try {
      const response = await displayReview();
      if (response.status === 200) {
        setreview(response.data.info);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchreview();
  }, []);
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true,
    dots: false, //
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return review.length > 0 ? (
    <div
      className="review-slider-container"
      style={{ backgroundImage: `url(${backimage})` }}
    >
      <Container>
        <div className="review-slider-container-title zen-dots">
          Customer Feedback
        </div>
        <div className="review-slider-container-title2 zen-dots">
          Hear What Our Clients Are Saying
        </div>
        <div className="slider-container">
          <Slider {...settings} className="review-slider">
            {review.map((item) => (
              <div className="slider-container-item">
                <div className="slider-container-item-span k2d">
                  <span>{item?.review}</span>
                </div>
                <div className="slider-container-item-image-container">
                  <img
                    src={item?.image ? item?.image : noimage}
                    className="slider-container-item-image"
                  ></img>
                  <div className="review-name">{item?.name}</div>
                  <div className="review-designation">{item?.designation}</div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </Container>
      <div className="review-slider-container-overlay">
        <ReviewIcon className="ReviewIcon" />
      </div>
    </div>
  ) : (
    ""
  );
}

export default CustomArrows;
