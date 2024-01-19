import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import * as ExportService from "../../services/ExportService";

function ImgGalleryExp(props) {
  const { openPopup, setOpenPopup, exportId, type } = props;
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [exports, setExports] = useState({});
  const [currentMenu, setCurrentMenu] = useState("photos");
  const handleClose = () => {
    setOpenPopup(false);
  };
  useEffect(() => {
    setLoading(true);
    const getAllImage = () => {
      ExportService.getExportById(exportId, type)
        .then((res) => {
          setExports(res.data.export_details);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };
    if (exportId) {
      getAllImage();
    }
  }, [exportId, type]);

  const handleSwitch = (current) => {
    setCurrentMenu(current);
  };

  return (
    <>
      <Modal
        size="xl"
        show={openPopup}
        onHide={handleClose}
        dialogClassName="modal-90w"
        scrollable="true"
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
          </ul>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {loading && <p>Loading ...</p>}
            {currentMenu === "photos" && (
              <div className="row m-2">
                {exports.container_images &&
                  exports.container_images.map((objectPhoto, index) => (
                    <div className="col-md-3 mb-4" key={index}>
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

            {currentMenu === "documents" && (
              <div className="row m-2">
                {exports.documents &&
                  exports.documents.map((objectPhoto, index) => (
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
                {exports.invoices &&
                  exports.invoices.map((objectPhoto, index) => (
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
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
export default ImgGalleryExp;
