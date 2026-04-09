import { Router, Request, Response } from "express";
import { getImage } from "../controllers/image.controller";

const router: import('express').Router = Router();

// Handle CORS preflight requests
router.options("/:id", (req: Request, res: Response) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.status(200).send();
});

// @route   GET /api/images/:id
// @desc    Get image by ID
// @access  Public
router.get("/:id", getImage);

export default router;
