const db = require("../db");

// 🔍 Find user by email
const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

// ➕ Create user (UPDATED)
const createUser = (user, callback) => {
  const sql = `
    INSERT INTO users (name, email, password, contact)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user.name, user.email, user.password, user.contact],
    callback
  );
};

module.exports = { findUserByEmail, createUser };