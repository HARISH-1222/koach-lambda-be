import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit"; // Import the rate-limit package

const app = express();

import jsonHandle from "./routers/jsonHandle.router.js";
import auth from "./routers/auth.router.js";
import AppErr from "./utils/appError.js";

app.use(express.json());
app.use(cors());

// Define the rate limit
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after an hour.", // Message to send when rate limit is exceeded
  headers: true, // Enable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const corsOptions = {
  origin: "http://localhost:4200", // Allow all origins (not recommended for production)
  methods: ["GET", "POST"], // Allow all methods including OPTIONS
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use("/api/v1/auth", auth);
app.use("/api/v1/jsonHandle", jsonHandle);

app.use("*", (req, res, next) => {
  next(new AppErr(`Page Not found : ${req.originalUrl}`, 404));
});

// app.use(globleErrorHandler);

export default app;
