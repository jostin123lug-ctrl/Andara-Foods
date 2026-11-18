import { Schema, model, models } from "mongoose";
const ProductSchema = new Schema({
  slug: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true, index: true },
  description: String,
  origin: { type: String, default: "Ecuador" },
  presentations: [String],
  technical: String,
  isDemo: { type: Boolean, default: true },
}, { timestamps: true });
export default models.Product || model("Product", ProductSchema);
