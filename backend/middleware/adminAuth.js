import jwt from 'jsonwebtoken';

class AdminAuth {
    authenticate(req, res, next) {
        try {
            const { token } = req.headers;
            if (!token) {
                return res.status(401).json({ success: false, message: "Vui lòng đăng nhập để tiếp tục !" });
            }
            const token_decode = jwt.verify(token, process.env.JWT_SECRET);
            if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
                return res.status(401).json({ success: false, message: "Bạn không có quyền truy cập !" });
            }
            next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ success: false, message: error.message });
        }
    }
}

export default new AdminAuth();