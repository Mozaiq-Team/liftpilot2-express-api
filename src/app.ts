import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Import Routes
import accountRoutes from "./routes/account.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import eventRoutes from "./routes/event.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();
// Middleware
app.use(express.json());

// Routes
app.use("/api/accounts", accountRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/events", eventRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
