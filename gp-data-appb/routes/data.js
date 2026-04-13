const router = require("express").Router();
const db = require("../db");
const multer = require("multer");
const XLSX = require("xlsx");
const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

// -------------------- Multer Setup --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir); // ensure folder exists
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// -------------------- UPLOAD EXCEL --------------------
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded ❌");
    }

    const filePath = req.file.path;

    if (!req.file.originalname.match(/\.(xlsx|xls)$/)) {
      fs.unlinkSync(filePath);
      return res.status(400).send("Only Excel files allowed ❌");
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).send("Excel is empty ❌");
    }

    // ✅ STEP 1: Get existing LGD codes from DB
    db.query("SELECT GP_LOCATION_LGD_CODE FROM gp_reports", (err, results) => {
      if (err) {
        fs.unlinkSync(filePath);
        return res.status(500).send("DB fetch error ❌");
      }

      const existingLGD = new Set(results.map(r => r.GP_LOCATION_LGD_CODE));

      // ✅ STEP 2: Filter unique rows (DB + Excel duplicates)
      const uniqueSet = new Set();
      const filteredData = [];

      data.forEach((row) => {
        const lgd = row.GP_LOCATION_LGD_CODE;

        if (
          lgd &&
          !existingLGD.has(lgd) &&   // not in DB
          !uniqueSet.has(lgd)        // not duplicate in Excel
        ) {
          uniqueSet.add(lgd);
          filteredData.push(row);
        }
      });

      if (filteredData.length === 0) {
        fs.unlinkSync(filePath);
        return res.send("⚠️ No new unique LGD data to insert");
      }

      // ✅ STEP 3: Convert to values
      const values = filteredData.map((row) => [
        row.SN || "",
        row.DISTRICT || "",
        row.BLOCK || "",
        row.GP_LOCATION_NAME || "",
        row.GP_LOCATION_LGD_CODE || "",
        row.EB_CONNECTION || "",
        row.SOLAR || "",
        row.ROUTER_TYPE || "",
        row.ROUTER_SL_NO || "",
        row.ROUTER_IP || "",
        row.MAKE_MODEL || "",
        row.RACK_MAKE_MODEL || "",
        row.RACK_SL_NO || "",
        row.GP_RACK_IP || "",
        row.GP_RACK_PORT_NO || "",
        row.A_END_HOST_NAME || "",
        row.A_END_SITE_IP || "",
        row.A_END_LGD_CODE || "",
        row.A_END_SERIAL_NO || "",
        row.A_END_NODE_TYPE || "",
        row.B_END_HOST_NAME || "",
        row.B_END_SITE_IP || "",
        row.B_END_LGD_CODE || "",
        row.B_END_SERIAL_NO || "",
        row.B_END_NODE_TYPE || "",
        row.FDMS_PORT || "",
        row.LENGTH_SITE_A_B || "",
        row.RING || "",
        row.ABD || "",
        row.FE_CONTACT || "",
        row.FE_NAME || "",
        row.AM_CONTACT || "",
        row.AM_NAME || "",
        row.CUSTODIAN_DETAILS || "",
        row.AT_STATUS || "",
        row.REMARKS || ""
      ]);

      // ✅ STEP 4: Insert only unique rows
      const sql = `
        INSERT INTO gp_reports (
          SN, DISTRICT, BLOCK, GP_LOCATION_NAME, GP_LOCATION_LGD_CODE,
          EB_CONNECTION, SOLAR, ROUTER_TYPE, ROUTER_SL_NO, ROUTER_IP,
          MAKE_MODEL, RACK_MAKE_MODEL, RACK_SL_NO,
          GP_RACK_IP, GP_RACK_PORT_NO,
          A_END_HOST_NAME, A_END_SITE_IP, A_END_LGD_CODE,
          A_END_SERIAL_NO, A_END_NODE_TYPE,
          B_END_HOST_NAME, B_END_SITE_IP, B_END_LGD_CODE,
          B_END_SERIAL_NO, B_END_NODE_TYPE,
          FDMS_PORT, LENGTH_SITE_A_B, RING, ABD,
          FE_CONTACT, FE_NAME, AM_CONTACT, AM_NAME, CUSTODIAN_DETAILS,
          AT_STATUS, REMARKS
        ) VALUES ?
      `;

      db.query(sql, [values], (err, result) => {
        fs.unlinkSync(filePath);

        if (err) {
          console.error("DB Error:", err);
          return res.status(500).send("Insert failed ❌");
        }

        const skipped = data.length - filteredData.length;

        res.send(
          `✅ Inserted: ${filteredData.length} rows | ⚠️ Skipped: ${skipped} duplicate rows`
        );
      });
    });

  } catch (error) {
    console.error("Upload Error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).send("Server error ❌");
  }
});

