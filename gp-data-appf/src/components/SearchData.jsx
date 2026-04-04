import React, { useState, useEffect } from "react";
import API from "../Api";
import "./SearchData.css";

function SearchData() {
  const [block, setBlock] = useState("");
  const [gp, setGp] = useState("");

  const [debouncedBlock, setDebouncedBlock] = useState("");
  const [debouncedGp, setDebouncedGp] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Debounce Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedBlock(block);
      setDebouncedGp(gp);
    }, 500);

    return () => clearTimeout(timer);
  }, [block, gp]);

  // ✅ Auto Search after debounce
  useEffect(() => {
    if (!debouncedBlock.trim() && !debouncedGp.trim()) {
      setData([]);
      return;
    }

    handleSearch(debouncedBlock, debouncedGp);
  }, [debouncedBlock, debouncedGp]);

  // 🔍 Search API
  const handleSearch = async (blockVal, gpVal) => {
    try {
      setLoading(true);

      const res = await API.get("/data/search", {
        params: { block: blockVal, gp: gpVal },
      });

      // ✅ FIXED: Correct data extraction
      setData(res?.data?.data || []);

    } catch (err) {
      console.error("SEARCH ERROR:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // 📥 Download Excel
  const handleDownload = async () => {
    try {
      if (!block.trim() && !gp.trim()) {
        alert("Enter Block or GP first ❌");
        return;
      }

      const res = await API.get("/data/search", {
        params: { block, gp, download: true },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "GP_Report.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {
      console.error("Download Error:", err);
      alert("Download failed ❌");
    }
  };

  return (
    <div className="search-container">
      <h3>Search GP Data</h3>

      <div className="search-box">
        <input
          placeholder="Enter Block"
          value={block}
          onChange={(e) => setBlock(e.target.value)}
        />

        <input
          placeholder="Enter GP Name"
          value={gp}
          onChange={(e) => setGp(e.target.value)}
        />

        <button onClick={() => handleSearch(block, gp)}>
          Search
        </button>

        <button className="download-btn" onClick={handleDownload}>
          Download Excel
        </button>
      </div>

      {/* ✅ Loading UI */}
      {loading && (
        <div className="loader">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {/* ✅ Table */}
      {!loading && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SN</th>
                <th>District</th>
                <th>Block</th>
                <th>GP Name</th>
                <th>LGD Code</th>
                <th>EB Connection</th>
                <th>Solar</th>
                <th>Router Type</th>
                <th>Router SL No</th>
                <th>Router IP</th>
                <th>Make Model</th>
                <th>Rack Make Model</th>
                <th>Rack SL No</th>
                <th>Rack IP</th>
                <th>Rack Port</th>
                <th>A-End Host</th>
                <th>A-End IP</th>
                <th>A-End LGD</th>
                <th>A-End Serial</th>
                <th>A-End Type</th>
                <th>B-End Host</th>
                <th>B-End IP</th>
                <th>B-End LGD</th>
                <th>B-End Serial</th>
                <th>B-End Type</th>
                <th>FDMS Port</th>
                <th>Length</th>
                <th>Ring</th>
                <th>ABD</th>
                <th>FE Contact</th>
                <th>FE Name</th>
                <th>AM Contact</th>
                <th>AM Name</th>
                <th>Custodian</th>
                <th>AT Status</th>
                <th>Remarks</th>
              </tr>
            </thead>

            <tbody>
              {data.length > 0 ? (
                data.map((item, i) => (
                  <tr key={i}>
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
                  <td colSpan="36">
                    <div className="no-data-ui">
                      <h4>No Results Found 😕</h4>
                      <p>Try different Block or GP name</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default SearchData;