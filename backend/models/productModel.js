import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], default: ['Trắng', 'Đen', 'Xám'] },
    bestseller: { type: Boolean, default: false },
    sizeColorQuantity: { type: Map, of: Number, default: {} }
  },
  {
    timestamps: true,
  },
);

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
