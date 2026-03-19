import productService from "../services/productService.js";

class ProductController {
  addProduct = async (req, res) => {
    try {
      const product = await productService.addProduct(req.body, req.files);

      return res.json({
        success: true,
        message: "Thêm sản phẩm thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  listProducts = async (req, res) => {
    try {
      const products = await productService.listProducts();

      return res.json({
        success: true,
        products,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  removeProduct = async (req, res) => {
    try {
      const product = await productService.removeProduct(req.body.id);

      return res.json({
        success: true,
        message: "Xóa thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  singleProduct = async (req, res) => {
    try {
      const product = await productService.singleProduct(req.body.productId);

      return res.json({
        success: true,
        message: "Lấy sản phẩm thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  updateProduct = async (req, res) => {
    try {
      const product = await productService.updateProduct(
        req.body.id,
        req.body,
        req.files,
      );

      return res.json({
        success: true,
        message: "Cập nhật thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  getInventory = async (req, res) => {
    try {
      const products = await productService.getInventory();
      res.json({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateProductQuantity = async (req, res) => {
    try {
      const product = await productService.updateQuantity(req.body);

      return res.json({
        success: true,
        message: "Cập nhật số lượng thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  restockProduct = async (req, res) => {
    try {
      const product = await productService.restock(req.body);

      return res.json({
        success: true,
        message: "Nhập hàng thành công !",
        product,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };

  getBestSellers = async (req, res) => {
    try {
      const products = await productService.getBestSellers();

      return res.json({
        success: true,
        message: "Top sản phẩm bán chạy !",
        products,
      });
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  };
}

export default new ProductController();
