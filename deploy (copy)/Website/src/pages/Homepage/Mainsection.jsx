import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import SplitText from "../../components/SplitText";
import { useSpring, animated } from "@react-spring/web";
import "./mainsection.css";
import Fade from "../../components/animation";
import { useNavigate } from "react-router-dom";
const Mainsection = () => {
  const navigate = useNavigate();
  const appSetting = useSelector((state) => state.theme.theme);

  return (
    <div
      className="mainsection"
      style={{ backgroundImage: `url(${appSetting?.mainimage})` }}
    >
      <Container>
        <div className="mainsection-contain">
          {/* <span className="mainse-description zen-dots">Premium Care for Your Ride</span> */}
          {/* <span className="mainse-title zen-dots">Your Car Deserves the Best Care!</span> */}
          <SplitText
            text="Premium Care for Your Ride"
            className="mainse-description zen-dots"
            delay={0}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            //   onLetterAnimationComplete={handleAnimationComplete}
          />
          <SplitText
            text="Your Car Deserves the Best Care!"
            className="mainse-title zen-dots"
            delay={30}
            animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
            animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
            easing="easeOutCubic"
            threshold={0.2}
            rootMargin="-50px"
            //   onLetterAnimationComplete={handleAnimationComplete}
          />
        </div>
        <div className="mainsection-button">
          <Fade>
            <button
              onClick={() => navigate("/services")}
              className="mainsection-button-services no-select zen-dots btn-4"
            >
              <span>SERVICES</span>
            </button>
          </Fade>
        </div>
      </Container>
    </div>
  );
};

export default Mainsection;
