import express from "express";
import { getAvailableAppointments } from "../controllers/appointmentController";

const router = express.Router();

router.post("/query", getAvailableAppointments);

export default router;