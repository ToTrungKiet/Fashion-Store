import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js';


class ProductController {
  // Route thêm sản phẩm mới
  async addProduct(req, res) {
    try {
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const image1 = req.files.image1?.[0];
        const image2 = req.files.image2?.[0];
        const image3 = req.files.image3?.[0];
        const image4 = req.files.image4?.[0];

        const images = [image1, image2, image3, image4].filter((item) => item != undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, {resource_type: 'image'})
                return result.secure_url
            })
        )

        const newProduct = {
          name,
          description,
          price: Number(price),
          category,
          subCategory,
          bestseller: bestseller === 'true' ? true : false,
          sizes: JSON.parse(sizes),
          image: imagesUrl
        }

        const product = new productModel(newProduct);
        await product.save();

        res.json({ success: true, message: 'Đã thêm 1 sản phẩm thành công !', product });

    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route danh sách sản phẩm
  async listProducts(req, res) {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route xóa sản phẩm
  async removeProduct(req, res) {
    try {
      const deleted = await productModel.findByIdAndDelete(req.body.id);
      if (!deleted) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm !" });
      }
      res.json({ success: true, message: 'Đã xóa sản phẩm thành công !', deletedProduct: deleted });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route 1 sản phẩm
  async singleProduct(req, res) {
    try {
      const { productId } = req.body;
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm !" });
      }
      res.json({ success: true, product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Route cập nhật sản phẩm
  async updateProduct(req, res) {
    try {
      const { id, name, description, price, category, subCategory, sizes, bestseller } = req.body;
      const product = await productModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Không tìm thấy sản phẩm !' });
      }

      // Cập nhật trường cơ bản
      if (name) product.name = name;
      if (description) product.description = description;
      if (price) product.price = Number(price);
      if (category) product.category = category;
      if (subCategory) product.subCategory = subCategory;
      if (typeof bestseller !== 'undefined') product.bestseller = bestseller === 'true' ? true : false;
      if (sizes) product.sizes = JSON.parse(sizes);

      // Xử lý hình ảnh mới nếu có
      const image1 = req.files.image1?.[0];
      const image2 = req.files.image2?.[0];
      const image3 = req.files.image3?.[0];
      const image4 = req.files.image4?.[0];
      const images = [image1, image2, image3, image4].filter((item) => item != undefined);
      if (images.length) {
        let imagesUrl = await Promise.all(
          images.map(async (item) => {
            let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
            return result.secure_url;
          })
        );
        // nếu gửi hình mới thì ghi đè toàn bộ mảng ảnh
        product.image = imagesUrl;
      }

      await product.save();
      res.json({ success: true, message: 'Cập nhật sản phẩm thành công !', product });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new ProductController();
