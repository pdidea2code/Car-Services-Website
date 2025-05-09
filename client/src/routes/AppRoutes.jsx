import Header from "./Heder"; // Fix typo: should be "Header"
import RouteList from "./routes";
import Footer from "./Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";
import PopupModel from "./popupmodel";

const AppRoutes = () => {
  const appsrting = useSelector((state) => state.appSetting.appSetting);

  // This check is now redundant since AppRoutes is only rendered when appsrting is ready
  if (!appsrting || !appsrting.stripe_publishable_key) {
    return null; // Or a fallback UI if needed
  }

  const stripePromise = loadStripe(appsrting.stripe_publishable_key);

  return (
    <>
      <Header />
      <Elements stripe={stripePromise}>
        <RouteList style={{ flex: 1 }} />
      </Elements>
      <PopupModel />

      <Footer />
    </>
  );
};

export default AppRoutes;
