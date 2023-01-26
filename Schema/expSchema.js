import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const expSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Exp", expSchema);
