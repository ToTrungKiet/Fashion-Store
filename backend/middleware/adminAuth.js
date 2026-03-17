class AdminAuth {
  authenticate(req, res, next) {
    try {
      if (req.user.role !== "admin") {
        return res.json({
          success: false,
          message: "Bạn không có quyền truy cập !",
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new AdminAuth();
