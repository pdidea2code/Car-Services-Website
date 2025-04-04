import { useOutletContext, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { getAddonByServiceId } from "../../../API/Api";
import { Spinner, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import { memo } from "react";
import {
  DropArrowIcon,
  WalletIcon,
  ClockIcon,
  RemoveIcon,
  AddIcon,
} from "../../../assets/icon/icons";

const cache = new Map();

const Addons = () => {
  const appSetting = useSelector((state) => state.appSetting.appSetting);
  const navigate = useNavigate();
  const { serviceid, setAddon, updateTotals, addon } = useOutletContext();
  const [isLoading, setIsLoading] = useState(false);
  const [addons, setAddons] = useState([]);
  const [showAddons, setShowAddons] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [error, setError] = useState(null);

  const fetchAddon = useCallback(async () => {
    setIsLoading(true);
    try {
      const cacheKey = `addons_${serviceid.id}`;
      if (cache.has(cacheKey)) {
        setAddons(cache.get(cacheKey));
      } else {
        const response = await getAddonByServiceId({ serviceid: serviceid.id });
        if (response.data.status === 200) {
          setAddons(response.data.info);
          cache.set(cacheKey, response.data.info);
        } else {
          throw new Error("Failed to fetch addons");
        }
      }
    } catch (error) {
      setError(error.message || "Error fetching addons");
    } finally {
      setIsLoading(false);
    }
  }, [serviceid.id]);

  const handleAddonToggle = useCallback((item) => {
    setSelectedAddons((prev) => {
      const exists = prev.some((addon) => addon._id === item._id);
      return exists
        ? prev.filter((addon) => addon._id !== item._id)
        : [...prev, item];
    });
  }, []);

  const handleNext = useCallback(() => {
    try {
      setAddon(selectedAddons);
      updateTotals(serviceid.price, serviceid.time, selectedAddons);
      navigate("/booking/datetime");
    } catch (error) {
      setError("Error proceeding to next step");
    }
  }, [selectedAddons, setAddon, updateTotals, serviceid, navigate]);

  useEffect(() => {
    if (!serviceid.id) {
      navigate("/booking/service");
    } else {
      fetchAddon();
    }
    window.scrollTo(0, 0);
  }, [serviceid, navigate, fetchAddon]);

  useEffect(() => {
    setSelectedAddons(addon);
  }, [addon]);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : error ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <span className="text-danger k2d">{error}</span>
        </div>
      ) : (
        <>
          <div className="booking-service-title zen-dots">Select Add-ons</div>
          <div
            className="booking-service-drop-container d-flex justify-content-between"
            onClick={() => setShowAddons(!showAddons)}
          >
            <span className="k2d">
              {selectedAddons.length > 0
                ? `${selectedAddons.length} Add-On(s) Selected`
                : "Select Add-Ons"}
            </span>
            <div className={`drop-arrow-icon ${showAddons ? "active" : ""}`}>
              <DropArrowIcon className="DropArrowIcon" />
            </div>
          </div>
          <div
            className={`booking-service-dwon-container ${
              showAddons ? "active" : ""
            }`}
          >
            <Row>
              {addons.length > 0 ? (
                addons.map((item) => (
                  <Col
                    lg={6}
                    md={12}
                    sm={12}
                    key={item._id}
                    onClick={() => handleAddonToggle(item)}
                  >
                    <div
                      className={`booking-service ${
                        selectedAddons.some((addon) => addon._id === item._id)
                          ? "active"
                          : ""
                      }`}
                    >
                      <div className="booking-service-detail">
                        <div style={{ width: "50px", height: "50px" }}>
                          <div
                            className="booking-service-detail-icon"
                            style={{
                              WebkitMaskImage: `url("${item.image}")`,
                              maskImage: `url("${item.image}")`,
                            }}
                          />
                        </div>
                        <div>
                          <span className="booking-service-detail-title zen-dots">
                            {item.name}
                          </span>
                          <div className="d-flex gap-3 mt-2">
                            <div className="d-flex align-items-center gap-1">
                              <WalletIcon
                                className="WalletIcon color2"
                                style={{ width: "24px", height: "24px" }}
                              />
                              <span className="booking-service-detail-title k2d">
                                {appSetting?.currency_symbol}
                                {item.price}
                              </span>
                            </div>
                            <div className="d-flex align-items-center k2d gap-1">
                              <ClockIcon
                                className="ClockIcon color2"
                                style={{ width: "22px", height: "22px" }}
                              />
                              <span className="booking-service-detail-title k2d">
                                {item.time}min
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="booking-service-add">
                        {selectedAddons.some(
                          (addon) => addon._id === item._id
                        ) ? (
                          <RemoveIcon className="RemoveIcon" />
                        ) : (
                          <AddIcon className="AddIcon" />
                        )}
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <Col>
                  <div className="d-flex justify-content-center align-items-center">
                    <span className="k2d">No addons found</span>
                  </div>
                </Col>
              )}
            </Row>
          </div>
          <div className="booking-service-next-container">
            <button
              onClick={handleNext}
              className="booking-service-next zen-dots btn-4"
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default memo(Addons);
