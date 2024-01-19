import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import MyPagination from "../../pagination/MyPagination";
import * as VehicleService from "../../services/VehicleService";
import NoteModal from "../note/NoteModal";

const keysItems = [
  { title: "", id: "" },
  { title: "Yes", id: "1" },
  { title: "No", id: "0" },
];

const vehicleTypeItems = [
  { title: "", id: "" },
  { title: "Sedan", id: "Sedan" },
  { title: "Van", id: "Van" },
  { title: "Pickup", id: "Pickup" },
  { title: "Truck", id: "Truck" },
  { title: "Mortorcycle", id: "Mortorcycle" },
];

const titleItems = [
  { title: "", id: "" },
  { title: "NO TITLE", id: "0" },
  { title: "EXPORTABLE", id: 1 },
  { title: "PENDING", id: 2 },
  { title: "BOS", id: 3 },
  { title: "LIEN", id: 4 },
  { title: "MV907", id: 5 },
  { title: "REJECTED", id: 6 },
];

const locationItems = [
  { title: "", id: "" },
  { title: "LA", id: 1 },
  { title: "LA", id: 1 },
  { title: "GA", id: 2 },
  { title: "NY", id: 3 },
  { title: "TX", id: 4 },
  { title: "BALTIMORE", id: 5 },
  { title: "NEWJ-2", id: 6 },
  { title: "TEXAS", id: 7 },
  { title: "NJ", id: 8 },
];

const statusItems = [
  { title: "", id: "" },
  { title: "ON HAND", id: 1 },
  { title: "INSEIDE THE PORT", id: 2 },
  { title: "ON THE WAY", id: 3 },
  { title: "SHIPPED", id: 4 },
  { title: "PICKED UP", id: 5 },
  { title: "ARRIVED", id: 6 },
  { title: "HANDED OVER", id: 7 },
];

const loadingTypeItems = [
  { title: "", id: "" },
  { title: "Full", id: 1 },
  { title: "Mix", id: 2 },
];

const noteItems = [
  { title: "", id: "" },
  { title: "Open", id: 2 },
  { title: "Closed", id: 1 },
];

const filterInitialValues = {
  keys: "",
  vehicle_type: "",
  title: "",
  location_id: "",
  status: "",
  loading_type: "",
  note: "",
};

const filterTextInitialValues = {
  towing_request_date: "",
  deliver_date: "",
  year: "",
  make: "",
  model: "",
  color: "",
  vin: "",
  lot_number: "",
  title_received_date: "",
  container_no: "",
  note: "",
};

