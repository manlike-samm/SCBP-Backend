import mongoose from "mongoose";

const postOrderSchema = new mongoose.Schema({
  waiter: String,
  order: [String],
  newOrder: Boolean,
  completed: Boolean,
  cancelled: Boolean,
  payment: String,
  total: Number,
  _createdAt: {
    type: Date,
    default: new Date(),
  },
  unid: Number,
});

let PostOrder = mongoose.model("Post", postOrderSchema);

export default PostOrder;