// -------------------- 2. ADD DATA (MANUAL ENTRY) --------------------
router.post("/add", (req, res) => {
  const data = req.body;

  // ✅ Step 1: Check if LGD already exists
  const checkSql = "SELECT * FROM gp_reports WHERE GP_LOCATION_LGD_CODE = ?";

  db.query(checkSql, [data.GP_LOCATION_LGD_CODE], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database error ❌");
    }

    if (result.length > 0) {
      return res.status(400).send("❌ LGD Code already exists!");
    }

    // ✅ Step 2: Insert if unique
    const sql = `
      INSERT INTO gp_reports (
        SN, DISTRICT, BLOCK, GP_LOCATION_NAME, GP_LOCATION_LGD_CODE,
        EB_CONNECTION, SOLAR, ROUTER_TYPE, ROUTER_SL_NO, ROUTER_IP,
        MAKE_MODEL, RACK_MAKE_MODEL, RACK_SL_NO,
        GP_RACK_IP, GP_RACK_PORT_NO,
        A_END_HOST_NAME, A_END_SITE_IP, A_END_LGD_CODE,
        A_END_SERIAL_NO, A_END_NODE_TYPE,
        B_END_HOST_NAME, B_END_SITE_IP, B_END_LGD_CODE,
        B_END_SERIAL_NO, B_END_NODE_TYPE,
        FDMS_PORT, LENGTH_SITE_A_B, RING, ABD, FE_NAME,
        FE_CONTACT,AM_NAME, AM_CONTACT, CUSTODIAN_DETAILS,
        AT_STATUS, REMARKS
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,? ,?)
    `;

    const values = [
      data.SN, data.DISTRICT, data.BLOCK, data.GP_LOCATION_NAME, data.GP_LOCATION_LGD_CODE,
      data.EB_CONNECTION, data.SOLAR, data.ROUTER_TYPE, data.ROUTER_SL_NO, data.ROUTER_IP,
      data.MAKE_MODEL, data.RACK_MAKE_MODEL, data.RACK_SL_NO,
      data.GP_RACK_IP, data.GP_RACK_PORT_NO,
      data.A_END_HOST_NAME, data.A_END_SITE_IP, data.A_END_LGD_CODE,
      data.A_END_SERIAL_NO, data.A_END_NODE_TYPE,
      data.B_END_HOST_NAME, data.B_END_SITE_IP, data.B_END_LGD_CODE,
      data.B_END_SERIAL_NO, data.B_END_NODE_TYPE,
      data.FDMS_PORT, data.LENGTH_SITE_A_B, data.RING, data.ABD, data.FE_NAME,
      data.FE_CONTACT, data.AM_NAME, data.AM_CONTACT, data.CUSTODIAN_DETAILS,
      data.AT_STATUS, data.REMARKS
    ];

    db.query(sql, values, (err) => {
      if (err) {
        console.error("Insert Error:", err);

        // ✅ Handle duplicate from DB constraint
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).send("❌ Duplicate LGD Code not allowed!");
        }

        return res.status(500).send("Insert failed ❌");
      }

      res.send("✅ Data Added Successfully");
    });
  });
});


