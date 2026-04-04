import React, { useState } from "react";
import API from "../Api";
import "./AddData.css";

function AddData() {
  const [form, setForm] = useState({
    SN: "",
    DISTRICT: "",
    BLOCK: "",
    GP_LOCATION_NAME: "",
    GP_LOCATION_LGD_CODE: "",
    EB_CONNECTION: "",
    SOLAR: "",
    ROUTER_TYPE: "",
    ROUTER_SL_NO: "",
    ROUTER_IP: "",
    MAKE_MODEL: "",
    RACK_MAKE_MODEL: "",
    RACK_SL_NO: "",
    GP_RACK_IP: "",
    GP_RACK_PORT_NO: "",
    A_END_HOST_NAME: "",
    A_END_SITE_IP: "",
    A_END_LGD_CODE: "",
    A_END_SERIAL_NO: "",
    A_END_NODE_TYPE: "",
    B_END_HOST_NAME: "",
    B_END_SITE_IP: "",
    B_END_LGD_CODE: "",
    B_END_SERIAL_NO: "",
    B_END_NODE_TYPE: "",
    FDMS_PORT: "",
    LENGTH_SITE_A_B: "",
    RING: "",
    ABD: "",
    FE_CONTACT: "",
    FE_NAME: "",
    AM_CONTACT: "",
    AM_NAME: "",
    CUSTODIAN_DETAILS: "",
    AT_STATUS: "",
    REMARKS: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/data/add", form);
      alert("Data Added Successfully ✅");

      // Reset form
      Object.keys(form).forEach(key => form[key] = "");
      setForm({ ...form });

    } catch (err) {
      console.error(err);
      alert("Error adding data ❌");
    }
  };

  const renderInput = (name, placeholder) => (
    <input
      name={name}
      placeholder={placeholder}
      value={form[name]}
      onChange={handleChange}
    />
  );

  return (
    <div className="form-container">
      <h2>GP Report Entry Form</h2>

      <div className="form-grid">
        {renderInput("SN", "Serial Number")}
        {renderInput("DISTRICT", "District")}
        {renderInput("BLOCK", "Block")}
        {renderInput("GP_LOCATION_NAME", "GP Name")}
        {renderInput("GP_LOCATION_LGD_CODE", "LGD Code")}
        {renderInput("EB_CONNECTION", "EB Connection")}
        {renderInput("SOLAR", "Solar")}
        {renderInput("ROUTER_TYPE", "Router Type")}
        {renderInput("ROUTER_SL_NO", "Router Serial No")}
        {renderInput("ROUTER_IP", "Router IP")}
        {renderInput("MAKE_MODEL", "Make Model")}
        {renderInput("RACK_MAKE_MODEL", "Rack Make Model")}
        {renderInput("RACK_SL_NO", "Rack Serial No")}
        {renderInput("GP_RACK_IP", "Rack IP")}
        {renderInput("GP_RACK_PORT_NO", "Rack Port")}
        {renderInput("A_END_HOST_NAME", "A-End Host")}
        {renderInput("A_END_SITE_IP", "A-End IP")}
        {renderInput("A_END_LGD_CODE", "A-End LGD")}
        {renderInput("A_END_SERIAL_NO", "A-End Serial")}
        {renderInput("A_END_NODE_TYPE", "A-End Node")}
        {renderInput("B_END_HOST_NAME", "B-End Host")}
        {renderInput("B_END_SITE_IP", "B-End IP")}
        {renderInput("B_END_LGD_CODE", "B-End LGD")}
        {renderInput("B_END_SERIAL_NO", "B-End Serial")}
        {renderInput("B_END_NODE_TYPE", "B-End Node")}
        {renderInput("FDMS_PORT", "FDMS Port")}
        {renderInput("LENGTH_SITE_A_B", "Link Length")}
        {renderInput("RING", "Ring")}
        {renderInput("ABD", "ABD")}
        {renderInput("FE_CONTACT", "FE Contact")}
        {renderInput("FE_NAME", "FE Name")}
        {renderInput("AM_CONTACT", "AM Contact")}
        {renderInput("AM_NAME", "AM Name")}
        {renderInput("CUSTODIAN_DETAILS", "Custodian")}
        {renderInput("AT_STATUS", "AT Status")}
        {renderInput("REMARKS", "Remarks")}
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        Submit Data
      </button>
    </div>
  );
}

export default AddData;