import { Schema, model, models } from "mongoose";
const QuoteSchema = new Schema({
  company: String, country: String, contact: String, email: String, phone: String,
  product: String, quantity: Number, unit: String, destCountry: String, port: String,
  frequency: String, notes: String,
  status: { type: String, default: "nuevo" },
  crmSynced: { type: Boolean, default: false }, // pendiente: integración CRM
}, { timestamps: true });
export default models.Quote || model("Quote", QuoteSchema);
