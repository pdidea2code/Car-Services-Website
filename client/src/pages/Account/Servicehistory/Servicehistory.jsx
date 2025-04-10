import "./servicehistory.css";
import { getOrder } from "../../../API/Api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal } from "antd";
import dayjs from "dayjs";
import { Spinner } from "react-bootstrap";
import AOS from "aos";
import "aos/dist/aos.css";
const Servicehistory = () => {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const appSettings = useSelector((state) => state.appSetting.appSetting);

  const fetchOrder = async () => {
    try {
      setIsLoading(true);
      const res = await getOrder();
      if (res.status === 200) {
        const completedOrder = res.data.info.filter(
          (item) =>
            item.paymentstatus === "SUCCESS" ||
            (item.paymentstatus === "FAILED" &&
              item.paymentmode === "ONLINE") ||
            item.paymentmode === "COD"
        );
        setOrder(res.data.info);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <>
          {order.length > 0 ? (
            order.map((item, index) => (
              <div className="service-history-container" data-aos="fade-up">
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
                  <div
                    className={`service-history-status ${item.order_status} k2d`}
                  >
                    {item.order_status}
                  </div>
                </div>
                <div className="service-history-button-container zen-dots">
                  {item.order_status === "COMPLETED" && (
                    <>
                      <button
                        className="service-history-button btn-4"
                        onClick={() => {
                          navigate("/invoice", {
                            state: { orderId: item._id },
                          });
                        }}
                      >
                        View Invoice
                      </button>

                      <button
                        className="service-history-button btn-4"
                        onClick={() => {
                          navigate("/account/servicehistory/review", {
                            state: { item },
                          });
                        }}
                      >
                        Leave Review
                      </button>
                    </>
                  )}
                </div>
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

export default Servicehistory;
