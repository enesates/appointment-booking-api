import express from "express";
import { getAvailableSlotsHandler } from "../controllers/appointmentController";

const router = express.Router();

router.post("/query", getAvailableSlotsHandler);

export default router;