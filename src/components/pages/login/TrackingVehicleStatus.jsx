import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import GalleryModal from "../../popup/GalleryModal";
import barcodeimg from "./barcodeimg.jpeg";
import Map from "./Map";
import "./tracking.css";

function TrackingVehicleStatus() {
  const [loading, setLoading] = useState();
  const [searchValue, setSearchValue] = useState("");
  const [vehicle, setVehicle] = useState();
  const [galleryPopUp, setGalleryPopUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let url = `${process.env.REACT_APP_API_BASE_URL}/tracking-vehicle?search_by=${searchValue}`;
    axios
      .get(url)
      .then((response) => {
        if (response.data.data) {
          console.log(response.data.data);
          setVehicle(response.data.data);
        } else {
          setVehicle();
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let imageItems = [];
  if (vehicle?.photos) {
    const { photos } = vehicle;

    imageItems = photos
      ? photos.map((item) => ({
          original: item.url,
          thumbnail: item.url,
        }))
      : [];
  }

  return (
    <div className="">
      <div className="bg-white">
        <div className="container">
          <nav className="navbar navbar-light bg-white">
            <Link to="/" className="navbar-brand">
              <img src="assets/images/greenline-logo.png" alt="" height="40" />
              <strong className="" style={{ marginLeft: "6px" }}>
                Galaxy Shipping
              </strong>
            </Link>
          </nav>
        </div>
      </div>
      <div
        className="container bg-white pb-4 pt-2"
        style={{ marginTop: "20px" }}
      >
        <p style={{ fontSize: "30px", fontFamily: "italic" }}>Tracking</p>
        <nav className="navbar navbar-light">
          <form
            className="form-group"
            style={{ width: "35%", display: "flex", flexGrow: "row" }}
            onSubmit={handleSubmit}
          >
            <input
              className="form-control mr-sm-4 md-4"
              type="search"
              placeholder="Vin or Lot Number"
              aria-label="Search"
              required
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
        </nav>
      </div>
      <div className="container">
        {loading && <p>Loading....</p>}
        {loading === false && !vehicle && (
          <p className="alert alert-danger mt-2 pr-2 pl-2">No record match</p>
        )}

        {vehicle && (
          <div
            className="row mt-2 bg-white pt-4 pb-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="col-md-6 mt-2">
              <div className="card-body mb-3 p-0">
                <div className="traking-show-wrrapper">
                  <div className="left_content">
                    <h5 className="title">{vehicle?.vin}</h5>
                    <img src={barcodeimg} alt="" />
                  </div>
                  <div className="right_content">
                    <div className="d-flex justify-content-between">
                      <h5>{vehicle?.port_of_loading?.name}</h5>
                      <h5>{vehicle?.port_of_discharge?.name}</h5>
                    </div>

                    <div className="status">
                      <div className="left">
                        <span className="icon">
                          <i className="ri-focus-line"></i>
                        </span>
                      </div>
                      <div className="line"></div>
                      <div className="right">
                        <span className="icon">
                          <i className="ri-focus-line"></i>
                        </span>
                      </div>
                      <div className="shipping">
                        <div className="icon">
                          <i className="ri-sailboat-fill"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {vehicle && (
                <table className="table table-bordered table-centered align-middle table-rap mb-0">
                  <tbody>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Year </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle?.year}</td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Make </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle?.make}</td>
                    </tr>

                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Model </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle?.model}</td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Vin </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle.vin}</td>
                    </tr>
                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Lot Number </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle.lot_number}</td>
                    </tr>

                    <tr>
                      <td style={{ width: "50%" }}>
                        {" "}
                        <b>Status </b>{" "}
                      </td>
                      <td style={{ width: "50%" }}>{vehicle.status_name}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
            <div className="col-md-6 mt-2">
              {/* <div className="card-body mb-3 p-0">{mapContent}</div> */}
              <div className="card-body mb-3 p-0">
                <Map
                  portLoading={vehicle?.port_of_loading}
                  portDischarge={vehicle?.port_of_discharge}
                />
              </div>
            </div>
          </div>
        )}

        {/* {vehicle && (
          <div
            className="row mt-2 bg-white pt-4 pb-4"
            style={{ borderRadius: "10px" }}
          >
            <div className="">
              <h5>Vehicle Information</h5>
            </div>
            <div className="col-md-6 mt-2">
              <div className="card-body mb-3">
                <div className="table-responsive table-card">
                  <table className="table table-bordered table-centered align-middle table-rap mb-0">
                    <tbody>
                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Year </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.year}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Make </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.make}</td>
                      </tr>

                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Model </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.model}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 mt-2">
              <div className="card-body">
                <div className="table-responsive table-card">
                  <table className="table table-centered table-bordered align-middle table-rap mb-0">
                    <tbody>
                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Vin </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.vin}</td>
                      </tr>
                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Lot Number </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.lot_number}</td>
                      </tr>

                      <tr>
                        <td style={{ width: "50%" }}>
                          {" "}
                          <b>Status </b>{" "}
                        </td>
                        <td style={{ width: "50%" }}>{vehicle.status_name}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-2 mb-2">
              <h5>Vehicle Photos</h5>
            </div>

            <div className="row m-2">
              {vehicle.photos &&
                vehicle.photos.map((objectPhoto, index) => (
                  <div className="col-md-2" key={index}>
                    <div className="" onClick={() => setGalleryPopUp(true)}>
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
          </div>
        )} */}
      </div>

      <GalleryModal
        title="Vehicle Photo Gallery"
        openPopup={galleryPopUp}
        setOpenPopup={setGalleryPopUp}
        items={imageItems}
      ></GalleryModal>
    </div>
  );
}

export default TrackingVehicleStatus;
