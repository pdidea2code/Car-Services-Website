import { useSelector } from "react-redux";
import "./index.css";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import SplitText from "../SplitText";
const Header = ({ title, navigation }) => {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [title, navigation]);
  return (
    <div
      className="header-container"
      style={{ backgroundImage: `url(${theme?.headerimage})` }}
    >
      <div
        className="header-title zen-dots"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <SplitText
          text={title}
          className="header-title"
          delay={30}
          animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
          animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
        />
      </div>

      <div
        className="header-navigation"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
      >
        {navigation.map((item, index) => (
          <>
            <span
              className="header-navigation-item k2d no-select"
              key={index}
              onClick={() => navigate(item.path)}
            >
              {item.title}
            </span>
            {index !== navigation.length - 1 && (
              <div className="header-navigation-item-divider"></div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default Header;
