import express from "express";
import mongoose from "mongoose";

import PostOrder from "../models/postOrder.js";

const router = express.Router();

export const getPosts = async (req, res) => {
  try {
    const postM = await PostOrder.find({}).sort({ _createdAt: -1 });

    res.status(200).json(postM);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostOrder.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const postN = new PostOrder({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await postN.save();

    res.status(201).json(postN);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await PostOrder.findByIdAndRemove(id);

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const post = await PostOrder.findById(id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }
  const updatedPost = await PostOrder.findByIdAndUpdate(id, post, {
    new: true,
  });
  res.status(200).json(updatedPost);
};

export const updateNewOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { newOrder: false, _id: id };

  await PostOrder.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export const completedOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { completed: true, _id: id };

  await PostOrder.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};
export const cancelledOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { cancelled: true, _id: id };

  await PostOrder.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};
export const paymentMethod = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  const { payment } = req.body;

  // console.log(payment);

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  const updatedPost = { payment: payment, _id: id };

  await PostOrder.findByIdAndUpdate(id, updatedPost, { new: true });

  res.json(updatedPost);
};

export default router;
