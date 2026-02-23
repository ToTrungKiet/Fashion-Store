import jwt from 'jsonwebtoken'

class Auth {
    async authUser(req, res, next) {
        const { token } = req.headers
        if (!token) {
            return res.json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục !' });
        }
        try {
            const token_decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.body.userId = token_decoded.id
            next()
        } catch (error) {
            console.log(error);
            return res.status(401).json({ success: false, message: error.message });
        }
    }
}

export default new Auth();