require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const cors = require("cors");
const path = require("path"); // Required to work with file paths
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");

// express app
const app = express();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://aicte-student-management.vercel.app",
      "https://www.aicte-student-management.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));
// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("hello world");
});

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
