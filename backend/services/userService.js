import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "validator";
import userModel from "../models/userModel.js";
import emailConfig from "../config/email.js";

class UserService {
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Người dùng không tồn tại !");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Mật khẩu không đúng !");

    return user;
  }

  async register({ name, email, password }) {
    const exists = await userModel.findOne({ email });
    if (exists) throw new Error("Email đã tồn tại !");

    // Kiểm tra tên người dùng (username): độ dài và ký tự hợp lệ
    // giới hạn từ 3 đến 30 ký tự và chỉ bao gồm chữ và số
    if (!name || typeof name !== "string" || name.trim().length === 0)
      throw new Error("Vui lòng nhập tên người dùng !");

    const username = name.trim();
    if (username.length < 3 || username.length > 30)
      throw new Error("Tên người dùng phải từ 3 đến 30 ký tự !");

    const usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(username))
      throw new Error("Tên người dùng chỉ được chứa chữ cái !");

    // Kiểm tra định dạng email và mật khẩu mạnh
    if (!validator.isEmail(email)) throw new Error("Email không hợp lệ !");

    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(password))
      throw new Error(
        "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !",
      );

    // Thực hiện hash mật khẩu người dùng trước khi lưu vào Database
    const hashed = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashed,
    });

    const user = await newUser.save();

    return user;
  }

  async getProfile(userId) {
    const user = await userModel.findById(userId).select("-password");
    if (!user) throw new Error("Không tìm thấy user !");
    return user;
  }

  async updateProfile(userId, data) {
    const user = await userModel.findByIdAndUpdate(userId, data, {
      new: true,
    });

    if (!user) throw new Error("Không tìm thấy user !");
    return user;
  }

  async changePassword(userId, currentPassword, newPassword, confirmPassword) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("Không tìm thấy user !");

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) throw new Error("Sai mật khẩu hiện tại !");

    // Kiểm tra mật khẩu mới và xác nhận khớp nhau
    if (newPassword !== confirmPassword)
      throw new Error("Mật khẩu xác nhận không khớp !");

    // Kiểm tra mật khẩu mới có mạnh không
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(newPassword))
      throw new Error(
        "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !",
      );

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
  }

  async forgotPassword(email) {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Email không tồn tại !");

    // Kiểm tra email hợp lệ
    if (!validator.isEmail(email)) throw new Error("Vui lòng nhập Email hợp lệ !");

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    const isSent = await emailConfig.sendResetPasswordEmail(email, resetToken);

    if (!isSent) throw new Error("Gửi email thất bại, vui lòng thử lại !");

    return true;
  }

  async resetPassword(token, newPassword, confirmPassword) {
    if (!token) throw new Error("Token không được cung cấp !");

    // Kiểm tra mật khẩu mới
    if (!newPassword || !confirmPassword)
      throw new Error("Vui lòng nhập mật khẩu mới !");

    // Kiểm tra mật khẩu mới có mạnh không
    const strongPassword =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!strongPassword.test(newPassword))
      throw new Error(
        "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !",
      );

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error("Token không hợp lệ hoặc hết hạn !");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
  }
}

export default new UserService();
