import jwt from "jsonwebtoken";

class Auth {
  async authUser(req, res, next) {
    let token = req.headers.token;
    
    // Hỗ trợ format Authorization: Bearer <token>
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7);
      }
    }

    if (!token) {
      return res.json({
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục !",
      });
    }
    try {
      const token_decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = token_decoded.id;
      next();
    } catch (error) {
      if (error && error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token đã hết hạn" });
      }
      return res.status(401).json({ success: false, message: error.message });
    }
  }
}

export default new Auth();
