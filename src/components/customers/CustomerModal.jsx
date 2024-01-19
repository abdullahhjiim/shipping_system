import { Grid } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import "react-dropzone-uploader/dist/styles.css";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { ToastContainer } from "react-toastify";
import * as countryService from "../../services/CountryService";
import * as CustomerService from "../../services/CustomerService";
import Controls from "../controls/Controls";
import FileZone from "../file/FileZone";
import { Form, useForm } from "../useForm/UseForm";
import "./customers.css";

const animatedComponet = makeAnimated();

const statusItems = [
  { id: "1", title: "Active" },
  { id: "2", title: "Inactive" },
];

const initialFValues = {
  id: 0,
  legacy_customer_id: "",
  username: "",
  customer_name: "",
  email: "",
  password: "",
  phone: "",
  company_name: "",
  address_line_1: "",
  address_line_2: "",
  country_id: "",
  city_id: "",
  zip_code: "",
  status: "1",
  type: 2,
  note: "",
  file_urls: [],
};

export default function CustomerModal(props) {
  const { openPopup, setOpenPopup, addOrEdit, recordForEdit, buttonDisabled } =
    props;
  const buttonRef = useRef();
  const [errorClass, setErrorClass] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState();
  const [countryItems, setCountry] = useState([]);
  const [countryValue, setCountryValue] = useState({
    label: "Country",
  });

  const [cityValue, setCityValue] = useState({
    label: "City",
  });
  const [countryId, setCountryId] = useState(null);
  const [cityItems, setCity] = useState([]);
  const [backErrorMessage, setBackendErros] = useState({});
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const getcountry = () => {
      countryService.getAllCountriesFor().then((response) => {
        setCountry(
          response.data.map((i) => {
            return { ...i, label: i.name, value: i.id };
          })
        );
      });
    };
    const getNextCustomerId = () => {
      CustomerService.getNextCustomerId().then((response) => {
        initialFValues.legacy_customer_id = response.data.legacy_customer_id;
      });
    };
    getcountry();
    getNextCustomerId();
  }, []);

  const handleCountry = (event) => {
    if (event === null) {
      setCountryValue({ label: "Country" });
      setCityValue({ label: "City" });
      setCountryId(null);
    } else {
      const { label, value } = event;
      setCountryValue({ label, value });
      setCountryId(value);
      setValues({
        ...values,
        country_id: value,
      });
    }
  };

  const handleCity = (event) => {
    if (event === null) {
      setCityValue({ label: "City" });
      setValues({
        ...values,
        city_id: "",
      });
    } else {
      const { label, value } = event;
      setCityValue({ label, value });
      setValues({
        ...values,
        city_id: value,
      });
    }
  };

  // useEffect(() => {
  //   const getstate = (countryId) => {
  //     countryService.getStatesByCountry(countryId).then((response) => {
  //       setState(
  //         response.data.map((i) => {
  //           return { ...i, label: i.name, value: i.id };
  //         })
  //       );
  //     });
  //   };

  //   if (countryId) {
  //     getstate(countryId);
  //   }
  // }, [countryId]);

  useEffect(() => {
    const getstate = () => {
      countryService.getCitiesByCountry(countryId).then((response) => {
        setCity(
          response.data.map((i) => {
            return { ...i, label: i.name, value: i.id };
          })
        );
      });
    };
    getstate();
  }, [countryId]);

  const handleClose = () => {
    setOpenPopup(false);
    setErrorClass("");
    resetForm();
    setCountryId(null);
    setCountryValue({ label: "Country" });
    setCityValue({ label: "City" });
    setClicked(false);
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    /*
    if ("customer_user_id" in fieldValues) {
      temp.customer_user_id = fieldValues.customer_user_id
        ? ""
        : "This field is required.";
    }
    
    */

    setErrors({
      ...temp,
    });

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "");
  };

  const { values, setValues, errors, setErrors, handleInputChange, resetForm } =
    useForm(initialFValues, true, validate);

  useEffect(() => {
    if (recordForEdit != null) {
      const newArray = [];
      if (recordForEdit.customer_documents) {
        recordForEdit.customer_documents.forEach((element) => {
          newArray.push(element.uploaded_name);
        });
      }
      recordForEdit.file_urls = newArray;

      setValues({
        ...recordForEdit,
      });
      setCountryValue({
        label: recordForEdit.country_name,
        value: recordForEdit.country_id,
      });

      setCityValue({
        label: recordForEdit.city_name,
        value: recordForEdit.city_id,
      });

      setCountryId(recordForEdit.country_id);
    }
    setBackendErros({});
  }, [recordForEdit, setValues]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      addOrEdit(values, resetForm, setErrorClass, setBackendErros);
      setBackendErros({});
    }
    setClicked(false);
  };

  const submitClick = () => {
    setErrorClass("was-validated");
    setClicked(true);

    buttonRef.current.click();
    setBackendErros({});
  };

  const storeSuccess = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };
      colneValues.file_urls.push(fileName);
      setValues(colneValues);
    } else {
      initialFValues.file_urls.push(fileName);
    }
  };

  const removeFile = (fileName) => {
    if (recordForEdit != null) {
      const colneValues = { ...values };

      let index = colneValues.file_urls
        ? colneValues.file_urls.findIndex((x) => x === fileName)
        : -1;
      colneValues.file_urls.splice(index, 1);
      setValues(colneValues);
    } else {
      let index = initialFValues.file_urls
        ? initialFValues.file_urls.findIndex((x) => x === fileName)
        : -1;
      initialFValues.file_urls.splice(index, 1);
    }
  };

  console.log(cityItems);

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
          <Modal.Title>
            {recordForEdit
              ? "Update Agent and Customer"
              : "Create Agent and Customer"}
          </Modal.Title>
        </Modal.Header>
        <hr />
        <Modal.Body>
          <Form
            onSubmit={handleSubmit}
            className={`needs-validation ${errorClass}`}
          >
            <Grid container>
              <Grid item xs={12}>
                <div className="row">
                  <div className="col-md-6">
                    <h6>Type</h6>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="type"
                            id="customer"
                            value={1}
                            onChange={handleInputChange}
                            checked={values.type == 1}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="customer"
                          >
                            Customer
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check form-radio-primary mb-3">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="agent"
                            name="type"
                            value={2}
                            onChange={handleInputChange}
                            checked={values.type == 2}
                          />
                          <label className="form-check-label" htmlFor="agent">
                            Agent
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">{`${
                      values?.type == 1 ? "Customer" : "Agent"
                    } ID`}</label>
                    <Controls.Input
                      name="legacy_customer_id"
                      label={`${values?.type == 1 ? "Customer" : "Agent"} Id`}
                      value={values.legacy_customer_id}
                      onChange={handleInputChange}
                      required="required"
                    />
                    {backErrorMessage.legacy_customer_id && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.legacy_customer_id[0]}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">
                      {`${values?.type == 1 ? "Customer" : "Agent"} Name`}{" "}
                    </label>
                    <Controls.Input
                      name="customer_name"
                      label={`${values?.type == 1 ? "Customer" : "Agent"} name`}
                      value={values.customer_name}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Name.
                    </div>
                    {backErrorMessage.customer_name && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.customer_name[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Username</label>
                    <Controls.Input
                      name="username"
                      label="Username"
                      value={values.username ?? ""}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid User name.
                    </div>
                    {backErrorMessage.username && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.username[0]}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Email</label>
                    <Controls.Input
                      name="email"
                      label="Email"
                      value={values.email ?? ""}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Email.
                    </div>
                    {backErrorMessage.email && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.email[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Phone</label>
                    <Controls.Input
                      name="phone"
                      label="Phone"
                      value={values.phone}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Phone.
                    </div>
                    {backErrorMessage.phone && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.phone[0]}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Password</label>
                    <Controls.Input
                      name="password"
                      type="password"
                      label="Password"
                      value={values.password}
                      onChange={handleInputChange}
                      required={recordForEdit ? false : true}
                      // disabled={recordForEdit}
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Password
                    </div>
                    {backErrorMessage.password && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.password[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Company Name</label>
                    <Controls.Input
                      name="company_name"
                      label="Company Name"
                      value={values.company_name}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Company name.
                    </div>
                    {backErrorMessage.company_name && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.company_name[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Country</label>
                    <div className="form-group">
                      <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={{ label: "Country", value: 0 }}
                        isSearchable={true}
                        name="country_id"
                        value={countryValue}
                        options={countryItems}
                        onChange={handleCountry}
                        required
                        clearValue={true}
                        isClearable={true}
                      />
                    </div>

                    <div className="invalid-feedback">
                      Please provide a valid Country.
                    </div>
                    {clicked && !countryValue?.value && (
                      <p style={{ color: "red" }}>
                        Please provide a valid Country.
                      </p>
                    )}
                    {backErrorMessage.country_id && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.country_id[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">City</label>

                    {/* <AsyncSelect
                      components={animatedComponet}
                      loadOptions={loadCitiesOptions}
                      value={cityValue}
                      onChange={handleCityAutoInputChange}
                      defaultOptions
                      required
                    /> */}
                    <Select
                      className="basic-single"
                      classNamePrefix="select"
                      defaultValue={{ label: "City", value: 0 }}
                      isSearchable={true}
                      name="city_id"
                      value={cityValue}
                      options={cityItems}
                      onChange={handleCity}
                      required
                      isClearable
                    />
                    <div className="invalid-feedback">
                      Please provide a valid City.
                    </div>
                    {clicked && !cityValue?.value && (
                      <p style={{ color: "red" }}>
                        Please provide a valid City.
                      </p>
                    )}
                    {backErrorMessage.city_id && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.city_id[0]}
                      </p>
                    )}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Address one</label>

                    <Controls.Input
                      name="address_line_1"
                      label="Address 1"
                      value={values.address_line_1}
                      onChange={handleInputChange}
                      required="required"
                    />
                    <div className="invalid-feedback">
                      Please provide a valid Address one.
                    </div>
                    {/* {backErrorMessage.address_line_1 && (
                      <p style={{ color: "red" }}>
                        {backErrorMessage.address_line_1[0]}
                      </p>
                    )} */}
                  </div>

                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Address Two</label>
                    <Controls.Input
                      name="address_line_2"
                      label="Address 2"
                      value={values.address_line_2}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Zip Code</label>
                    <Controls.Input
                      name="zip_code"
                      label="Zip Code"
                      value={values.zip_code}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="col-md-6 form-input">
                    <label className="form-label mb-0">Note</label>
                    <textarea
                      className="form-control"
                      id="exampleFormControlTextarea5"
                      name="note"
                      placeholder="Note"
                      value={values.note}
                      onChange={handleInputChange}
                      rows="2"
                    ></textarea>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label mb-0">Status</label>
                    <select
                      className="form-select form-control"
                      data-trigger
                      name="status"
                      value={values.status ?? 1}
                      onChange={handleInputChange}
                    >
                      {statusItems.map((item, index) => (
                        <option value={item.id} key={index}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Grid>
            </Grid>
            <br />
            <FileZone
              title={`${values?.type == 1 ? "Customer" : "Agent"} Documents`}
              url="/customers/file-upload"
              storeSuccess={storeSuccess}
              removeFile={removeFile}
              existingFilesArray={
                recordForEdit ? recordForEdit?.customer_documents : []
              }
            />
            <button hidden type="submit" ref={buttonRef}></button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {buttonDisabled && <Spinner animation="border" size="sm" />}

          <Controls.Button
            text={recordForEdit ? "Update" : "Save"}
            size="medium"
            color="primary"
            onClick={submitClick}
            disabled={buttonDisabled}
          />
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}
