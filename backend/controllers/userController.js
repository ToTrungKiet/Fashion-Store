import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

class UserController {
  // Route đăng nhập người dùng
  async loginUser(req, res) {
    try {
      const { email, password } = req.body;

      // Kiểm tra xem người dùng có tồn tại trong Database hay không
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({
          success: false,
          message: "Người dùng không tồn tại !",
        });
      }

      // So sánh mật khẩu người dùng nhập với mật khẩu đã được hash trong Database
      const isMatch = await bcrypt.compare(password, user.password);
      if(isMatch) {
        const token = createToken(user._id);
        res.json({ success: true, message: 'Đăng nhập thành công !', token });
      } else {
        res.json({ success: false, message: "Mật khẩu không đúng !" });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route đăng ký người dùng
  async registerUser(req, res) {
    try {
      const { name, email, password } = req.body;

      const exists = await userModel.findOne({ email });
      if (exists) {
        return res.json({
          success: false,
          message: "Người dùng này đã tồn tại !",
        });
      }

      // Kiểm tra tên người dùng (username): độ dài và ký tự hợp lệ
      // giới hạn từ 3 đến 30 ký tự và chỉ bao gồm chữ và số
      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.json({
          success: false,
          message: "Vui lòng nhập tên người dùng !",
        });
      }
      const username = name.trim();
      if (username.length < 3 || username.length > 30) {
        return res.json({
          success: false,
          message: "Tên người dùng phải từ 3 đến 30 ký tự !",
        });
      }
      const usernameRegex = /^[a-zA-Z]+$/;
      if (!usernameRegex.test(username)) {
        return res.json({
          success: false,
          message: "Tên người dùng chỉ được chứa chữ cái !",
        });
      }

      // Kiểm tra định dạng email và mật khẩu mạnh
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Vui lòng nhập Email hợp lệ !",
        });
      }
      const strongPassword =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!strongPassword.test(password)) {
        return res.json({
          success: false,
          message:
            "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !",
        });
      }

      // Thực hiện hash mật khẩu người dùng trước khi lưu vào Database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
      });

      const user = await newUser.save();

      const token = createToken(user._id);

      res.json({ success: true, message: 'Đăng ký thành công !' ,token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route đăng nhập quản trị viên
  async adminLogin(req, res) {
    try {
      const { email, password } = req.body;

      if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(email+password, process.env.JWT_SECRET);
        res.json({ success: true, message: 'Đăng nhập quản trị viên thành công !', token });
      } else {
        res.json({ success: false, message: "Thông tin đăng nhập không đúng !" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new UserController();
