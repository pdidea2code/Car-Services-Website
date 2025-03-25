import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./showcase.css";
import Slider from "react-slick";
import { getAllBanner } from "../../API/Api";
import { useState, useEffect } from "react";
const Showcase = () => {
  const [banner, setBanner] = useState([]);
  const settings = {
    centerMode: true,
    centerPadding: "60px",
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    responsive: [
        {
            breakpoint: 1440,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 1,
            
            }
          },
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3 ,
            slidesToScroll: 1,
           
            centerMode: false,
          }
        },
        {
          breakpoint: 480,
          settings: {
            centerMode: false,
            slidesToShow: 3,
            slidesToScroll: 1
          }
        }
      ]
  
  };
  const fetchBanner = async () => {
    try {
      const response = await getAllBanner();
      if (response.status === 200) {
        setBanner(response.data.info);
        console.log(response.data.info);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchBanner();
  }, []);

  return (
    <div className="showcase-container">
        <div className="slider-container">
      <Slider {...settings}>
        {banner.map((item) => (
          <div className="slider-item" key={item.id}>
            <img src={item.image} alt={item.image} style={{width: "100%", height: "100%", padding: "0px 10px"   }} />
          </div>
        ))}
      </Slider>
      </div>
    </div>
  );
};

export default Showcase;
