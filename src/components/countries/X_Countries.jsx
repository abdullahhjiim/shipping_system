import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import EyeIcon from "@material-ui/icons/RemoveRedEye";
import MaterialTable from "material-table";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as CountryService from "../../services/CountryService";
import MaterialTableIcon from "../icons/MaterialTableIcon";
import { PatchedPagination } from "../pagination/PatchedPagination";
import Popup from "../popup/Popup";
import "./countries.css";
import CountryForm from "./CountryForm";
import CountryView from "./CountryView";

const Countries = () => {
  const authData = useSelector((state) => state.auth);
  const tableRef = useRef();
  const [recordForEdit, setRecordForEdit] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [viewPopup, setViewPopup] = useState(false);
  const [recordForView, setRecordForView] = useState(null);

  const addEditRecord = (id, type) => {
    setOpenPopup(true);
    setRecordForEdit(null);
  };
  const handleClick = (e, rowData, type) => {
    if (type === "edit") {
      setRecordForEdit(rowData);
      setOpenPopup(true);
    } else if (type === "delete") {
      if (window.confirm("Are your sure to delete..??")) {
        CountryService.deleteCountry(rowData)
          .then((response) => {
            toastMessageShow("success", response.data.message);
            tableRef.current.onQueryChange();
          })
          .catch((err) => {
            toastMessageShow("error", "Something went Wrong !!!");
          });
      }
    } else if (type === "view") {
      setViewPopup(true);
      setRecordForView(rowData);
    }
  };

  const addOrEdit = (location, resetForm) => {
    if (location.id === 0) {
      CountryService.insertCountry(location)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong  !!!");
        });
    } else {
      CountryService.updateCountry(location)
        .then((response) => {
          toastMessageShow("success", response.data.message);
          tableRef.current.onQueryChange();
        })
        .catch((err) => {
          toastMessageShow("error", "Something went Wrong !!!");
        });
    }

    resetForm();
    setRecordForEdit(null);
    setOpenPopup(false);
  };

  const toastMessageShow = (type, message) => {
    toast[type](message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const columns = [
    {
      title: "ID",
      field: "id",
      filtering: false,
      align: "center",
      cellStyle: {
        cellWidth: "10%",
      },
    },
    {
      title: "Name",
      field: "name",
      align: "left",
      cellStyle: {
        cellWidth: "25%",
      },
    },
    {
      title: "Short Code",
      field: "short_code",
      align: "left",
      cellStyle: {
        cellWidth: "25%",
      },
    },
    {
      title: "Status",
      field: "status",
      align: "left",
      cellStyle: {
        cellWidth: "25%",
      },
      render: (rowData) => (
        <>
          {rowData.status.toString() === "1" ? (
            <span className="badge badge-soft-success"> Active </span>
          ) : (
            <span className="badge badge-soft-danger"> In-Active </span>
          )}
        </>
      ),
      lookup: { 1: "Active", 2: "In-Active" },
    },
    {
      title: "Action",
      field: "id",
      filtering: false,
      render: (rowData) => (
        <>
          {authData.permissions?.["countries.view"] && (
            <EyeIcon
              style={{
                margin: "7px",
                cursor: "pointer",
              }}
              onClick={(e) => handleClick(e, rowData, "view")}
              className="view-button"
            />
          )}
          {authData.permissions?.["countries.update"] && (
            <EditIcon
              style={{ margin: "7px", cursor: "pointer" }}
              onClick={(e) => handleClick(e, rowData, "edit")}
            />
          )}
          {authData.permissions?.["countries.destroy"] && (
            <DeleteIcon
              style={{ margin: "7px", cursor: "pointer" }}
              onClick={(e) => handleClick(e, rowData.id, "delete")}
            />
          )}
        </>
      ),
    },
  ];
  return (
    <>
      <div style={{ maxWidth: "100%" }}>
        <MaterialTable
          components={{
            Pagination: PatchedPagination,
          }}
          tableRef={tableRef}
          icons={MaterialTableIcon}
          flex={1}
          title="Country Data"
          columns={columns}
          data={(query) =>
            new Promise((resolve, reject) => {
              const _token = localStorage.getItem("_token");
              let url = `${process.env.REACT_APP_API_BASE_URL}/countries?`;
              url += "limit=" + query.pageSize;
              url += "&page=" + (query.page + 1);

              if (query.search) {
                url += "&q=" + query.search;
              }

              if (query.orderBy) {
                url += `&sort=${query.orderBy.field}$order=${query.orderDirection}`;
              }

              if (query.filters.length) {
                // eslint-disable-next-line array-callback-return
                const filter = query.filters.map((filter) => {
                  if (filter.value.length > 0) {
                    return `&${filter.column.field}${filter.operator}${filter.value}`;
                  }
                });
                url += filter.join("");
              }

              console.log(url);
              fetch(url, { headers: { Authorization: `Bearer ${_token}` } })
                .then((res) => res.json())
                .then((result) => {
                  const totalData = result.meta.total;
                  resolve({
                    data: result.data,
                    page: result.meta.current_page - 1,
                    totalCount: totalData,
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            })
          }
          actions={[
            {
              icon: MaterialTableIcon.Add,
              tooltip: "Add Country",
              isFreeAction: true,
              onClick: (event, rowData) => addEditRecord("", "add"),
              // hidden: !authData.permissions?.["countries.store"],
            },
          ]}
          options={{
            // selection: true,
            filtering: true,
            sorting: true,
            debounceInterval: 900,
            padding: "dense",
            actionsColumnIndex: -1,
            tableLayout: "auto",
          }}
        />

        <Popup
          title="Country Form"
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <CountryForm recordForEdit={recordForEdit} addOrEdit={addOrEdit} />
        </Popup>

        <Popup
          title="Country View"
          openPopup={viewPopup}
          setOpenPopup={setViewPopup}
        >
          <CountryView recordData={recordForView} />
        </Popup>
      </div>
      <ToastContainer />
    </>
  );
};

export default Countries;
