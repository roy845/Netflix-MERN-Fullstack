const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectDB = require("./config/dbConn");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const movieRoutes = require("./routes/movies");
const listRoutes = require("./routes/lists");
const disk = require("node-disk-info");
const os = require("os");

const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

const PORT = process.env.PORT || 8800;

//database connection
connectDB();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/lists", listRoutes);

app.get("/api/disk", (req, res) => {
  const disks = disk.getDiskInfoSync();
  res.json(disks);
});

app.get("/api/os", (req, res) => {
  // Get the platform (e.g. 'darwin' for macOS, 'win32' for Windows)
  const platform = os.platform();
  // Get the CPU architecture (e.g. 'x64')
  const arch = os.arch();
  // Get the hostname of the device
  const hostname = os.hostname();
  // Get the total system memory in bytes
  const totalMemory = os.totalmem();
  // Get the amount of free system memory in bytes
  const freeMemory = os.freemem();

  res.json({
    platform: platform,
    arch: arch,
    hostname: hostname,
    freeMemory: freeMemory,
    totalMemory: totalMemory,
  });
});

app.listen(8800, () =>
  console.log(`Backend server is running on PORT ${PORT}`)
);
