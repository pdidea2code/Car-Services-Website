import Header from "./Heder"; // Note: "Heder" might be a typo; should it be "Header"?
import RouteList from "./routes";
import Footer from "./Footer";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector } from "react-redux";

const AppRoutes = () => {
  const appsrting = useSelector((state) => state.appSetting.appSetting);

  // Check if appsrting and stripe_publishable_key exist
  if (!appsrting || !appsrting.stripe_publishable_key) {
    return <div>Loading Stripe configuration...</div>;
  }

  const stripePromise = loadStripe(appsrting.stripe_publishable_key);

  return (
    <>
      <Header />
      <Elements stripe={stripePromise}>
        <RouteList />
      </Elements>
      <Footer />
    </>
  );
};

export default AppRoutes;
