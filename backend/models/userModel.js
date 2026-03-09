import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },

  email: { type: String, required: true, unique: true, lowercase: true },

  password: { type: String, required: true },

  cartData: { type: Object, default: {} },

  firstName: { type: String, default: "" },

  lastName: { type: String, default: "" },

  address: { type: String, default: "" },

  ward: { type: String, default: "" },

  district: { type: String, default: "" },

  city: { type: String, default: "" },

  phone: { type: String, default: "" },

  resetPasswordToken: { type: String, default: null },

  resetPasswordExpires: { type: Date, default: null }

}, 
{
  minimize: false,
  timestamps: true
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;