import { Schema, model, models } from "mongoose";
const SupplierSchema = new Schema({
  company: String, country: String, contact: String, email: String, phone: String,
  products: String, capacity: String, certifications: String, description: String,
  status: { type: String, default: "nuevo" },
}, { timestamps: true });
export default models.Supplier || model("Supplier", SupplierSchema);
