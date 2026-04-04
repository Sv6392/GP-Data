import React, { useEffect, useState } from "react";
import API from "../Api";
import "./ViewData.css";

function ViewData() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Filters
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [gps, setGps] = useState([]);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBlock, setSelectedBlock] = useState("");
  const [selectedGP, setSelectedGP] = useState("");

  // Load data
  useEffect(() => {
    fetchData();
  }, [page, selectedDistrict, selectedBlock, selectedGP]);

  useEffect(() => {
    fetchDistricts();
  }, []);

  useEffect(() => {
    if (selectedDistrict) fetchBlocks();
    else {
      setBlocks([]);
      setSelectedBlock("");
      setGps([]);
      setSelectedGP("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedBlock) fetchGPs();
    else {
      setGps([]);
      setSelectedGP("");
    }
  }, [selectedBlock]);

  // API Calls
  const fetchData = async () => {
    try {
      let url = `/data?page=${page}&limit=${limit}`;
      if (selectedDistrict) url += `&district=${selectedDistrict}`;
      if (selectedBlock) url += `&block=${selectedBlock}`;
      if (selectedGP) url += `&gp=${selectedGP}`;

      const res = await API.get(url);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      alert("Error fetching data ❌");
      setData([]);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await API.get("/data/districts");
      setDistricts(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setDistricts([]);
    }
  };

  const fetchBlocks = async () => {
    try {
      const res = await API.get(`/data/blocks?district=${selectedDistrict}`);
      setBlocks(Array.isArray(res.data) ? res.data : res.data.data || []);
      setSelectedBlock("");
      setGps([]);
      setSelectedGP("");
    } catch (err) {
      console.error(err);
      setBlocks([]);
    }
  };

  const fetchGPs = async () => {
    try {
      const res = await API.get(
        `/data/gps?district=${selectedDistrict}&block=${selectedBlock}`
      );
      setGps(Array.isArray(res.data) ? res.data : res.data.data || []);
      setSelectedGP("");
    } catch (err) {
      console.error(err);
      setGps([]);
    }
  };

  return (
    <div className="view-container">
      <h2>GP Reports (All Data)</h2>

      {/* Filters */}
      <div className="filters">
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
        >
          <option value="">District</option>
          {Array.isArray(districts) &&
            districts.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
        </select>

        <select
          value={selectedBlock}
          onChange={(e) => setSelectedBlock(e.target.value)}
          disabled={!selectedDistrict}
        >
          <option value="">Block</option>
          {Array.isArray(blocks) &&
            blocks.map((b, i) => (
              <option key={i} value={b}>
                {b}
              </option>
            ))}
        </select>

        <select
          value={selectedGP}
          onChange={(e) => setSelectedGP(e.target.value)}
          disabled={!selectedBlock}
        >
          <option value="">GP Name</option>
          {Array.isArray(gps) &&
            gps.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>SN</th>
              <th>District</th>
              <th>Block</th>
              <th>GP Name</th>
              <th>LGD Code</th>
              <th>EB</th>
              <th>Solar</th>
              <th>Router Type</th>
              <th>Router SN</th>
              <th>Router IP</th>
              <th>Make Model</th>
              <th>Rack Model</th>
              <th>Rack SN</th>
              <th>Rack IP</th>
              <th>Rack Port</th>
              <th>A Host</th>
              <th>A IP</th>
              <th>A LGD</th>
              <th>A Serial</th>
              <th>A Node</th>
              <th>B Host</th>
              <th>B IP</th>
              <th>B LGD</th>
              <th>B Serial</th>
              <th>B Node</th>
              <th>FDMS</th>
              <th>Length</th>
              <th>Ring</th>
              <th>ABD</th>
              <th>FE Contact</th>
              <th>FE Name</th>
              <th>AM Contact</th>
              <th>AM Name</th>
              <th>Custodian</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((item, index) => (
                <tr key={index}>
                  <td>{item.SN}</td>
                  <td>{item.DISTRICT}</td>
                  <td>{item.BLOCK}</td>
                  <td>{item.GP_LOCATION_NAME}</td>
                  <td>{item.GP_LOCATION_LGD_CODE}</td>
                  <td>{item.EB_CONNECTION}</td>
                  <td>{item.SOLAR}</td>
                  <td>{item.ROUTER_TYPE}</td>
                  <td>{item.ROUTER_SL_NO}</td>
                  <td>{item.ROUTER_IP}</td>
                  <td>{item.MAKE_MODEL}</td>
                  <td>{item.RACK_MAKE_MODEL}</td>
                  <td>{item.RACK_SL_NO}</td>
                  <td>{item.GP_RACK_IP}</td>
                  <td>{item.GP_RACK_PORT_NO}</td>
                  <td>{item.A_END_HOST_NAME}</td>
                  <td>{item.A_END_SITE_IP}</td>
                  <td>{item.A_END_LGD_CODE}</td>
                  <td>{item.A_END_SERIAL_NO}</td>
                  <td>{item.A_END_NODE_TYPE}</td>
                  <td>{item.B_END_HOST_NAME}</td>
                  <td>{item.B_END_SITE_IP}</td>
                  <td>{item.B_END_LGD_CODE}</td>
                  <td>{item.B_END_SERIAL_NO}</td>
                  <td>{item.B_END_NODE_TYPE}</td>
                  <td>{item.FDMS_PORT}</td>
                  <td>{item.LENGTH_SITE_A_B}</td>
                  <td>{item.RING}</td>
                  <td>{item.ABD}</td>
                  <td>{item.FE_CONTACT}</td>
                  <td>{item.FE_NAME}</td>
                  <td>{item.AM_CONTACT}</td>
                  <td>{item.AM_NAME}</td>
                  <td>{item.CUSTODIAN_DETAILS}</td>
                  <td>{item.AT_STATUS}</td>
                  <td>{item.REMARKS}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="36" className="no-data">
                  No Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          ⬅ Prev
        </button>

        <span>Page {page}</span>

        <button onClick={() => setPage(page + 1)}>Next ➡</button>
      </div>
    </div>
  );
}

export default ViewData;