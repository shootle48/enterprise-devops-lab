const express = require("express");
const mysql = require("mysql2/promise");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

const mysqlConfig = {
  host: process.env.MYSQL_HOST || "mysql",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "rootpassword",
  database: process.env.MYSQL_DATABASE || "testdb",
};

const mongoUrl = process.env.MONGO_URL || "mongodb://mongo:27017/testdb";

app.get("/", async (req, res) => {
  let status = { mysql: "Unknow", mongo: "Unknow" };

  try {
    const conn = await mysql.createConnection(mysqlConfig);
    await conn.ping();
    status.mysql = "Connected!";
    await conn.end();
  } catch (e) {
    status.mysql = `Error ❌: ${e.message}`;
  }

  try {
    if (mongoose.connection.readyState === 1) {
      status.mongo = "Connected!";
    } else {
      await mongoose.connect(mongoUrl);
      status.mongo = "Connected!";
    }
  } catch (e) {
    status.mongo = `Error ❌: ${e.message}`;
  }

  res.json({
    message: "DevOps Enterprise Lab",
    timestamp: new Date(),
    dbStatus: status,
  });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
