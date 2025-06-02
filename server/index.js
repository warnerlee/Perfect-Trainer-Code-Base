const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',  // Allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Custom headers
  credentials: true,  // Allow cookies or authorization headers if needed
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => console.log(`server started on port: ${PORT}`));

app.get("/ping", (req, res) => {
    res.send("ping response")
});

app.use("/auth", require("./routers/userRouter"));
app.use("/customer", require("./routers/customerRouter"));