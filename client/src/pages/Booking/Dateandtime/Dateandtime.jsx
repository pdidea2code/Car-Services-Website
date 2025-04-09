import { useState, useEffect, useCallback } from "react";
import { Spinner, Row, Col } from "react-bootstrap";
import { CalendarIcon, DropArrowIcon } from "../../../assets/icon/icons";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useOutletContext, useNavigate } from "react-router-dom";
import "./Dateandtime.css";
import { getBusinessHour } from "../../../API/Api";
import { memo } from "react";

// const cache = new Map();

// Helper function to generate time slots
const generateTimeSlots = (open, close, duration, isClosed) => {
  if (isClosed || !open || !close) return [];

  const slots = [];
  let [openHour, openMinute] = open.split(":").map(Number);
  let [closeHour, closeMinute] = close.split(":").map(Number);

  let currentTime = openHour * 60 + openMinute;
  const endTime = closeHour * 60 + closeMinute;

  while (currentTime + duration <= endTime) {
    const hour = Math.floor(currentTime / 60);
    const minute = currentTime % 60;
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    const timeString = `${displayHour.toString().padStart(2, "0")}:${minute
      .toString()
      .padStart(2, "0")} ${period}`;
    slots.push(timeString);

    currentTime += duration;
  }

  return slots;
};

const Dateandtime = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    serviceid,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    setErrors,
  } = useOutletContext();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState({});
  const [slot, setSlot] = useState([]);
  const [businessHour, setBusinessHour] = useState([]);
  const [error, setError] = useState({ time: null, date: null });

  const fetchBusinessHour = useCallback(async () => {
    setIsLoading(true);
    try {
      // if (cache.has("businessHours")) {
      //   setBusinessHour(cache.get("businessHours"));
      // } else {
      const response = await getBusinessHour();
      if (response.data.status === 200) {
        setBusinessHour(response.data.info);
        // cache.set("businessHours", response.data.info);
      } else {
        throw new Error("Failed to fetch business hours");
      }
      // }
    } catch (error) {
      setError({ date: error.message || "Error fetching business hours" });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinessHour();
  }, [fetchBusinessHour]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!serviceid.id) {
      navigate("/booking/service");
    }
  }, [serviceid, navigate]);

  useEffect(() => {
    if (selectedDateInfo.dayName && businessHour.length > 0) {
      const dayName = selectedDateInfo.dayName;
      const businessDay = businessHour.find((bh) => {
        if (dayName === "Saturday") return bh.day === "Saturaday"; // Typo in original
        if (dayName === "Sunday") return bh.day === "Sunday";
        return (
          bh.day === "Mon - Fri" &&
          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
            dayName
          )
        );
      });

      if (businessDay) {
        const slots = generateTimeSlots(
          businessDay.open,
          businessDay.close,
          businessDay.duration,
          businessDay.is_closed
        );
        setSlot(slots);
      } else {
        setSlot([]);
      }
    }
  }, [selectedDateInfo, businessHour]);

  const toggleCalendar = useCallback(() => {
    setIsCalendarOpen((prev) => !prev);
  }, []);

  const handleDateChange = useCallback(
    (date) => {
      try {
        const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
        setSelectedDate(date);
        setSelectedDateInfo({ date, dayName });
        setSelectedTime(null);
        setIsCalendarOpen(false);
        setError({ date: null, time: null });
        setErrors(null);
      } catch (error) {
        setError({ date: "Error selecting date" });
      }
    },
    [setSelectedDate, setSelectedTime, setErrors]
  );

  const handleTimeSlotClick = useCallback(
    (time) => {
      try {
        setSelectedTime(time);
        setError({ date: null, time: null });
        setErrors(null);
      } catch (error) {
        setError({ time: "Error selecting time" });
      }
    },
    [setSelectedTime, setErrors]
  );

  const handleNext = useCallback(() => {
    try {
      if (!selectedDate) {
        throw new Error("Please select a date");
      }
      if (!selectedTime) {
        throw new Error("Please select a time");
      }
      navigate("/booking/cartype");
    } catch (error) {
      setError({
        date: error.message.includes("date") ? error.message : null,
        time: error.message.includes("time") ? error.message : null,
      });
    }
  }, [selectedDate, selectedTime, navigate]);

  useEffect(() => {
    if (selectedDate && selectedTime) {
      setSelectedDateInfo({
        date: selectedDate,
        dayName: selectedDate.toLocaleDateString("en-US", { weekday: "long" }),
      });
      setIsCalendarOpen(false);
      setShowTime(false);
    }
  }, [selectedDate, selectedTime]);

  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" style={{ color: "var(--color2)" }} />
        </div>
      ) : (
        <>
          <div className="booking-service-title zen-dots">
            Select Date & Time
          </div>
          <Row>
            <Col lg={true}>
              <div
                className="booking-service-drop-container d-flex justify-content-between"
                onClick={toggleCalendar}
                style={{ cursor: "pointer" }}
              >
                <div className="booking-service-date-title k2d">
                  {selectedDate?.toLocaleDateString() || "Date"}
                </div>
                <div className="drop-arrow-icon">
                  <CalendarIcon className="CalendarIcon" />
                </div>
              </div>
              {isCalendarOpen && (
                <div className="calendar-dropdown">
                  <Calendar
                    onChange={handleDateChange}
                    value={selectedDate || new Date()}
                    className="custom-calendar"
                    minDate={new Date()}
                    tileClassName={({ date, view }) =>
                      view === "month" &&
                      date.toDateString() === selectedDate?.toDateString()
                        ? "selected-date"
                        : null
                    }
                  />
                </div>
              )}
              {error.date && (
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-danger k2d">{error.date}</span>
                </div>
              )}
            </Col>
            <Col lg={true}>
              <div
                className="booking-service-drop-container d-flex justify-content-between"
                onClick={() => setShowTime(!showTime)}
              >
                <span className="k2d">{selectedTime || "Time"}</span>
                <div className={`drop-arrow-icon ${showTime ? "active" : ""}`}>
                  <DropArrowIcon className="DropArrowIcon" />
                </div>
              </div>
              {showTime && (
                <div className="time-slots-dropdown">
                  {slot.length > 0 ? (
                    slot.map((time, index) => (
                      <div
                        key={index}
                        className="time-slot-item"
                        onClick={() => handleTimeSlotClick(time)}
                        style={{ padding: "10px", cursor: "pointer" }}
                      >
                        {time}
                        <div className="time-slot-item-icon">
                          {selectedTime === time && (
                            <div className="time-slot-item-icon-check"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px" }}>No available slots</div>
                  )}
                </div>
              )}
              {error.time && (
                <div className="d-flex justify-content-center align-items-center">
                  <span className="text-danger k2d">{error.time}</span>
                </div>
              )}
            </Col>
          </Row>
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

export default memo(Dateandtime);
