import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Viewer from "react-viewer";
import * as VehicleService from "../../services/VehicleService";
function ImgGallery(props) {
  const { openPopup, setOpenPopup, vehicleId } = props;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState({});

  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [currentMenu, setCurrentMenu] = useState("photos");
  const handleClose = () => {
    setOpenPopup(false);
  };
  useEffect(() => {
    setLoading(true);
    const getAllImage = () => {
      VehicleService.getVehicleById(vehicleId)
        .then((res) => {
          setVehicle(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    if (vehicleId) {
      getAllImage();
    }
  }, [vehicleId]);
  const handleSwitch = (current) => {
    setCurrentMenu(current);
  };

  console.log(visible);

  return (
    <>
      <Modal
        size="xl"
        show={openPopup}
        onHide={handleClose}
        dialogClassName="modal-90w"
        scrollable="true"
        // style={{ position: 'absolute',top:'0px' }}
      >
        <Modal.Header closeButton>
          <ul className="nav nav-pills">
            <li className="nav-item">
              <button
                className={
                  currentMenu === "photos" ? "nav-link active" : "nav-link"
                }
                onClick={() => handleSwitch("photos")}
              >
                Photos
              </button>
            </li>
            <li className="nav-item">
              <button
                className={
                  currentMenu === "documents" ? "nav-link active" : "nav-link"
                }
                onClick={() => handleSwitch("documents")}
              >
                Documents
              </button>
            </li>
            <li className="nav-item">
              <button
                className={
                  currentMenu === "invoices" ? "nav-link active" : "nav-link"
                }
                onClick={() => handleSwitch("invoices")}
              >
                Invoices
              </button>
            </li>
          </ul>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {loading && <p>Loading ...</p>}
            {currentMenu === "photos" && (
              <div className="row m-2">
                {vehicle.photos &&
                  vehicle.photos.map((objectPhoto, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                      <div className="">
                        {objectPhoto.type !== "application/pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            onClick={() => {
                              setVisible(true);
                              setActiveIndex(index);
                              handleClose();
                            }}
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "application/pdf" && (
                          <iframe
                            src={objectPhoto.url}
                            title={objectPhoto.name}
                            frameBorder="0"
                            height={200}
                            width="100%"
                          ></iframe>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {currentMenu === "documents" && (
              <div className="row m-2">
                {vehicle.documents &&
                  vehicle.documents.map((objectPhoto, index) => (
                    <div className="col-md-2" key={index}>
                      <div className="">
                        {objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "pdf" && (
                          <iframe
                            src={objectPhoto.url}
                            title={objectPhoto.name}
                            frameBorder="0"
                            height={200}
                            width="100%"
                          ></iframe>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {currentMenu === "invoices" && (
              <div className="row m-2">
                {vehicle.invoices &&
                  vehicle.invoices.map((objectPhoto, index) => (
                    <div className="col-md-2" key={index}>
                      <div className="">
                        {objectPhoto.type !== "pdf" && (
                          <img
                            src={objectPhoto.url}
                            alt=""
                            height={200}
                            width="100%"
                            style={{ borderRadius: "5px" }}
                          />
                        )}

                        {objectPhoto.type === "pdf" && (
                          <iframe
                            src={objectPhoto.url}
                            title={objectPhoto.name}
                            frameBorder="0"
                            height={200}
                            width="100%"
                          ></iframe>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
          <Viewer
            visible={visible}
            onClose={() => {
              setVisible(false);
            }}
            style={{ position: "relative", zIndex: "200000000" }}
            activeIndex={activeIndex}
            images={
              vehicle.photos &&
              vehicle.photos.map((item) => ({
                src: `${item?.url}`,
                alt: `${item?.name}`,
              }))
            }
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
export default ImgGallery;
