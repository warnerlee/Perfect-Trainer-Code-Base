const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./middleware/db"); // Add this import

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

// Store server reference for graceful shutdown
const server = app.listen(PORT, () => console.log(`server started on port: ${PORT}`));

app.get("/ping", (req, res) => {
    res.send("ping response")
});

app.use("/auth", require("./routers/userRouter"));

// Graceful shutdown function
const gracefulShutdown = async (signal) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    
    // Close HTTP server first
    server.close((err) => {
        if (err) {
            console.error('Error closing HTTP server:', err);
        } else {
            console.log('HTTP server closed.');
        }
    });
    
    // Close database pool
    try {
        await db.close();
        console.log('Database connections closed.');
    } catch (err) {
        console.error('Error closing database connections:', err);
    }
    
    process.exit(0);
};

// Listen for shutdown signals
process.on('SIGINT', gracefulShutdown);  // Ctrl+C
process.on('SIGTERM', gracefulShutdown); // Docker/PM2 shutdown

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
});