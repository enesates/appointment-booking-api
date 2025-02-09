import express from "express";
import appointmentRoutes from "./routes/appointmentRoutes";

const app = express();

app.use(express.json());
app.use("/calendar", appointmentRoutes);

export default app;