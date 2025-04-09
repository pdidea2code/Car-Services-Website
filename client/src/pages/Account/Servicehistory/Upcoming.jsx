import "./servicehistory.css";
import { getOrder, refundPayment } from "../../../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
const Upcoming = () => {
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const appSettings = useSelector((state) => state.appSetting.appSetting);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrder();
      if (res.status === 200) {
        const upcomingOrder = res.data.info.filter(
          (item) =>
            (item.order_status === "PENDING" &&
              item.paymentstatus === "SUCCESS" &&
              item.paymentmode === "ONLINE") ||
            (item.order_status === "PENDING" &&
              item.paymentstatus === "PENDING" &&
              item.paymentmode === "COD")
        );
        setOrder(upcomingOrder);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelService = async (id) => {
    try {
      const res = await refundPayment({ order_id: id });
      if (res.status === 200) {
        alert("Service cancelled successfully");
        setOrder(order.filter((item) => item._id !== id));
      }
    } catch (error) {
      console.log(error);
      alert(error.response.data.message || "Something went wrong");
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);

  useEffect(() => {
    AOS.init({
      disable: function () {
        return window.innerWidth < 992;
      },
      disable: "mobile",
    });
  }, [order.length > 0]);
  return (
    <div>
      <Modal centered open={open} onCancel={() => setOpen(false)} footer={null}>
        <span className="service-history-details k2d">
          Service is not available
        </span>
      </Modal>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <>
          {order.length > 0 ? (
            order.map((item, index) => (
              <div
                className="service-history-container"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="service-history-details-container">
                  <span
                    className="service-history-title zen-dots"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (
                        !item.service_id.isDeleted &&
                        !item.service_id.status
                      ) {
                        setOpen(true);
                      } else {
                        navigate(`/services/${item.service_id._id}`);
                      }
                    }}
                  >
                    {item.service_id.name}
                  </span>
                  <span className="service-history-details k2d">
                    {item.order_id}
                  </span>
                  <span className="service-history-details k2d">
                    {dayjs(item.date).format("MMMM DD, YYYY")} |{" "}
                    {dayjs(`2023-01-01 ${item.time}`).format("h:mm A")}
                  </span>
                  <span className="service-history-details k2d">
                    {item.carname} - {item.carnumber}
                  </span>
                  <span className="service-history-details k2d">
                    {appSettings?.currency_symbol}
                    {item.total_amount}
                  </span>
                  {item.pickupanddrop && (
                    <div>
                      <span className="service-history-pickup zen-dots">
                        Pickup Address:
                      </span>
                      <span className="service-history-details k2d">
                        {" "}
                        {item.house_no} ,{item.house_no}, {item.city} ,
                        {item.pincode}
                      </span>
                    </div>
                  )}
                </div>
                {((item.order_status === "PENDING" &&
                  item.paymentstatus === "SUCCESS" &&
                  item.paymentmode === "ONLINE") ||
                  (item.order_status === "PENDING" &&
                    item.paymentstatus === "PENDING" &&
                    item.paymentmode === "COD")) && (
                  <>
                    <button
                      className="service-history-button btn-4 zen-dots"
                      onClick={() => cancelService(item._id)}
                      style={{ textTransform: "uppercase" }}
                    >
                      Cancel Service
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="no-order-container">
              <p className="no-order-text">No orders found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Upcoming;
