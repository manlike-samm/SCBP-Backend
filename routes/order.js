import express from "express";
import {
  getPosts,
  createPost,
  updateNewOrder,
  cancelledOrder,
  completedOrder,
  paymentMethod,
} from "../controllers/orders.js";

const router = express.Router();
router.get("/", getPosts);
router.post("/", createPost);
router.patch("/:id/newOrder", updateNewOrder);
router.patch("/:id/cancelled", cancelledOrder);
router.patch("/:id/completed", completedOrder);
router.patch("/:id/payment", paymentMethod);

export default router;