function Notes() {
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValues, setFilterValues] = useState(filterInitialValues);
  const [filterTextValues, setFilterTextValues] = useState(
    filterTextInitialValues
  );
  const [filterUrls, setFilterUrls] = useState(null);
  const [notePopup, setNotePopup] = useState(false);
  const [noteData, setNoteData] = useState({});

  useEffect(() => {
    const getVehicles = (page) => {
      setLoading(true);
      VehicleService.getNotes(page)
        .then((response) => {
          setNotes(response.data.data);
          setCount(response.data.meta.last_page);
          setMetaData(response.data.meta);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    };

    let restUrl = `?page=${currentPage}`;

    if (filterUrls) {
      restUrl += filterUrls;
    }

    getVehicles(restUrl);
    return () => {
      setState({});
    };
  }, [currentPage, filterUrls]);

  const pageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilterValues({
      ...filterValues,
      [name]: value,
    });
  };

  const handleTextFilter = (e) => {
    const { name, value } = e.target;
    setFilterTextValues({
      ...filterTextValues,
      [name]: value,
    });
  };

  const enterSearch = (e) => {
    console.log(e);
    if (e.key === "Enter" || e.keyCode === 13) {
      searchHandleClick();
    }
  };

  useEffect(() => {
    let filterUrl = "";
    Object.keys(filterValues).forEach((item) => {
      if (filterValues[item].length) {
        filterUrl += `&${item}=${filterValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
    return () => {
      setState({});
    };
  }, [filterValues]);

  const searchHandleClick = () => {
    let filterUrl = "";
    Object.keys(filterValues).forEach((item) => {
      if (filterValues[item].length) {
        filterUrl += `&${item}=${filterValues[item]}`;
      }
    });

    Object.keys(filterTextValues).forEach((item) => {
      if (filterTextValues[item].length) {
        filterUrl += `&${item}=${filterTextValues[item]}`;
      }
    });

    if (filterUrl) {
      setFilterUrls(filterUrl);
    }
  };

  const searchHandleCancel = () => {
    setFilterValues(filterInitialValues);
    setFilterTextValues(filterTextInitialValues);
    setFilterUrls(null);
  };

  const openCloseNote = (flag, vehicle) => {
    setNotePopup(flag);
    setNoteData(vehicle);
  };

  return (
    <div>
      <div className="row">
        <div className="col-xl-12">
          <div className="card card-height-100">
            <div className="card-header align-items-center d-flex">
              <h4 className="card-title mb-0 flex-grow-1">Notes</h4>
            </div>

            <div className="card-body">
              <div className="table-responsive table-card">
                <table className="table table-centered table-hover align-middle table-nowrap mb-0">
                  <thead>
                    <tr>
                      <td> Photo</td>
                      <td> REQ DATE</td>
                      <td> DELY DATE</td>
                      <td> Days</td>
                      <td>
                        {" "}
                        <div className="">Year</div>
                      </td>
                      <td>
                        {" "}
                        <div className="">Make</div>
                      </td>
                      <td>
                        {" "}
                        <div className="">Model</div>
                      </td>
                      <td> Color</td>
                      <td>
                        {" "}
                        <div className="">Vin</div>
                      </td>
                      <td>
                        {" "}
                        <div className="">Lot No</div>
                      </td>
                      <td> Keys</td>
                      <td> Vehicle Type</td>
                      <td> Title</td>
                      <td> Title Received Date</td>
                      <td> Loc</td>
                      <td> Status</td>
                      <td> Container No</td>
                      <td> Customer Name</td>
                      <td> Loading Type</td>
                      <td> Created Date</td>
                      <td> Note</td>
                      <td> Search</td>
                    </tr>
                    <tr>
                      <td></td>

                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="towing_request_date"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.towing_request_date}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="deliver_date"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.deliver_date}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td></td>

                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="year"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.year}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="make"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.make}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="model"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.model}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="color"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.color}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="vin"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.vin}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="lot_number"
                            onChange={handleTextFilter}
                            onKeyUp={enterSearch}
                            value={filterTextValues.lot_number}
                            className="form-control"
                          />
                        </div>
                      </td>

                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="keys"
                            onChange={handleFilter}
                            value={filterValues.keys}
                            className="form-select form-control"
                          >
                            {keysItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="vehicle_type"
                            onChange={handleFilter}
                            value={filterValues.vehicle_type}
                            className="form-select form-control"
                          >
                            {vehicleTypeItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="title"
                            onChange={handleFilter}
                            value={filterValues.title}
                            className="form-select form-control"
                          >
                            {titleItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="title_received_date"
                            onChange={handleTextFilter}
                            value={filterTextValues.title_received_date}
                            className="form-control"
                          />
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="location_id"
                            onChange={handleFilter}
                            value={filterValues.location_id}
                            className="form-select form-control"
                          >
                            {locationItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="status"
                            onChange={handleFilter}
                            value={filterValues.status}
                            className="form-select form-control"
                          >
                            {statusItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="container_no"
                            onChange={handleTextFilter}
                            value={filterTextValues.container_no}
                            className="form-control"
                          />
                        </div>
                      </td>

                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <input
                            type="text"
                            name="customer_user_id"
                            onChange={handleTextFilter}
                            value={filterTextValues.customer_user_id}
                            className="form-control"
                          />
                        </div>
                      </td>

                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="loading_type"
                            onChange={handleFilter}
                            value={filterValues.loading_type}
                            className="form-select form-control"
                          >
                            {loadingTypeItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td></td>
                      <td>
                        <div
                          className="form-group"
                          style={{ minWidth: "100px" }}
                        >
                          <select
                            name="notes"
                            onChange={handleFilter}
                            value={filterValues.notes}
                            className="form-select form-control"
                          >
                            {noteItems.map((item, index) => (
                              <option value={item.id} key={index}>
                                {item.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td>
                        <>
                          <SearchIcon
                            style={{ cursor: "pointer", margin: "7px" }}
                            onClick={searchHandleClick}
                          />
                          <CancelIcon
                            onClick={searchHandleCancel}
                            style={{ cursor: "pointer", margin: "7px" }}
                          />
                        </>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    {notes &&
                      notes.vehicle &&
                      // eslint-disable-next-line array-callback-return
                      notes.map((note) => (
                        <tr key={note.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="flex-shrink-0 me-2">
                                <img
                                  src={
                                    note.vehicle ? note.vehicle.thumbnail : ""
                                  }
                                  alt=""
                                  className="avatar-sm p-2"
                                />
                              </div>
                            </div>
                          </td>

                          <td>
                            <p className="mb-0">
                              {note.vehicle.towing_request_date}
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.deliver_date}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.age}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.year}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.make}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.model}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.color}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.vin}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.lot_number}</p>
                          </td>

                          <td>
                            <p className="mb-0">{note.vehicle.keys_name}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.note_type}</p>
                          </td>
                          <td>
                            <p className="mb-0">
                              {note.vehicle.title_type_name}
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              {note.vehicle.title_received_date}
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.location_name}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.status_name}</p>
                          </td>
                          <td>
                            <p className="mb-0">
                              {note.vehicle.container_number}
                            </p>
                          </td>

                          <td>
                            <p className="mb-0">{note.vehicle.customer_name}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.loading_type}</p>
                          </td>
                          <td>
                            <p className="mb-0">{note.vehicle.created_at}</p>
                          </td>
                          <td>
                            <p className={`mb-0`}>
                              {/* <Link
                                to=""
                                onClick={(e) => openCloseNote(true, note)}
                                className={note.vehicle.note_status.class}
                              >
                                {note.vehicle.note_status.label}
                              </Link> */}
                            </p>
                          </td>
                          <td>
                            <p className="mb-0">
                              <a
                                target="_blank"
                                href={`https://www.google.com/search?tbm=isch&as_q=${
                                  note.year
                                }++${note.vehicle.model}++${
                                  note.vehicle.make
                                }++${note.color ?? ""}`}
                                rel="noreferrer"
                              >
                                Search
                              </a>
                            </p>
                          </td>
                        </tr>
                      ))}
                    {loading && (
                      <tr>
                        <td colSpan={32}>Loading ...</td>
                      </tr>
                    )}
                    {!loading && notes.length === 0 && (
                      <tr>
                        <td colSpan={32}>No Record Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="align-items-center mt-4 pt-2 justify-content-between d-flex">
                <div className="flex-shrink-0">
                  <div className="text-muted">
                    Showing{" "}
                    <span className="fw-semibold">
                      from {metaData.from} to {metaData.to}{" "}
                    </span>
                    of <span className="fw-semibold"> {metaData.total}</span>{" "}
                    Results
                  </div>
                </div>

                <ul className="pagination pagination-separated pagination-lg mb-0">
                  <MyPagination
                    count={count}
                    currentPage={currentPage}
                    pageChange={pageChange}
                  />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NoteModal
        title=""
        openPopup={notePopup}
        setOpenPopup={setNotePopup}
        noteData={noteData}
        setCurrentPage={setCurrentPage}
      ></NoteModal>

      <ToastContainer />
    </div>
  );
}

export default Notes;
