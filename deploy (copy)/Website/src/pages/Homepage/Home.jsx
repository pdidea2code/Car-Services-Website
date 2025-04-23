import Mainsection from "./Mainsection";
import Excellence from "./Excellence";
import Services from "./Services";
import ChooseUs from "./ChooseUs";
import Offer from "./Offer";
import Blog from "./Blog";
import Faq from "./Faq";
import Showcase from "../../components/showcase/Showcase";
import { useEffect } from "react";
import Reviewdisplay from "./Reviewdisplay";
const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div>
      <Mainsection />
      <Excellence />
      <Services />
      <ChooseUs />
      <Offer />
      <Blog />
      <Faq />
      <Reviewdisplay />
      <Showcase />
    </div>
  );
};

export default Home;
