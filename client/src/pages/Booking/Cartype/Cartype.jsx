import { Spinner } from "react-bootstrap";
import { useState, useEffect, useCallback } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { getCartype } from "../../../API/Api";
import { DropArrowIcon } from "../../../assets/icon/icons";
import { memo } from "react";

const cache = new Map();

const Cartype = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    serviceid,
    cartype,
    setCartype,
    selectedDate,
    selectedTime,
    cartypeError,
    setCartypeError,
    setErrors,
  } = useOutletContext();
  const [cartypes, setCartypes] = useState([]);
  const [showCartype, setShowCartype] = useState(false);
  const [selectedCartype, setSelectedCartype] = useState(cartype);
  const [error, setError] = useState(null);

  const fetchCartype = useCallback(async () => {
    setIsLoading(true);
    try {
      if (cache.has("cartypes")) {
        setCartypes(cache.get("cartypes"));
      } else {
        const response = await getCartype();
        if (response.data.status === 200) {
          setCartypes(response.data.info);
          cache.set("cartypes", response.data.info);
        } else {
          throw new Error("Failed to fetch car types");
        }
      }
    } catch (error) {
      setError(error.message || "Error fetching car types");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleCartypeClick = useCallback(
    (cartype) => {
      try {
        setSelectedCartype({ id: cartype._id, name: cartype.name });
        setCartype({ id: cartype._id, name: cartype.name });
        setShowCartype(false);
        setErrors(null);
        setCartypeError(null);
        setError(null);
      } catch (error) {
        setError("Error selecting car type");
      }
    },
    [setCartype, setErrors, setCartypeError]
  );

  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      navigate("/booking/datetime");
    }
    if (!serviceid?.id) {
      navigate("/booking/service");
    }
    fetchCartype();
    window.scrollTo(0, 0);
  }, [selectedDate, selectedTime, serviceid, navigate, fetchCartype]);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <>
          <div className="booking-service-title zen-dots">Select Car Type</div>
          <div
            className="booking-service-drop-container d-flex justify-content-between"
            onClick={() => setShowCartype(!showCartype)}
          >
            <span className="k2d zen-dots">
              {selectedCartype?.name || "Car Type"}
            </span>
            <div className={`drop-arrow-icon ${showCartype ? "active" : ""}`}>
              <DropArrowIcon className="DropArrowIcon" />
            </div>
          </div>
          {showCartype && (
            <div className="time-slots-dropdown">
              {cartypes.length > 0 ? (
                cartypes.map((item, index) => (
                  <div
                    key={index}
                    className="time-slot-item"
                    onClick={() => handleCartypeClick(item)}
                    style={{ padding: "10px", cursor: "pointer" }}
                  >
                    {item.name}
                    <div className="time-slot-item-icon">
                      {selectedCartype?.id === item._id && (
                        <div className="time-slot-item-icon-check"></div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: "10px" }}>Car Type not found</div>
              )}
            </div>
          )}
          {(cartypeError || error) && (
            <div className="d-flex justify-content-center align-items-center">
              <span className="text-danger k2d">{cartypeError || error}</span>
            </div>
          )}
          {/* <div className="booking-service-next-container">
            <button
              onClick={() => {
                if (!selectedCartype?.id) {
                  setError("Please select a car type");
                } else {
                  navigate("/booking"); // Or wherever you want to go next
                }
              }}
              className="booking-service-next zen-dots btn-4"
            >
              Next
            </button>
          </div> */}
        </>
      )}
    </>
  );
};

export default memo(Cartype);
