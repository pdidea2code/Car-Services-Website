import { useEffect, lazy } from "react";
const Mainsection = lazy(() => import("./Mainsection"));
const Excellence = lazy(() => import("./Excellence"));
const Services = lazy(() => import("./Services"));
const ChooseUs = lazy(() => import("./ChooseUs"));
const Offer = lazy(() => import("./Offer"));
const Blog = lazy(() => import("./Blog"));
const Faq = lazy(() => import("./Faq"));
const Reviewdisplay = lazy(() => import("./Reviewdisplay"));
const Showcase = lazy(() => import("../../components/showcase/Showcase"));

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <Mainsection />
      <Excellence />
      <Services />
      <ChooseUs />
      <Offer />
      <Blog />
      <Faq />
      <Reviewdisplay />
      <Showcase />
    </>
  );
};

export default Home;
