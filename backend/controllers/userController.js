import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import userModel from "../models/userModel.js";
import { sendResetPasswordEmail } from "../config/email.js";

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
        res.json({
          success: true,
          message: "Đăng nhập thành công !",
          token
        });
      } else {
        res.json({ success: false, message: "Mật khẩu không đúng !" });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
  // Route lấy thông tin profile
  async getProfile(req, res) {

    try {
  
      const { userId } = req.body
  
      const user = await userModel.findById(userId).select("-password")
  
      if (!user) {
        return res.json({
          success:false,
          message:"Không tìm thấy user"
        })
      }
  
      res.json({
        success:true,
        user
      })
  
    } catch (error) {
  
      console.log(error)
      res.json({
        success:false,
        message:error.message
      })
  
    }
  
  }
async updateProfile(req, res) {
  try {

    const { userId, firstName, lastName, email, address, ward, district, city, phone } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        email,
        address,
        ward,
        district,
        city,
        phone
      },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.json({
        success: false,
        message: "Không tìm thấy user"
      });
    }

    res.json({
      success: true,
      message: "Cập nhật thành công",
      user
    });

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

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

      res.json({ success: true, message: 'Đăng ký thành công !', token });
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

  // Route yêu cầu đặt lại mật khẩu
  async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      // Kiểm tra email hợp lệ
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Vui lòng nhập Email hợp lệ !"
        });
      }

      // Tìm người dùng theo email
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({
          success: false,
          message: "Email không tồn tại trong hệ thống !"
        });
      }

      // Tạo reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Lưu token vào database (token sẽ hết hạn sau 1 giờ)
      user.resetPasswordToken = resetTokenHash;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 giờ
      await user.save();

      // Gửi email
      const emailSent = await sendResetPasswordEmail(email, resetToken);

      if (emailSent) {
        res.json({
          success: true,
          message: "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn !"
        });
      } else {
        return res.json({
          success: false,
          message: "Lỗi khi gửi email. Vui lòng thử lại sau !"
        });
      }

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route xác thực token và đặt lại mật khẩu
  async resetPassword(req, res) {
    try {
      const { token, newPassword, confirmPassword } = req.body;

      // Kiểm tra token
      if (!token) {
        return res.json({
          success: false,
          message: "Token không được cung cấp !"
        });
      }

      // Kiểm tra mật khẩu mới
      if (!newPassword || !confirmPassword) {
        return res.json({
          success: false,
          message: "Vui lòng nhập mật khẩu mới !"
        });
      }

      if (newPassword !== confirmPassword) {
        return res.json({
          success: false,
          message: "Mật khẩu xác nhận không khớp !"
        });
      }

      const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
      if (!strongPassword.test(newPassword)) {
        return res.json({
          success: false,
          message: "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !"
        });
      }

      // Hash token để so sánh
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

      // Tìm người dùng với token và kiểm tra hạn
      const user = await userModel.findOne({
        resetPasswordToken: tokenHash,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        return res.json({
          success: false,
          message: "Token không hợp lệ hoặc đã hết hạn !"
        });
      }

      // Hash mật khẩu mới
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Cập nhật mật khẩu và xóa reset token
      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();

      res.json({
        success: true,
        message: "Mật khẩu đã được đặt lại thành công !"
      });

     } catch (error) {
       console.log(error);
       res.status(500).json({ success: false, message: error.message });
     }
   }

   // Route thay đổi mật khẩu khi đã đăng nhập
   async changePassword(req, res) {
     try {
       const { userId, currentPassword, newPassword, confirmPassword } = req.body;

       // Kiểm tra các trường bắt buộc
       if (!currentPassword || !newPassword || !confirmPassword) {
         return res.json({
           success: false,
           message: "Vui lòng nhập đầy đủ thông tin !"
         });
       }

       // Kiểm tra mật khẩu mới và xác nhận khớp nhau
       if (newPassword !== confirmPassword) {
         return res.json({
           success: false,
           message: "Mật khẩu xác nhận không khớp !"
         });
       }

       // Kiểm tra mật khẩu mới có mạnh không
       const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
       if (!strongPassword.test(newPassword)) {
         return res.json({
           success: false,
           message: "Mật khẩu ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt !"
         });
       }

       // Tìm người dùng
       const user = await userModel.findById(userId);
       if (!user) {
         return res.json({
           success: false,
           message: "Không tìm thấy người dùng !"
         });
       }

       // Kiểm tra mật khẩu hiện tại
       const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
       if (!isPasswordMatch) {
         return res.json({
           success: false,
           message: "Mật khẩu hiện tại không đúng !"
         });
       }

       // Hash mật khẩu mới
       const hashedPassword = await bcrypt.hash(newPassword, 10);

       // Cập nhật mật khẩu
       user.password = hashedPassword;
       await user.save();

       res.json({
         success: true,
         message: "Mật khẩu đã được thay đổi thành công !"
       });

     } catch (error) {
       console.log(error);
       res.status(500).json({ success: false, message: error.message });
     }
   }
 }
 
 export default new UserController();
