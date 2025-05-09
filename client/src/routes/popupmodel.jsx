import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./popupmodel.css";
import { getPopupImageApi } from "../API/Api";
const PopupModel = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupImage, setPopupImage] = useState({});

  const fetchPopupImage = async () => {
    try {
      const res = await getPopupImageApi();
      setPopupImage(res.data.info);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowPopup(true);
      //   sessionStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    fetchPopupImage();
  }, []);
  return (
    <>
      {popupImage.status === true && (
        <Modal
          backdrop="static"
          centered
          show={showPopup}
          //       onHide={() => {
          //     setShowPopup(false);
          //     sessionStorage.setItem("hasVisited", "true");
          //   }}
          className="popupmodal"
        >
          <Modal.Body>
            <div className="popupmodalbody">
              <div className="popupmodalimg">
                <img
                  src={popupImage.image}
                  alt="logo"
                  style={{ width: "100%", height: "100%" }}
                  className="popupmodalimgdesktop"
                />
                <img
                  src={popupImage.mobileimage}
                  alt="logo"
                  style={{ width: "100%", height: "100%" }}
                  className="popupmodalimgmobile"
                />
              </div>
              <div className="popupmodalclosebtn">
                <button
                  className="popupmodalclosebtn"
                  onClick={() => {
                    setShowPopup(false);
                    sessionStorage.setItem("hasVisited", "true");
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M6.61612 6.61612C7.10427 6.12796 7.89573 6.12796 8.38388 6.61612L15 13.2322L21.6161 6.61612C22.1043 6.12796 22.8957 6.12796 23.3839 6.61612C23.872 7.10427 23.872 7.89573 23.3839 8.38388L16.7678 15L23.3839 21.6161C23.872 22.1043 23.872 22.8957 23.3839 23.3839C22.8957 23.872 22.1043 23.872 21.6161 23.3839L15 16.7678L8.38388 23.3839C7.89573 23.872 7.10427 23.872 6.61612 23.3839C6.12796 22.8957 6.12796 22.1043 6.61612 21.6161L13.2322 15L6.61612 8.38388C6.12796 7.89573 6.12796 7.10427 6.61612 6.61612Z"
                      fill="#0D263C"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default PopupModel;
