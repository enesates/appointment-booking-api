import express from "express";
import { getAvailableAppointmentsHandler } from "../controllers/appointmentController";

const router = express.Router();

router.post("/query", getAvailableAppointmentsHandler);

export default router;