router.get("/", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const { district, block, gp } = req.query;

  let query = "SELECT * FROM gp_reports WHERE 1=1";
  let params = [];

  if (district) {
    query += " AND DISTRICT = ?";
    params.push(district);
  }

  if (block) {
    query += " AND BLOCK = ?";
    params.push(block);
  }

  if (gp) {
    query += " AND GP_LOCATION_NAME = ?";
    params.push(gp);
  }

  query += " ORDER BY id DESC LIMIT ?, ?";
  params.push(offset, limit);

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.get("/districts", (req, res) => {
  try {
    const query = "SELECT DISTINCT DISTRICT FROM gp_reports";

    db.query(query, (err, result) => {
      if (err) {
        console.error("DB Error (districts):", err);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching districts",
        });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No districts found",
        });
      }

      res.status(200).json({
        success: true,
        data: result.map((r) => r.DISTRICT),
      });
    });
  } catch (error) {
    console.error("Server Error (districts):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.get("/blocks", (req, res) => {
  try {
    const { district } = req.query;

    // ✅ Validation
    if (!district) {
      return res.status(400).json({
        success: false,
        message: "District is required",
      });
    }

    const query = `
      SELECT DISTINCT BLOCK 
      FROM gp_reports 
      WHERE DISTRICT = ?
    `;

    db.query(query, [district], (err, result) => {
      if (err) {
        console.error("DB Error (blocks):", err);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching blocks",
        });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No blocks found for this district",
        });
      }

      res.status(200).json({
        success: true,
        data: result.map((r) => r.BLOCK),
      });
    });
  } catch (error) {
    console.error("Server Error (blocks):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.get("/gps", (req, res) => {
  try {
    const { district, block } = req.query;

    // ✅ Validation
    if (!district || !block) {
      return res.status(400).json({
        success: false,
        message: "District and Block are required",
      });
    }

    const query = `
      SELECT DISTINCT GP_LOCATION_NAME 
      FROM gp_reports 
      WHERE DISTRICT = ? AND BLOCK = ?
    `;

    db.query(query, [district, block], (err, result) => {
      if (err) {
        console.error("DB Error (gps):", err);
        return res.status(500).json({
          success: false,
          message: "Database error while fetching GP names",
        });
      }

      if (!result || result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No GP found for selected district & block",
        });
      }

      res.status(200).json({
        success: true,
        data: result.map((r) => r.GP_LOCATION_NAME),
      });
    });
  } catch (error) {
    console.error("Server Error (gps):", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});


router.get("/search", (req, res) => {
  const block = req.query.block || "";
  const gp = req.query.gp || "";
  const download = req.query.download;

  let sql = "SELECT * FROM gp_reports WHERE 1=1";
  let params = [];

  // ✅ Filter by Block
  if (block) {
    sql += " AND BLOCK LIKE ?";
    params.push(`%${block}%`); 
  }

  // ✅ Filter by GP
  if (gp) {
    sql += " AND GP_LOCATION_NAME LIKE ?";
    params.push(`%${gp}%`);
  }


  db.query(sql, params, (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error ❌",
        error: err,
      });
    }

    // ✅ If download = true → Excel
    if (download === "true") {
      if (!result.length) {
        return res.status(404).json({
          success: false,
          message: "No data found ❌",
        });
      }

      const ws = XLSX.utils.json_to_sheet(result);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "GP_Data");

      const buffer = XLSX.write(wb, {
        type: "buffer",
        bookType: "xlsx",
      });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=GP_Report.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      return res.end(buffer);
    }

    // ✅ Normal JSON response (for Postman)
    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  });
});


// -------------------- 5. DOWNLOAD EXCEL --------------------
router.get("/download", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("GP Reports");

    db.query("SELECT * FROM gp_reports", async (err, data) => {
      if (err) return res.status(500).send(err);

      if (!data.length) return res.send("No data available");

      worksheet.columns = Object.keys(data[0]).map((key) => ({
        header: key,
        key,
        width: 20,
      }));

      data.forEach((row) => worksheet.addRow(row));

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=gp_reports.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).send("Error generating Excel file");
  }
});

module.exports = router;