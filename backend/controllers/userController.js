import jwt from "jsonwebtoken";
import userService from "../services/userService.js";

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

class UserController {

  loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userService.login(email, password);
      const token = createToken(user);

      return res.json({
        success: true,
        message: "Đăng nhập thành công !",
        token
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await userService.register({ name, email, password });
      const token = createToken(user);

      return res.json({
        success: true,
        message: "Đăng ký thành công !",
        token
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userService.login(email, password);

      if (user.role !== "admin") {
        throw new Error("Không có quyền admin !");
      }

      const token = createToken(user);

      return res.json({
        success: true,
        message: "Đăng nhập admin thành công !",
        token
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  getProfile = async (req, res) => {
    try {
      const user = await userService.getProfile(req.user.id);

      return res.json({
        success: true,
        message: "Lấy profile thành công !",
        user
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  updateProfile = async (req, res) => {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);

      return res.json({
        success: true,
        message: "Cập nhật thành công !",
        user
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      await userService.changePassword(
        req.user.id,
        currentPassword,
        newPassword,
        confirmPassword
      );

      return res.json({
        success: true,
        message: "Đổi mật khẩu thành công !"
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  forgotPassword = async (req, res) => {
    try {
      await userService.forgotPassword(req.body.email);

      return res.json({
        success: true,
        message: "Đã gửi email reset password !"
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };

  resetPassword = async (req, res) => {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      await userService.resetPassword(token, newPassword, confirmPassword);

      return res.json({
        success: true,
        message: "Reset mật khẩu thành công !"
      });
    } catch (error) {
      return res.json({
        success: false,
        message: error.message
      });
    }
  };
}

export default new UserController();